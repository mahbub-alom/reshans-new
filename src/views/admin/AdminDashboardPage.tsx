'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminTopNavbar } from '../../components/admin/AdminTopNavbar';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminCustomersTab } from './tabs/AdminCustomersTab';
import { AdminCategoriesTab } from './tabs/AdminCategoriesTab';
import { AdminInventoryTab } from './tabs/AdminInventoryTab';
import { AdminBannersTab } from './tabs/AdminBannersTab';
import { AdminCouponsTab } from './tabs/AdminCouponsTab';
import { AdminReviewsTab } from './tabs/AdminReviewsTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { AdminProfileTab } from './tabs/AdminProfileTab';
import { useShop } from '../../context/ShopContext';

export const AdminDashboardPage: React.FC = () => {
  const { currentPath, navigate } = useShop();

  // Resolve active tab from current route (e.g. /admin/products -> products)
  const resolveTabFromPath = (): AdminTab => {
    if (currentPath.includes('/admin/products')) return 'products';
    if (currentPath.includes('/admin/orders')) return 'orders';
    if (currentPath.includes('/admin/customers')) return 'customers';
    if (currentPath.includes('/admin/categories')) return 'categories';
    if (currentPath.includes('/admin/inventory')) return 'inventory';
    if (currentPath.includes('/admin/banners')) return 'banners';
    if (currentPath.includes('/admin/coupons')) return 'coupons';
    if (currentPath.includes('/admin/reviews')) return 'reviews';
    if (currentPath.includes('/admin/settings')) return 'settings';
    if (currentPath.includes('/admin/profile') || currentPath.includes('/admin/security'))
      return 'profile';
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState<AdminTab>(resolveTabFromPath);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync tab with URL
  useEffect(() => {
    const tab = resolveTabFromPath();
    setActiveTabState(tab);
  }, [currentPath]);

  const handleSetActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    const targetUrl = tab === 'overview' ? '/admin' : `/admin/${tab}`;
    navigate(targetUrl);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab setActiveTab={handleSetActiveTab} />;
      case 'products':
        return <AdminProductsTab />;
      case 'orders':
        return <AdminOrdersTab />;
      case 'customers':
        return <AdminCustomersTab />;
      case 'categories':
        return <AdminCategoriesTab />;
      case 'inventory':
        return <AdminInventoryTab />;
      case 'banners':
        return <AdminBannersTab />;
      case 'coupons':
        return <AdminCouponsTab />;
      case 'reviews':
        return <AdminReviewsTab />;
      case 'settings':
        return <AdminSettingsTab />;
      case 'profile':
        return <AdminProfileTab />;
      default:
        return <AdminOverviewTab setActiveTab={handleSetActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#141414] font-satoshi flex">
      {/* 1. Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* 2. Main Content Area (Offset by lg:ml-72) */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <AdminTopNavbar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
};
