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
    <div className="bg-[#F9F9F9] min-h-screen text-[#141414] font-satoshi py-12 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* 2-Column Responsive Dashboard Grid: Sidebar (3 cols) + Content (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar - Sticky on scroll */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 z-10">
            <DashboardSidebar activeTab={activeTab} />
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
