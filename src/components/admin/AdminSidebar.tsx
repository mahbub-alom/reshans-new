'use client';

import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  Package,
  Users,
  UserCheck,
  Layers,
  Boxes,
  Image as ImageIcon,
  Tag,
  Star,
  Settings,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useShop } from '../../context/ShopContext';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'customers'
  | 'all-users'
  | 'categories'
  | 'inventory'
  | 'banners'
  | 'coupons'
  | 'reviews'
  | 'settings'
  | 'profile';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { navigate, orders, products, reviews, adminProfile, logoutUser } = useShop();

  // Dynamic counts for notification badges
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
  const lowStockCount = products.filter((p) => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 5)).length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'products',
      label: 'Products',
      icon: <Shirt size={18} />,
      badge: products.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Package size={18} />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-[#F9F295] text-[#093624]',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users size={18} />,
    },
    {
      id: 'all-users',
      label: 'All Users',
      icon: <UserCheck size={18} />,
    },
    {
      id: 'categories',
      label: 'Categories & Brands',
      icon: <Layers size={18} />,
    },
    {
      id: 'inventory',
      label: 'Inventory & Stock',
      icon: <Boxes size={18} />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-[#F9F295] text-[#093624]',
    },
    {
      id: 'banners',
      label: 'Campaign Banners',
      icon: <ImageIcon size={18} />,
    },
    {
      id: 'coupons',
      label: 'Coupons & Discounts',
      icon: <Tag size={18} />,
    },
    {
      id: 'reviews',
      label: 'Reviews & Feedback',
      icon: <Star size={18} />,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-[#F9F295] text-[#093624]',
    },
    {
      id: 'settings',
      label: 'Website Settings',
      icon: <Settings size={18} />,
    },
    {
      id: 'profile',
      label: 'Admin & Security',
      icon: <ShieldCheck size={18} />,
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#093624] text-white flex flex-col border-r border-white/15 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Logo + Close Button */}
        <div className="p-5 border-b border-white/15 flex items-center justify-between">
          <div className="flex flex-col">
            <BrandLogo light />
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-satoshi-bold uppercase tracking-widest text-[#F9F295]">
                Admin Console
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-xs hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>


        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-satoshi-bold uppercase tracking-wider text-white/40">
            Store Management
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-satoshi-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F9F295] text-[#093624] shadow-xs'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#093624]' : 'text-white/70'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-[#093624] text-[#F9F295]'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile & Switch */}
        <div className="p-3 border-t border-white/15 bg-black/15">
          <div className="flex items-center gap-3 p-2 rounded-xs">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F9F295]/40 shrink-0 bg-white/10">
              <img
                src={adminProfile.avatar || '/assets/img/others/dashboard-avater.jpg'}
                alt={adminProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-satoshi-bold text-white truncate">
                {adminProfile.name}
              </div>
              <div className="text-[10px] text-[#F9F295] truncate font-satoshi">
                {adminProfile.role}
              </div>
            </div>
            <button
              onClick={() => logoutUser()}
              title="Sign Out from Admin Panel"
              className="p-1.5 text-white/60 hover:text-red-300 hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
