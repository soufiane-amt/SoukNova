'use client';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Menu,
  Package,
  X,
  ShoppingBag,
  UserPlus,
  Star,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { poppins } from '@/layout';
import SidebarItem from './dashboard/components/SidebarItem';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../../hooks/useSocket';
import { DEFAULT_USER_IMAGE } from '../../constants/assets';

interface Notification {
  id: string;
  type: 'order' | 'user' | 'review';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const router = useRouter();
  const pathname = usePathname();
  const isAdminLogin = pathname === '/admin/login';

  const segments = pathname.split('/').filter(Boolean);
  const activeTab = segments[segments.length - 1] ?? 'dashboard';

  useSocket({
    onNewNotification: (notification: any) => {
      // Add new notification to the list
      setNotifications((prev) => [notification, ...prev.slice(0, 19)]);

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    },
    onUnreadCountUpdate: (count: number) => {
      setUnreadCount(count);
    },
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`,
        {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        },
      );

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const json = await res.json();

      if (json.data) {
        setProfile({
          firstName: json.data.firstName || '',
          lastName: json.data.lastName || '',
          email: json.data.email || '',
          phone: json.data.phone || '',
          avatar: json.data.avatar.startsWith('http')
            ? json.data.avatar
            : `${process.env.NEXT_PUBLIC_API_URL}${json.data.avatar}`,
        });
      }
    } catch (err: any) {
      console.error(err.message || 'Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (navBarExists && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [navBarExists]);

  // Fetch initial notifications and unread count
  useEffect(() => {
    if (navBarExists) {
      fetchUnreadCount();
    }
  }, [navBarExists]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/notifications/unread-count`,
        { credentials: 'include' },
      );
      if (res.ok) {
        const json = await res.json();
        setUnreadCount(json.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/notifications?limit=10`,
        { credentials: 'include' },
      );
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data);
        setUnreadCount(json.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/notifications/mark-read`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationIds: [notification.id] }),
          },
        );

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n,
          ),
        );
        // Note: unreadCount will be updated via socket
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'order':
        if (notification.data.orderId) {
          router.push(`/admin/orders/${notification.data.orderId}`);
        } else {
          router.push('/admin/orders');
        }
        break;
      case 'user':
        if (notification.data.userId) {
          router.push(`/admin/customers?highlight=${notification.data.userId}`);
        } else {
          router.push('/admin/customers');
        }
        break;
      case 'review':
        if (notification.data.productId) {
          router.push(`/product/${notification.data.productId}`);
        } else {
          router.push('/admin/products');
        }
        break;
    }

    setIsNotificationOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/notifications/mark-all-read`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      // Note: unreadCount will be updated via socket
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const toggleNotifications = () => {
    if (!isNotificationOpen) {
      fetchNotifications();
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'user':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#F9F9F9] flex text-gray-900 selection:bg-black selection:text-white ${poppins.className}`}
    >
      {!isAdminLogin && (
        <>
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
              ${
                isSidebarOpen
                  ? 'translate-x-0'
                  : '-translate-x-full lg:translate-x-0'
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
                  onClick={() => router.push('/admin/settings')}
                />
                <div className="px-4 py-3 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <Image
                      src={
                        profile.avatar ||
                        `${process.env.NEXT_PUBLIC_API_URL}${DEFAULT_USER_IMAGE}`
                      }
                      alt="User"
                      width={32}
                      height={32}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {profile.firstName + ' ' + profile.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        {!isAdminLogin && (
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
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
                  type="button"
                  aria-label="notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                          <Bell className="w-10 h-10 mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  !notification.read
                                    ? 'font-semibold text-gray-900'
                                    : 'text-gray-700'
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  { addSuffix: true },
                                )}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="border-t border-gray-100 px-4 py-3">
                        <button
                          onClick={() => {
                            router.push('/admin/notifications');
                            setIsNotificationOpen(false);
                          }}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-2 lg:p-4">
          {isAdminLogin ? (
            children
          ) : (
            <AuthGuard redirectedTo="/admin/login">
              <div className="max-w-7xl mx-auto">{children}</div>
            </AuthGuard>
          )}
        </main>
      </div>
    </div>
  );
}
