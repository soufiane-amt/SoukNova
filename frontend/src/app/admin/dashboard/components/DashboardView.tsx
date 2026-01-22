'use client';
import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import StatCard from './StatCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
);

type Stat = {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
};
type RecentOrder = {
  id: string | number;
  addedAt: string;
  price: number;
  user?: { firstName?: string; lastName?: string; email?: string } | null;
};

type DashboardResponse = {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    activeCustomers: number;
  };
  recentOrders: RecentOrder[];
};

export default function DashboardView(): JSX.Element {
  const [stats, setStats] = useState<DashboardResponse['stats'] | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentLimit] = useState<number>(30);
  const [revenueSeries, setRevenueSeries] = useState<
    { date: string; total: number }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard?recent=${recentLimit}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { Accept: 'application/json' },
          },
        );
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Failed to load dashboard');
        }
        const json: DashboardResponse = await res.json();
        if (!mounted) return;
        setStats(json.stats || null);
        setRecentOrders(json.recentOrders || []);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err?.message || 'Unable to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [recentLimit]);

  useEffect(() => {
    let mounted = true;
    async function loadSeries() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { Accept: 'application/json' },
          },
        );
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        if (!mounted) return;
        setRevenueSeries(json.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadSeries();
    return () => {
      mounted = false;
    };
  }, [recentLimit]);

  function formatCurrency(n?: number) {
    const v = Number(n ?? 0);
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(v);
    } catch {
      return `$${v.toFixed(2)}`;
    }
  }

  function shortName(o: RecentOrder) {
    if (!o.user) return 'Guest';
    const { firstName = '', lastName = '' } = o.user;
    return `${firstName} ${lastName}`.trim() || o.user.email || 'Guest';
  }

  const statCards: Stat[] = stats
    ? [
        {
          label: 'Total Revenue',
          value: formatCurrency(stats.totalRevenue),
          change: undefined,
        },
        { label: 'Total Orders', value: String(stats.totalOrders) },
        {
          label: 'Avg. Order Value',
          value: formatCurrency(stats.avgOrderValue),
        },
        { label: 'Active Customers', value: String(stats.activeCustomers) },
      ]
    : [
        { label: 'Total Revenue', value: '—' },
        { label: 'Total Orders', value: '—' },
        { label: 'Avg. Order Value', value: '—' },
        { label: 'Active Customers', value: '—' },
      ];

  // prepare chart data
  const chartData = {
    labels: revenueSeries.map((s) => s.date),
    datasets: [
      {
        label: 'Revenue',
        data: revenueSeries.map((s) => s.total),
        fill: true,
        borderColor: '#111827',
        backgroundColor: 'rgba(17,24,39,0.06)',
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: { unit: 'day' },
        grid: { display: false },
      },
      y: { ticks: { callback: (v: any) => `$${Number(v).toLocaleString()}` } },
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCard
                key={`skeleton-${i}`}
                label={statCards[i].label}
                value="Loading…"
              />
            ))
          : statCards.map((s, idx) => <StatCard key={idx} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section (keeps visual mock) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Revenue Analytics</h2>
          </div>

            {revenueSeries.length === 0 ? (
              // simple skeleton
              <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center text-sm text-gray-400">
                No revenue data
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}

        </div>

        {/* Recent Orders Mini */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <button
              className="text-sm text-gray-500 hover:text-black hover:underline"
              type="button"
              onClick={() => {
                /* optionally navigate to orders page */
              }}
            >
              View All
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: recentLimit }).map((_, i) => (
                <div
                  key={`order-skel-${i}`}
                  className="flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100" />
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-28" />
                      <div className="h-3 bg-gray-200 rounded w-20 mt-2" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
                    <div className="h-3 bg-gray-200 rounded w-12 mt-2 ml-auto" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-sm text-gray-500">No recent sales.</div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={String(order.id)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {shortName(order)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.addedAt.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCurrency(order.price)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
