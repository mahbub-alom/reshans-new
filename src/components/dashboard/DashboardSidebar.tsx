'use client';

import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  LayoutDashboard,
  Package,
  Download,
  FileText,
  RotateCcw,
  Star,
  Heart,
  Tag,
  User,
  Shield,
  MapPin,
  LogOut,
} from 'lucide-react';

export type DashboardTab =
  | 'dashboard'
  | 'orders'
  | 'order-details'
  | 'invoices'
  | 'invoice-details'
  | 'return'
  | 'return-request'
  | 'return-product'
  | 'reviews'
  | 'profile'
  | 'security'
  | 'address'
  | 'wishlist';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab }) => {
  const { navigate, openWishlist, wishlistCount } = useShop();

  const NAV_ITEMS: {
    id: DashboardTab | 'downloads' | 'offers' | 'logout';
    label: string;
    icon: React.ReactNode;
    route?: string;
    onClick?: () => void;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      route: '/dashboard',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Package size={18} />,
      route: '/dashboard/orders',
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: <Download size={18} />,
      onClick: () => navigate('/dashboard/orders'),
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <FileText size={18} />,
      route: '/dashboard/invoices',
    },
    {
      id: 'return',
      label: 'Order Return Request',
      icon: <RotateCcw size={18} />,
      route: '/dashboard/return',
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star size={18} />,
      route: '/dashboard/reviews',
    },
    {
      id: 'wishlist',
      label: `Wishlist ${wishlistCount > 0 ? `(${wishlistCount})` : ''}`,
      icon: <Heart size={18} />,
      onClick: () => openWishlist(),
    },
    {
      id: 'offers',
      label: 'Special Offers',
      icon: <Tag size={18} />,
      onClick: () => navigate('/dashboard'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={18} />,
      route: '/dashboard/profile',
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield size={18} />,
      route: '/dashboard/security',
    },
    {
      id: 'address',
      label: 'Address',
      icon: <MapPin size={18} />,
      route: '/dashboard/address',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut size={18} />,
      onClick: () => navigate('/login'),
    },
  ];

  const isActive = (itemId: string) => {
    if (itemId === 'orders' && (activeTab === 'orders' || activeTab === 'order-details')) return true;
    if (itemId === 'invoices' && (activeTab === 'invoices' || activeTab === 'invoice-details')) return true;
    if (
      itemId === 'return' &&
      (activeTab === 'return' || activeTab === 'return-request' || activeTab === 'return-product')
    )
      return true;
    return activeTab === itemId;
  };

  return (
    <aside className="bg-white border border-[#EBEBEB] rounded-none p-6 shadow-2xs font-satoshi">
      {/* Profile Info Header matching .aq-dashboard-profile-info */}
      <div className="text-center pb-6 border-b border-[#F0EDED]">
        <div className="w-20 h-20 mx-auto mb-3.5 rounded-full overflow-hidden border-2 border-primary/20 shadow-xs bg-[#F9F9F9]">
          <img
            src="/assets/img/others/dashboard-avater.jpg"
            alt="Floyd Miles"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-bold font-satoshi-bold text-brand-black mb-0.5">
          Floyd Miles
        </h3>
        <p className="text-xs text-brand-body font-satoshi">floydmiles@gmail.com</p>
      </div>

      {/* Sidebar Navigation Menu matching .aq-dashboard-sidebar-menu */}
      <nav className="pt-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.onClick) item.onClick();
                else if (item.route) navigate(item.route);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold font-satoshi-bold transition-all text-left rounded-none cursor-pointer ${
                active
                  ? 'bg-primary text-secondary shadow-xs'
                  : 'text-brand-black hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <span className={`shrink-0 ${active ? 'text-secondary' : 'text-brand-body group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
