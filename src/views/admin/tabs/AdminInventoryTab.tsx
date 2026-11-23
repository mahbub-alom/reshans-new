'use client';

import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Minus,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

export const AdminInventoryTab: React.FC = () => {
  const { products, updateStock, formatPrice } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  const lowStockThreshold = 5;

  const lowStockItems = products.filter(
    (p) => p.inStock && p.stockCount !== undefined && p.stockCount <= lowStockThreshold && p.stockCount > 0
  );
  const outOfStockItems = products.filter((p) => !p.inStock || p.stockCount === 0);
  const totalUnits = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const count = p.stockCount || 0;
    const isLow = p.inStock && count <= lowStockThreshold && count > 0;
    const isOut = !p.inStock || count === 0;
    const isHealthy = p.inStock && count > lowStockThreshold;

    if (statusFilter === 'low') return matchesSearch && isLow;
    if (statusFilter === 'out') return matchesSearch && isOut;
    if (statusFilter === 'healthy') return matchesSearch && isHealthy;
    return matchesSearch;
  });

  const handleAdjustStock = (id: string, currentCount: number, delta: number) => {
    const nextCount = Math.max(0, currentCount + delta);
    updateStock(id, nextCount > 0, nextCount);
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metrics & Alert Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs">
          <div className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
            Total Warehouse Units
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] tabular-nums">
            {totalUnits.toLocaleString()} Pcs
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs">
          <div className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
            Low Stock Alerts (≤ 5)
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#093624] tabular-nums">
            {lowStockItems.length} Items
          </div>
          <div className="text-xs text-[#6D6868] font-satoshi mt-1">Require re-order from factory</div>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs">
          <div className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
            Out of Stock
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] tabular-nums">
            {outOfStockItems.length} Items
          </div>
          <div className="text-xs text-[#6D6868] font-satoshi mt-1">Unavailable on storefront</div>
        </div>
      </div>

      {/* Low stock warning banner if any */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-[#F9F295]/50 border border-[#093624]/30 p-4 rounded-xs flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#093624] shrink-0 mt-0.5" />
          <div className="text-xs text-[#093624] font-satoshi">
            <span className="font-satoshi-bold">Action Recommended:</span> There are{' '}
            <strong>{lowStockItems.length}</strong> styles running low on stock and{' '}
            <strong>{outOfStockItems.length}</strong> styles completely sold out. Use the quick stock
            adjusters below to log new replenishment batches.
          </div>
        </div>
      )}

      {/* 2. Inventory Filter and Search */}
      <div className="bg-white border border-[#EBEBEB] p-4 sm:p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product, SKU, category..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'healthy', 'low', 'out'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1.5 text-xs font-satoshi-bold rounded-xs uppercase tracking-wider cursor-pointer transition-colors ${
                statusFilter === filterKey
                  ? 'bg-[#093624] text-[#F9F295]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterKey === 'all'
                ? 'All'
                : filterKey === 'healthy'
                ? 'Healthy'
                : filterKey === 'low'
                ? 'Low Stock'
                : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Inventory Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-satoshi">
            <thead className="bg-[#F9F9F9] text-brand-body uppercase font-satoshi-bold text-[10px] tracking-wider border-b border-[#EBEBEB]">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4 text-center">Current Quantity</th>
                <th className="py-3 px-4 text-center">Quick Adjust</th>
                <th className="py-3 px-4">Availability Status</th>
                <th className="py-3 px-4 text-center">Store Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const count = p.stockCount || 0;
                const isLow = p.inStock && count <= lowStockThreshold && count > 0;
                const isOut = !p.inStock || count === 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gray-100 rounded-xs overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={p.frontImage}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-satoshi-bold text-[#141414] truncate max-w-[180px]">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-gray-400">{p.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono text-gray-600 text-[11px]">
                      {p.sku || p.id}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-satoshi-bold tabular-nums text-[#093624]">
                      {formatPrice(p.price)}
                    </td>

                    {/* Current Quantity */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-sm font-satoshi-bold tabular-nums px-2.5 py-0.5 rounded-xs ${
                          isOut
                            ? 'bg-[#F1EFEE] text-[#6D6868]'
                            : isLow
                            ? 'bg-[#F9F295] text-[#093624]'
                            : 'bg-[#093624] text-[#F9F295]'
                        }`}
                      >
                        {count} units
                      </span>
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustStock(p.id, count, -5)}
                          disabled={count === 0}
                          className="px-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xs text-[10px] font-satoshi-bold disabled:opacity-40 cursor-pointer"
                          title="Decrease 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, count, -1)}
                          disabled={count === 0}
                          className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xs disabled:opacity-40 cursor-pointer"
                          title="Decrease 1"
                        >
                          <Minus size={12} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, count, 1)}
                          className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xs cursor-pointer"
                          title="Add 1"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, count, 10)}
                          className="px-1.5 py-1 bg-[#093624]/10 hover:bg-[#093624] text-[#093624] hover:text-[#F9F295] rounded-xs text-[10px] font-satoshi-bold cursor-pointer transition-colors"
                          title="Add 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-satoshi-bold text-[#6D6868] bg-[#F1EFEE] px-2 py-0.5 rounded-full">
                          <XCircle size={11} />
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-satoshi-bold text-[#093624] bg-[#F9F295] px-2 py-0.5 rounded-full">
                          <AlertTriangle size={11} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-satoshi-bold text-[#F9F295] bg-[#093624] px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} />
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Store Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => updateStock(p.id, !p.inStock, !p.inStock ? 15 : 0)}
                        className={`text-[10px] font-satoshi-bold px-2 py-1 rounded-xs transition-colors cursor-pointer ${
                          p.inStock
                            ? 'bg-[#093624] text-[#F9F295] hover:opacity-90'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p.inStock ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
