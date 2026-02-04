'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  User,
  Lock,
  Bell,
  Shield,
  Mail,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Camera,
  X,
} from 'lucide-react';

type TabType = 'profile' | 'security' | 'notifications' | 'system';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
  });

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    pushOrders: true,
    pushNewUsers: true,
    pushReviews: false,
  });

  // System preferences
  const [system, setSystem] = useState({
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    itemsPerPage: '12',
  });

  // Fetch profile and notifications on mount
  useEffect(() => {
    fetchProfile();
    fetchNotificationPreferences();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
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
          avatar: json.data.avatar || '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/notifications/preferences`,
        {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        },
      );

      if (!res.ok) {
        throw new Error('Failed to fetch notification preferences');
      }

      const json = await res.json();
      if (json.data) {
        setNotifications({
          pushOrders: json.data.pushOrders ?? true,
          pushNewUsers: json.data.pushNewUsers ?? true,
          pushReviews: json.data.pushReviews ?? false,
        });
      }
    } catch (err: any) {
      console.error('Failed to load notification preferences:', err);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('Image size must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile/avatar`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to upload avatar');
      }

      const json = await res.json();

      if (json.data?.avatar) {
        setProfile((prev) => ({
          ...prev,
          avatar: json.data.avatar,
        }));
        setSuccess('Profile photo updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile.avatar) return;

    setUploadingAvatar(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile/avatar`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to remove avatar');
      }

      setProfile((prev) => ({
        ...prev,
        avatar: '',
      }));
      setSuccess('Profile photo removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
          }),
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to save profile');
      }

      const json = await res.json();

      if (json.data) {
        setProfile((prev) => ({
          ...prev,
          firstName: json.data.firstName || prev.firstName,
          lastName: json.data.lastName || prev.lastName,
          email: json.data.email || prev.email,
          phone: json.data.phone || prev.phone,
        }));
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (security.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/change-password`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: security.currentPassword,
            newPassword: security.newPassword,
          }),
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      setSecurity({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/notifications/preferences`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            notifyOrders: notifications.pushOrders,
            notifyNewUsers: notifications.pushNewUsers,
            notifyReviews: notifications.pushReviews,
          }),
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(
          errorBody.message || 'Failed to save notification preferences',
        );
      }

      const json = await res.json();

      if (json.data) {
        setNotifications({
          pushOrders: json.data.pushOrders,
          pushNewUsers: json.data.pushNewUsers,
          pushReviews: json.data.pushReviews,
        });
      }

      setSuccess('Notification preferences saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'security' as TabType, label: 'Security', icon: Lock },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'system' as TabType, label: 'System', icon: Shield },
  ];

  // Helper function to get the full avatar URL
  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URL}${avatarPath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  {/* Avatar display */}
                  {profile.avatar ? (
                    <div className="relative">
                      <Image
                        src={getAvatarUrl(profile.avatar)}
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                        unoptimized
                      />
                      {/* Remove button */}
                      {!uploadingAvatar && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove photo"
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-100">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {/* Upload overlay */}
                  {uploadingAvatar ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  ) : (
                    <button
                      onClick={handleAvatarClick}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      type="button"
                      title="Change photo"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, GIF or WebP. Max size 2MB.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleAvatarClick}
                      disabled={uploadingAvatar}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                      type="button"
                    >
                      Upload new
                    </button>
                    {profile.avatar && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={handleRemoveAvatar}
                          disabled={uploadingAvatar}
                          className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                          type="button"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500">
                  Update your password to keep your account secure
                </p>
              </div>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={security.confirmPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePasswordChange}
                  disabled={
                    saving ||
                    !security.currentPassword ||
                    !security.newPassword ||
                    !security.confirmPassword
                  }
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Push Notifications
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Choose what push notifications you want to receive
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: 'pushOrders',
                      label: 'Order updates',
                      description: 'Get notified about order status changes',
                    },
                    {
                      key: 'pushNewUsers',
                      label: 'New users updates',
                      description: 'Get notified when a new user is added',
                    },
                    {
                      key: 'pushReviews',
                      label: 'New reviews',
                      description: 'Get notified when customers leave reviews',
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          notifications[item.key as keyof typeof notifications]
                        }
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  System Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Configure your dashboard preferences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={system.timezone}
                    onChange={(e) =>
                      setSystem({ ...system, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={system.currency}
                    onChange={(e) =>
                      setSystem({ ...system, currency: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="MAD">MAD (DH)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={system.language}
                    onChange={(e) =>
                      setSystem({ ...system, language: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={system.dateFormat}
                    onChange={(e) =>
                      setSystem({ ...system, dateFormat: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={system.itemsPerPage}
                    onChange={(e) =>
                      setSystem({ ...system, itemsPerPage: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  >
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
