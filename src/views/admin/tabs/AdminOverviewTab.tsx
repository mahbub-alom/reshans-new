'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  Shirt,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  Plus,
  Tag,
  Star,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { AdminTab } from '../../../components/admin/AdminSidebar';

interface AdminOverviewTabProps {
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ setActiveTab }) => {
  const { products, orders, customers, reviews, formatPrice } = useShop();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Computed metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0) + 1420000;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing');
  const lowStockProducts = products.filter((p) => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 5));
  const recentOrders = orders.slice(0, 5);

  // SVG Chart data for Monthly Trend
  const monthlyRevenueData = [
    { month: 'Oct', amount: 185000, height: 45 },
    { month: 'Nov', amount: 240000, height: 60 },
    { month: 'Dec', amount: 380000, height: 95 },
    { month: 'Jan', amount: 290000, height: 72 },
    { month: 'Feb', amount: 310000, height: 78 },
    { month: 'Mar', amount: 420000, height: 100 },
  ];

  const weeklyOrdersData = [
    { day: 'Sat', count: 18, height: 65 },
    { day: 'Sun', count: 24, height: 85 },
    { day: 'Mon', count: 14, height: 50 },
    { day: 'Tue', count: 22, height: 80 },
    { day: 'Wed', count: 28, height: 100 },
    { day: 'Thu', count: 19, height: 70 },
    { day: 'Fri', count: 25, height: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs hover:border-[#093624] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xs bg-[#093624]/10 text-[#093624] flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] tabular-nums mb-2">
            {formatPrice(totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#093624] font-satoshi-bold">
            <ArrowUpRight size={14} />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs hover:border-[#093624] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xs bg-[#F9F295]/60 text-[#093624] flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] tabular-nums mb-2">
            {348 + orders.length}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#093624] font-satoshi-bold">
              {pendingOrders.length} pending fulfillment
            </span>
            <span className="text-gray-400 font-satoshi">Dhaka & Region</span>
          </div>
        </div>

        {/* Card 3: Active Customers */}
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs hover:border-[#093624] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body">
              Customers
            </span>
            <div className="w-9 h-9 rounded-xs bg-[#093624]/10 text-[#093624] flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] tabular-nums mb-2">
            {1840 + customers.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#093624] font-satoshi-bold">
            <ArrowUpRight size={14} />
            <span>+24.1% repeat buyers</span>
          </div>
        </div>

        {/* Card 4: Catalog Products */}
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs hover:border-[#093624] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body">
              Active Products
            </span>
            <div className="w-9 h-9 rounded-xs bg-[#F9F295]/60 text-[#093624] flex items-center justify-center">
              <Shirt size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] tabular-nums mb-2">
            {products.length} Items
          </div>
          <div className="flex items-center justify-between text-xs">
            {lowStockProducts.length > 0 ? (
              <span className="text-[#093624] font-satoshi-bold flex items-center gap-1">
                <AlertCircle size={12} />
                {lowStockProducts.length} low stock
              </span>
            ) : (
              <span className="text-[#093624] font-satoshi-bold">All items stocked</span>
            )}
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[#093624] font-satoshi-bold hover:underline cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Charts Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Revenue Trend Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
                <TrendingUp size={18} className="text-[#093624]" />
                <span>Revenue Performance (BDT ৳)</span>
              </h3>
              <p className="text-xs text-brand-body font-satoshi mt-0.5">
                Monthly sales trajectory across web & mobile orders in Bangladesh
              </p>
            </div>

            {/* Timeframe pills */}
            <div className="flex items-center bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs p-1 text-xs font-satoshi-bold">
              {(['week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1 rounded-xs uppercase tracking-wider text-[10px] transition-colors cursor-pointer ${
                    timeRange === t
                      ? 'bg-[#093624] text-[#F9F295]'
                      : 'text-gray-600 hover:text-[#141414]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line / Bar Graphic */}
          <div className="space-y-4">
            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-gray-100">
              {monthlyRevenueData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-satoshi-bold text-[#093624] opacity-0 group-hover:opacity-100 transition-opacity bg-[#F9F295] px-1.5 py-0.5 rounded-xs shadow-xs tabular-nums whitespace-nowrap">
                    ৳ {(d.amount / 1000).toFixed(0)}k
                  </div>

                  {/* Gradient Bar with animated growth */}
                  <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xs overflow-hidden h-40 flex items-end">
                    <div
                      style={{ height: `${d.height}%` }}
                      className="w-full bg-[#093624] group-hover:bg-[#F9F295] transition-all duration-300 rounded-t-xs"
                    />
                  </div>

                  <span className="text-xs font-satoshi-bold text-gray-500 group-hover:text-[#093624]">
                    {d.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-brand-body font-satoshi pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#093624] rounded-xs inline-block" />
                <span>Monthly Verified Orders (Avg ৳ 330k)</span>
              </span>
              <span className="font-satoshi-bold text-[#093624]">
                Peak month: March 2026 (৳ 420,000)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Weekly Order Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] mb-1">
              Weekly Order Volume
            </h3>
            <p className="text-xs text-brand-body font-satoshi mb-5">
              Daily incoming orders past 7 days
            </p>

            <div className="h-44 flex items-end justify-between gap-2 border-b border-gray-100 pb-2">
              {weeklyOrdersData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-satoshi-bold text-[#093624] opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div className="w-full bg-gray-100 rounded-t-xs h-32 flex items-end">
                    <div
                      style={{ height: `${d.height}%` }}
                      className="w-full bg-[#093624] group-hover:bg-[#F9F295] transition-all rounded-t-xs"
                    />
                  </div>
                  <span className="text-[10px] font-satoshi-bold text-gray-500">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <div>
              <div className="text-[11px] text-brand-body">Busiest Delivery Day</div>
              <div className="font-satoshi-bold text-[#141414]">Wednesday (28 orders)</div>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-satoshi-bold text-[#093624] hover:underline cursor-pointer"
            >
              View Orders →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Orders Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                Recent Orders
              </h3>
              <p className="text-xs text-brand-body font-satoshi">
                Latest customer purchases requiring fulfillment
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-satoshi-bold text-[#093624] hover:underline cursor-pointer"
            >
              View All ({orders.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-satoshi">
              <thead className="bg-[#F9F9F9] text-brand-body uppercase font-satoshi-bold text-[10px] tracking-wider border-b border-[#EBEBEB]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-satoshi-bold text-[#093624]">
                      {ord.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-satoshi-bold text-[#141414]">
                        {ord.customerName}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                        {ord.customerEmail}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                      {ord.date.split(' ')[0]}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-satoshi-med">{ord.paymentMethod}</span>
                      <span
                        className={`block text-[9px] font-bold ${
                          ord.paymentStatus === 'Paid'
                            ? 'text-[#093624]'
                            : ord.paymentStatus === 'Refunded'
                            ? 'text-[#6D6868]'
                            : 'text-[#093624]'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-[#093624] text-[#F9F295]'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-[#093624]/15 text-[#093624]'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-[#F9F295] text-[#093624]'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-[#F1EFEE] text-[#6D6868]'
                            : 'bg-gray-100 text-[#141414]'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-satoshi-bold tabular-nums text-[#141414]">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="p-1 text-gray-400 hover:text-[#093624] transition-colors cursor-pointer"
                        title="Inspect Order"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Selling Products & Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                Top Selling Styles
              </h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-satoshi-bold text-[#093624] hover:underline cursor-pointer"
              >
                All Products →
              </button>
            </div>

            <div className="space-y-3.5">
              {products.slice(0, 4).map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-5 text-center text-xs font-satoshi-bold text-gray-400">
                    #{idx + 1}
                  </span>
                  <div className="w-11 h-11 bg-gray-100 rounded-xs overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={p.frontImage}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-satoshi-bold text-[#141414] truncate">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-satoshi">
                      {p.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-satoshi-bold text-[#093624] tabular-nums">
                      {formatPrice(p.price)}
                    </div>
                    <div className="text-[10px] text-gray-400 font-satoshi">
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-[#093624] text-white rounded-xs p-5 shadow-2xs">
            <h4 className="text-xs font-satoshi-bold uppercase tracking-wider text-[#F9F295] mb-3">
              Admin Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('products')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xs text-left text-xs font-satoshi-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Plus size={14} className="text-[#F9F295]" />
                <span>Add Product</span>
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xs text-left text-xs font-satoshi-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Tag size={14} className="text-[#F9F295]" />
                <span>New Coupon</span>
              </button>
              <button
                onClick={() => setActiveTab('banners')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xs text-left text-xs font-satoshi-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <TrendingUp size={14} className="text-[#F9F295]" />
                <span>Edit Banners</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xs text-left text-xs font-satoshi-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Star size={14} className="text-[#F9F295]" />
                <span>Reviews</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
