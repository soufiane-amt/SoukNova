'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  Package,
  ShoppingCart,
  Heart,
  Clock,
  Calendar,
  CreditCard,
  MapPin,
  Smartphone,
  User,
  Activity, 
  ArrowLeft,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { poppins } from '@/layout';

type Order = {
  id: number | string;
  date: string;
  status: string;
  total: number;
};

type LoginSession = {
  date: string;
  ip: string;
  device?: string;
};

type TimelineEvent = {
  date: string;
  type: string;
  description: string;
};

type WishlistItem = {
  productId: string;
  productName: string;
  image?: string;
  addedAt: string;
};

type CartItem = {
  productId: string;
  productName: string;
  image?: string;
  quantity: number;
  addedAt: string;
};

type CustomerActivity = {
  account: {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: string;
    avatar?: string;
  };
  orderStats: {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
  };
  recentOrders: Order[];
  recentLogins: LoginSession[];
  timeline: TimelineEvent[];
  wishlist: WishlistItem[];
  cart: CartItem[];
};

// --- HELPER COMPONENTS ---

const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ title, icon: Icon }: { title: string; icon?: any }) => (
  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
    <h3 className="font-semibold text-gray-900">{title}</h3>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  let colorClass = 'bg-gray-100 text-gray-700';
  if (s === 'completed' || s === 'paid' || s === 'delivered')
    colorClass = 'bg-green-100 text-green-700 border-green-200';
  if (s === 'pending' || s === 'processing')
    colorClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (s === 'cancelled' || s === 'failed')
    colorClass = 'bg-red-50 text-red-700 border-red-200';

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {status}
    </span>
  );
};

// --- MAIN PAGE ---

export default function CustomerActivityPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<CustomerActivity | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customers/${params.id}/activity`,
          {
            credentials: 'include',
            headers: { Accept: 'application/json' },
          },
        );
        if (!res.ok)
          throw new Error((await res.text()) || 'Failed to fetch activity');
        const json = await res.json();
        setActivity(json.data || null);
        setUserStatus(json.data?.account?.status || null);
      } catch (err: any) {
        setError(err?.message || 'Unable to load activity');
        setActivity(null);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchActivity();
  }, [params.id]);

  function formatCurrency(n: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(n);
  }

  function formatDate(d: string | number) {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatDateTime(d: string | number) {
    return new Date(d).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const handleFreezeUser = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customers/${account.id}/freeze`,
      { method: 'PATCH', credentials: 'include' },
    );
    if (res.ok) {
      setUserStatus('frozen');
    }
  };

  const handleUnFreezeUser = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customers/${account.id}/unfreeze`,
      { method: 'PATCH', credentials: 'include' },
    );
    if (res.ok) {
      setUserStatus('active');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading customer profile...</p>
        </div>
      </div>
    );

  if (error || !activity)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <div className="text-red-500 mb-4 bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            !
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-6">{error || 'Customer not found.'}</p>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const {
    account,
    orderStats,
    recentOrders,
    recentLogins,
    timeline,
    wishlist,
    cart,
  } = activity;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation / Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customers
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {account.avatar ? (
                <img
                  src={account.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-2xl font-bold border-4 border-white shadow-sm">
                  {String(account.firstName || account.email)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {account.firstName} {account.lastName}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {account.email}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Joined{' '}
                    {formatDate(account.registeredAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex gap-2 ${poppins.className}`}>
              {userStatus === 'frozen' ? (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm shadow-green-200 transition-all"
                  onClick={handleUnFreezeUser}
                >
                  Unfreeze user
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
                  onClick={handleFreezeUser}
                >
                  Freeze user
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {orderStats.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Package className="w-6 h-6" />
            </div>
          </Card>
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Spent
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(orderStats.totalSpent)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <CreditCard className="w-6 h-6" />
            </div>
          </Card>
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Avg. Order Value
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(orderStats.avgOrderValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Activity className="w-6 h-6" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Main Activity) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders Table */}
            <Card>
              <CardHeader title="Recent Orders" icon={Package} />
              <div className="overflow-x-auto">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No orders placed yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">Order ID</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">
                          Total
                        </th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-medium text-xs"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader title="Activity Timeline" icon={Clock} />
              <div className="p-6">
                {timeline.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No recent activity recorded.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-2">
                    {timeline.map((event, i) => (
                      <div key={i} className="relative pl-8">
                        <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 border-blue-100">
                          <span className="block w-2 h-2 bg-blue-500 rounded-full mx-auto mt-[2px]"></span>
                        </span>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {event.type}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {event.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 mt-1 sm:mt-0 whitespace-nowrap">
                            {formatDateTime(event.date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN (Auxiliary Info) */}
          <div className="space-y-8">
            {/* Cart */}
            <Card>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">Cart</h3>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <div className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                    Cart is empty
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => {
                      const productImgSrc = item.image!.startsWith('http')
                        ? item.image
                        : `${process.env.NEXT_PUBLIC_API_URL}${item.image}`;

                      return (
                        <li
                          key={item.productId}
                          className="flex gap-3 items-start"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            {productImgSrc ? (
                              <img
                                src={productImgSrc}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 m-auto mt-2 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatDate(item.addedAt)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Card>

            {/* Wishlist */}
            <Card>
              <CardHeader title="Wishlist" icon={Heart} />
              <div className="p-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                    Wishlist is empty
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {wishlist.map((item) => {
                      const productImgSrc = item.image!.startsWith('http')
                        ? item.image
                        : `${process.env.NEXT_PUBLIC_API_URL}${item.image}`;

                      return (
                        <li
                          key={item.productId}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            {productImgSrc && (
                              <img
                                src={productImgSrc}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 flex-1 truncate">
                            {item.productName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(item.addedAt)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Card>

            {/* Recent Logins */}
            <Card>
              <CardHeader title="Login Sessions" icon={MapPin} />
              <div className="divide-y divide-gray-100">
                {recentLogins.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No login data.
                  </div>
                ) : (
                  recentLogins.slice(0, 5).map((s, i) => (
                    <div
                      key={i}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {s.ip}
                          </p>
                          <p className="text-xs text-gray-500">
                            {s.device || 'Unknown Device'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(s.date)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
