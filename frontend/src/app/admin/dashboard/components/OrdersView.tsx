import React, { JSX, useEffect, useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import StatusBadge from './StatusBadge';

type OrderItem = {
  id: string | number;
  date: string;
  customer: {
    id?: string | number;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  total: number;
  status: string;
};

type OrdersResponse = {
  data: OrderItem[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

export default function OrdersView(): JSX.Element {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(page, limit, search), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  async function fetchOrders(pageNum = 1, pageLimit = limit, q = '') {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      params.append('limit', String(pageLimit));
      if (q && q.trim()) params.append('search', q.trim());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch orders');
      }

      const json: OrdersResponse = await res.json();
      setOrders(json.data || []);
      const meta = json.meta;
      if (meta) {
        setPage(meta.page || pageNum);
        setTotal(meta.total ?? json.data.length);
        setTotalPages(
          meta.totalPages ??
            Math.max(
              1,
              Math.ceil((meta.total ?? json.data.length) / pageLimit),
            ),
        );
      } else {
        setPage(pageNum);
        setTotal(json.data.length);
        setTotalPages(Math.max(1, Math.ceil(json.data.length / pageLimit)));
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Unable to load orders');
      setOrders([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(n: number) {
    if (n < 1 || n > totalPages || n === page) return;
    setPage(n);
  }

  function formatCurrency(n: number) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(n);
    } catch {
      return `$${n.toFixed(2)}`;
    }
  }

  function formatDate(d: string | number) {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">
            Recent orders with status and totals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-transparent">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search by order id, customer..."
              className="bg-transparent outline-none text-sm w-64 placeholder-gray-400"
            />
          </div>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="text-sm border border-gray-200 rounded-md px-2 py-1"
            aria-label="Page size"
          >
            {[8, 12, 24, 48].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-8 ml-auto" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={String(o.id)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{o.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                    {formatDate(o.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {o.customer
                      ? `${o.customer.firstName ?? ''} ${o.customer.lastName ?? ''}`.trim()
                      : 'Guest'}
                    <div className="text-xs text-gray-400">
                      {o.customer?.email ?? ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(Number(o.total || 0))}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.status || 'Unknown'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="ml-2 text-gray-400 hover:text-black"
                      type="button"
                      aria-label={`more-${o.id}`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          {total > 0
            ? `Showing ${Math.min((page - 1) * limit + 1, total)}–${Math.min(page * limit, total)} of ${total}`
            : ''}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1 || loading}
            className="px-3 py-1 rounded-md text-sm border border-gray-200 bg-white disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            className="px-3 py-1 rounded-md text-sm border border-gray-200 bg-white disabled:opacity-50"
          >
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages })
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((_, idx) => {
                const p = Math.max(
                  1,
                  Math.min(totalPages, page - 2 + (idx + 1)),
                );
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 rounded-md text-sm border ${p === page ? 'bg-black text-white border-black' : 'bg-white border-gray-200'}`}
                  >
                    {p}
                  </button>
                );
              })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            className="px-3 py-1 rounded-md text-sm border border-gray-200 bg-white disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages || loading}
            className="px-3 py-1 rounded-md text-sm border border-gray-200 bg-white disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
