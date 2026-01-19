'use client';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Settings,
  Search,
  Bell,
  Menu,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
  Package,
  Link,
  ImageIcon,
  DollarSign,
  Tag,
  X,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useRef, useState } from 'react';
import AddProduct from './components/AddProduct';
import { Stat } from '../../../types/Stat.dt';
import DashboardView from './components/DashboardView';
import ProductsView from './components/ProductsView';
import OrdersView from './components/OrdersView';
import CustomersView from './components/CustomersView';
import SidebarItem from './components/SidebarItem';
import { poppins } from '@/layout';

export default function AdminPanel(): JSX.Element {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'customers'
    | 'settings'
    | 'add product'
  >('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleActiveTabChange = (
    tab:
      | 'dashboard'
      | 'products'
      | 'orders'
      | 'customers'
      | 'settings'
      | 'add product',
  ) => {
    setActiveTab(tab);
  };
  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView handleActiveTabChange={handleActiveTabChange} />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'add product':
        return <AddProduct />;
      default:
        return <DashboardView />;
    }
  };

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
              Souknova<span className="pl-2 text-gray-400 text-xs font-medium">admin</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => {
                setActiveTab('dashboard');
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={Package}
              label="Products"
              active={activeTab === 'products'}
              onClick={() => {
                setActiveTab('products');
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={ShoppingCart}
              label="Orders"
              active={activeTab === 'orders'}
              onClick={() => {
                setActiveTab('orders');
                setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={Users}
              label="Customers"
              active={activeTab === 'customers'}
              onClick={() => {
                setActiveTab('customers');
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
