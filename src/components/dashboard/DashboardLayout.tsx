'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardSidebar, DashboardTab } from './DashboardSidebar';

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  title?: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  title,
  children,
}) => {
  const { navigate } = useShop();

  return (
    <div className="bg-[#F9F9F9] min-h-[calc(100vh-140px)] text-[#141414] font-satoshi py-8 sm:py-12">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-body font-satoshi-bold mb-6">
          <button
            onClick={() => navigate('/')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            dashboard
          </button>
          {title && (
            <>
              <span>/</span>
              <span className="text-primary">{title}</span>
            </>
          )}
        </div>

        {/* 2-Column Responsive Dashboard: Fixed Desktop Sidebar + Independently Scrollable Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Left Sidebar - Always fixed / sticky in viewport with internal scroll */}
          <div className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-24 z-20 self-start">
            <DashboardSidebar activeTab={activeTab} />
          </div>

          {/* Right Main Content Area - Expands and scrolls smoothly */}
          <div className="flex-1 min-w-0 w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

