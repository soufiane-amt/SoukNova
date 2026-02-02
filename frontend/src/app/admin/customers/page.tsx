'use client';
import React, { JSX, useEffect, useState } from 'react';
import { Search, MoreHorizontal, Trash2, Loader2, Eye } from 'lucide-react';

type CustomerItem = {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  ordersCount: number;
  totalSpent: number;
};

type CustomersResponse = {
  data: CustomerItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function CustomersView(): JSX.Element {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [actionMenu, setActionMenu] = useState<number | string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => fetchCustomers(page, limit, search), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  async function fetchCustomers(pageNum = 1, pageLimit = limit, q = '') {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      params.append('limit', String(pageLimit));
      if (q && q.trim()) params.append('search', q.trim());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customers?${params.toString()}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        },
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch customers');
      }

      const json: CustomersResponse = await res.json();
      setCustomers(json.data || []);
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
      setError(err?.message || 'Unable to load customers');
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Customers</h2>
          <p className="text-sm text-gray-500">
            List of customers with orders count and total spent.
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
              placeholder="Search by name or email..."
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
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Orders</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-48" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-8 ml-auto" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      {!c?.avatar ? (
                        <div className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-sm font-medium text-gray-600">
                          {String(c.firstName || c.email)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={
                            c.avatar && c.avatar.startsWith('http')
                              ? c.avatar
                              : c.avatar
                                ? `${process.env.NEXT_PUBLIC_API_URL}${c.avatar}`
                                : '/default-avatar.png'
                          }
                          alt={`${c.firstName} ${c.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{`${c.firstName} ${c.lastName}`}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 truncate">
                    {c.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.ordersCount}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(c.totalSpent)}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      className="ml-2 text-gray-400 hover:text-black"
                      type="button"
                      aria-label={`more-${c.id}`}
                      onClick={() =>
                        setActionMenu(actionMenu === c.id ? null : c.id)
                      }
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {actionMenu === c.id && (
                      <div className="absolute right-0 z-20 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm w-full"
                          onClick={() => {
                            window.location.href = `/admin/customers/${c.id}/activity`;
                          }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
            {(() => {
              const start = Math.max(1, page - 2);
              const end = Math.min(totalPages, page + 2);
              const pages: number[] = [];
              for (let p = start; p <= end; p++) pages.push(p);
              return pages.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 rounded-md text-sm border ${p === page ? 'bg-black text-white border-black' : 'bg-white border-gray-200'}`}
                >
                  {p}
                </button>
              ));
            })()}
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
