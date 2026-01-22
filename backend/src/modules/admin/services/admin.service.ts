import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getFirstTwoWords } from 'src/utils/helpers';
import { CreateProductDto } from '../dto/create-product.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
          image: true,
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
        avatar: u.image,
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
          categories: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = products.map((p: any) => {
      return {
        id: p.id,
        title: getFirstTwoWords(p.title),
        categories: p.categories,
        price: p.price ?? null,
        status: p.status ?? 'Available',
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

  async createProduct(dto: CreateProductDto, files: Express.Multer.File[]) {
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Process and save images
    const imageUrls: string[] = [];
    for (const file of files) {
      const ext = path.extname(file.originalname) || '.jpg';
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to disk
      fs.writeFileSync(filepath, file.buffer);

      // Store relative URL
      imageUrls.push(`/uploads/products/${filename}`);
    }

    // Primary image is first, rest are secondary
    const primaryImage = imageUrls[0];
    const secondaryImages = imageUrls.slice(1);

    // Format dimensions string if provided
    let dimensionsStr: string | undefined;
    if (dto.dimensions) {
      const { length, width, height, unit } = dto.dimensions;
      if (length && width && height) {
        dimensionsStr = `${length} x ${width} x ${height} ${unit}`;
      }
    }

    // Create product in database
    const product = await this.prisma.product.create({
      data: {
        title: dto.name,
        price: dto.price,
        availability: dto.status,
        about_item: dto.description || '',
        primary_image: primaryImage,
        images: secondaryImages,
        categories: dto.categories,
        package_dimensions: dimensionsStr,
        item_model_number: dto.sku,
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      product,
    };
  }

  async updateProduct(id: string, dto: any, files: Express.Multer.File[]) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;

    // Handle images (replace if new ones uploaded)
    let primaryImage = product.primary_image;
    let secondaryImages = product.images || [];
    if (files && files.length > 0) {
      // Save new images as in createProduct
      const fs = require('fs');
      const path = require('path');
      const { v4: uuidv4 } = require('uuid');
      const uploadDir = path.join(process.cwd(), 'uploads', 'products');
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      const imageUrls: string[] = [];
      for (const file of files) {
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);
        imageUrls.push(`/uploads/products/${filename}`);
      }
      primaryImage = imageUrls[0];
      secondaryImages = imageUrls.slice(1);
    }

    // Dimensions formatting
    let dimensionsStr: string | undefined;
    if (dto.dimensions) {
      try {
        const dims =
          typeof dto.dimensions === 'string'
            ? JSON.parse(dto.dimensions)
            : dto.dimensions;
        const { length, width, height, unit } = dims;
        if (length && width && height) {
          dimensionsStr = `${length} x ${width} x ${height} ${unit}`;
        }
      } catch {}
    }

    // Update product
    return await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.name ?? dto.title,
        item_model_number: dto.sku,
        categories: dto.categories
          ? typeof dto.categories === 'string'
            ? JSON.parse(dto.categories)
            : dto.categories
          : undefined,
        price: dto.price ? parseFloat(dto.price) : undefined,
        discount: dto.discount,
        availability: dto.status,
        about_item: dto.description,
        package_dimensions: dimensionsStr,
        primary_image: primaryImage,
        images: secondaryImages,
      },
    });
  }

  async deleteUserAndRelations(userId: number): Promise<boolean> {
    // Delete related tables first (order matters due to FK constraints)
    await this.prisma.wishlist.deleteMany({ where: { userId } });
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    await this.prisma.order.deleteMany({ where: { userId } });
    await this.prisma.comment.deleteMany({ where: { userId } });

    // Then delete the user
    const user = await this.prisma.user
      .delete({ where: { id: userId } })
      .catch(() => null);
    return !!user;
  }

  async deleteProductAndRelations(productId: string): Promise<boolean> {
    // Delete related tables first (order matters due to FK constraints)
    await this.prisma.wishlist.deleteMany({ where: { productId } });
    await this.prisma.cartItem.deleteMany({ where: { productId } });
    await this.prisma.comment.deleteMany({ where: { productId } });

    // Then delete the product
    const product = await this.prisma.product
      .delete({ where: { id: productId } })
      .catch(() => null);
    return !!product;
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}
