'use client';
import React, { useEffect, useState } from 'react';
import { Filter, MoreHorizontal, Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { ProductType } from '../../../../types/product.dt';

type ProductsResponse = {
  data: ProductType[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

type ProductsViewProps = {
  handleActiveTabChange?: (
    tab:
      | 'dashboard'
      | 'products'
      | 'orders'
      | 'customers'
      | 'settings'
      | 'add product',
  ) => void;
};

export default function ProductsView({
  handleActiveTabChange,
}: ProductsViewProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(page, limit, search), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  async function fetchProducts(pageNum = 1, pageLimit = limit, q = '') {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      params.append('limit', String(pageLimit));
      if (q && q.trim()) params.append('search', q.trim());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch products');
      }

      const json: ProductsResponse = await res.json();
      setProducts(json.data || []);
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
      setError(err?.message || 'Unable to load products');
      setProducts([]);
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

  function formatCurrency(v?: number | string | null) {
    const n = Number(v ?? 0);
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
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-gray-500">
            Manage your products catalogue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-transparent">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm w-64 placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
              <Filter size={16} className="mr-2" /> Filter
            </button>
            <button
              onClick={() => handleActiveTabChange?.('add product')}
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} className="mr-2" /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-medium">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              // Loading skeleton rows inspired by ShopFilter/ProductGrid style
              Array.from({ length: limit }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
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
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={product.primary_image || '/placeholder-product.png'}
                        alt={product.title || 'Product Image'}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                      />
                      <span className="font-medium text-gray-900 truncate">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category ?? '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status ?? 'Unknown'} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof product.stock === 'number'
                      ? `${product.stock} units`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-gray-400 hover:text-black"
                      type="button"
                      aria-label={`actions-${product.id}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination area inspired by ShopFilter pagination UX */}
      <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          {total > 0
            ? `Showing ${Math.min((page - 1) * limit + 1, total)}–${Math.min(
                page * limit,
                total,
              )} of ${total}`
            : ''}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 mr-2">Page size</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="text-sm border border-gray-200 rounded-md px-2 py-1"
          >
            {[8, 12, 24, 48].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

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

          {/* compact page window */}
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
