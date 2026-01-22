'use client';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Menu,
  Package,
} from 'lucide-react';
import { useState } from 'react';
import { poppins } from '@/layout';
import SidebarItem from './dashboard/components/SidebarItem';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // "/dashboard/products" → ["dashboard", "products"]
  const segments = pathname.split('/').filter(Boolean);
  // first segment after admin root
  const activeTab = segments[segments.length - 1] ?? 'dashboard';

  return (
    <div
      className={`min-h-screen bg-[#F9F9F9] flex text-gray-900 selection:bg-black selection:text-white ${poppins.className}`}
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold tracking-tight">
              Souknova
              <span className="pl-2 text-gray-400 text-xs font-medium">
                admin
              </span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => {
                router.push('/admin/dashboard');
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={Package}
              label="Products"
              active={activeTab === 'products'}
              onClick={() => {
                router.push('/admin/products');
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={ShoppingCart}
              label="Orders"
              active={activeTab === 'orders'}
              onClick={() => {
                router.push('/admin/orders');
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={Users}
              label="Customers"
              active={activeTab === 'customers'}
              onClick={() => {
                router.push('/admin/customers');
                setIsSidebarOpen(false);
              }}
            />
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
            <div className="px-4 py-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                  alt="User"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Sofia Rivers</p>
                <p className="text-xs text-gray-500 truncate">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 mr-2 lg:hidden text-gray-500 hover:text-black"
              type="button"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-medium hidden sm:block capitalize">
              {activeTab}
            </h2>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
              type="button"
              aria-label="notifications"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-2 lg:p-4">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
