import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getFirstTwoWords } from 'src/utils/helpers';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns paginated customers with order count and total spent
   */
  async getCustomers(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          _count: { select: { orders: true } },
          orders: { select: { price: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const customers = users.map((u) => {
      const ordersCount = u._count?.orders ?? u.orders?.length ?? 0;
      const totalSpent = (u.orders || []).reduce(
        (sum, o) => sum + Number(o.price ?? 0),
        0,
      );
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        ordersCount,
        totalSpent,
      };
    });

    return {
      data: customers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getOrders(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      const qNum = Number(q);
      const or: any[] = [];

      // if q is a number, allow id exact match
      if (!Number.isNaN(qNum)) {
        or.push({ id: qNum });
      }

      // use the actual relation name 'user' (not 'customer') and string contains
      or.push(
        { user: { firstName: { contains: q, mode: 'insensitive' as const } } },
        { user: { lastName: { contains: q, mode: 'insensitive' as const } } },
        { user: { email: { contains: q, mode: 'insensitive' as const } } },
      );

      where.OR = or;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { addedAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const data = orders.map((o) => ({
      id: o.id,
      date: o.addedAt, // return raw date (client can format)
      customer: o.user
        ? {
            id: o.user.id,
            firstName: o.user.firstName,
            lastName: o.user.lastName,
            email: o.user.email,
          }
        : null,
      total: o.price,
      status: 'COMPLETED',
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  // New: paginated products list for admin
  async getProducts(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search && search.trim()) {
      const q = search.trim();
      const or: any[] = [];

      // text matches against common product fields
      or.push({ title: { contains: q, mode: 'insensitive' as const } });

      where.OR = or;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { addedAt: 'desc' },
        select: {
          id: true,
          title: true,
          price: true,
          primary_image: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = products.map((p: any) => {
      return {
        id: p.id,
        title: getFirstTwoWords(p.title),
        category:
          p.categories && p.categories.length > 0 ? p.categories[0].name : null,
        price: p.price ?? null,
        status: p.status ?? 'Unknown',
        primary_image: p.primary_image ?? null,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getDashboard(recentLimit = 5) {
    // total revenue (sum of order.total)
    const revenueAgg = await this.prisma.order.aggregate({
      _sum: { price: true },
    });
    const totalRevenue = Number(revenueAgg._sum?.price ?? 0);

    // total orders
    const totalOrders = await this.prisma.order.count();

    // average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // active customers = users with at least one order
    const activeCustomers = await this.prisma.user.count({
      where: { orders: { some: {} } },
    });

    // recent orders with customer info
    const recentOrders = await this.prisma.order.findMany({
      take: recentLimit,
      orderBy: { addedAt: 'desc' },
      select: {
        id: true,
        addedAt: true,
        price: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return {
      stats: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        activeCustomers,
      },
      recentOrders,
    };
  }

  async getRevenueSeries() {
    // fetch all orders sorted by date ascending
    const orders = await this.prisma.order.findMany({
      select: { addedAt: true, price: true },
      orderBy: { addedAt: 'asc' },
    });

    console.log('Fetched orders for revenue series:', orders);
    if (orders.length === 0) {
      return { data: [] };
    }

    // determine start (first order date) and end (last order date or today)
    const firstDate = new Date(orders[0].addedAt);
    const lastDate = new Date(orders[orders.length - 1].addedAt);
    const today = new Date();

    const start = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate(),
      0,
      0,
      0,
      0,
    );
    const end = new Date(Math.max(lastDate.getTime(), today.getTime()));
    end.setHours(23, 59, 59, 999);

    // calculate number of days between start and end
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end.getTime() - start.getTime()) / msPerDay) + 1;

    // initialize map for each day from start to end
    const map = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      map.set(key, 0);
    }

    // bucket orders by day
    for (const o of orders) {
      const key = new Date(o.addedAt).toISOString().slice(0, 10);
      map.set(key, (map.get(key) || 0) + Number(o.price || 0));
    }

    const series = Array.from(map.entries()).map(([date, total]) => ({
      date,
      total,
    }));
    return { data: series };
  }
}
