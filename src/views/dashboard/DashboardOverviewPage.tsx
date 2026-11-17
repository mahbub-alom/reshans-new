'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Package, MapPin, User, ShoppingBag, ArrowRight } from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { navigate } = useShop();

  return (
    <DashboardLayout activeTab="dashboard">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
          Dashboard
        </h3>

        {/* 1. Welcome Card matching .aq-dashboard-welcome-card */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-2xs">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 bg-[#F9F9F9]">
            <img
              src="/assets/img/others/dashboard-avater.jpg"
              alt="Floyd Miles"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold font-satoshi-bold text-brand-black mb-2">
              Welcome back Floyd Miles
            </h2>
            <p className="text-sm text-brand-body font-satoshi max-w-xl leading-relaxed">
              Manage your account, view your orders, track shipments across Bangladesh, and update your personal preferences from your dashboard.
            </p>
          </div>
        </div>

        {/* 2. Three Metric / Quick Action Cards matching .aq-dashboard-grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: View Orders */}
          <div className="bg-white border border-[#EBEBEB] p-6 relative flex flex-col justify-between shadow-2xs group hover:border-primary transition-colors">
            <span className="absolute top-5 right-5 w-7 h-7 bg-primary text-secondary text-xs font-bold rounded-full flex items-center justify-center font-satoshi-bold">
              6
            </span>
            <div className="mb-6">
              <div className="w-12 h-12 bg-[#F9F9F9] rounded-none flex items-center justify-center text-primary mb-4">
                <Package size={22} />
              </div>
              <h4 className="text-lg font-bold font-satoshi-bold text-brand-black mb-1">
                View Orders
              </h4>
              <p className="text-xs text-brand-body font-satoshi leading-relaxed">
                Track your recent orders and purchase history
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => navigate('/dashboard/orders')}
            >
              View Orders
            </Button>
          </div>

          {/* Card 2: Manage Address */}
          <div className="bg-white border border-[#EBEBEB] p-6 flex flex-col justify-between shadow-2xs group hover:border-primary transition-colors">
            <div className="mb-6">
              <div className="w-12 h-12 bg-[#F9F9F9] rounded-none flex items-center justify-center text-primary mb-4">
                <MapPin size={22} />
              </div>
              <h4 className="text-lg font-bold font-satoshi-bold text-brand-black mb-1">
                Manage Address
              </h4>
              <p className="text-xs text-brand-body font-satoshi leading-relaxed">
                Update your shipping and billing Dhaka addresses
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => navigate('/dashboard/orders')}
            >
              Manage Address
            </Button>
          </div>

          {/* Card 3: Profile Settings */}
          <div className="bg-white border border-[#EBEBEB] p-6 flex flex-col justify-between shadow-2xs group hover:border-primary transition-colors">
            <div className="mb-6">
              <div className="w-12 h-12 bg-[#F9F9F9] rounded-none flex items-center justify-center text-primary mb-4">
                <User size={22} />
              </div>
              <h4 className="text-lg font-bold font-satoshi-bold text-brand-black mb-1">
                Profile Settings
              </h4>
              <p className="text-xs text-brand-body font-satoshi leading-relaxed">
                Edit your profile, password, and account details
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => navigate('/dashboard/orders')}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* 3. Bottom CTA Bar matching .aq-dashboard-cta-bar */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h4 className="text-base font-bold font-satoshi-bold text-brand-black mb-1">
                Ready to explore new collections?
              </h4>
              <p className="text-xs text-brand-body font-satoshi">
                Discover the latest premium Dhaka fashion and timeless luxury essentials.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={15} />}
            onClick={() => navigate('/')}
          >
            Browse Products
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
