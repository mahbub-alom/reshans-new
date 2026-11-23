'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle2,
  XCircle,
  Copy,
  X,
} from 'lucide-react';
import { Coupon } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminCouponsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon, formatPrice, showToast } =
    useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '15',
    minSpend: '2500',
    expiryDate: '2026-06-30',
    usageLimit: '300',
    isActive: true,
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    addCoupon({
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: form.discountValue === '' ? 0 : Number(form.discountValue),
      minSpend: form.minSpend === '' ? 0 : Number(form.minSpend),
      expiryDate: form.expiryDate,
      usageLimit: form.usageLimit === '' ? 100 : Number(form.usageLimit),
      isActive: form.isActive,
    });

    setForm({
      code: '',
      discountType: 'percentage',
      discountValue: '15',
      minSpend: '2500',
      expiryDate: '2026-06-30',
      usageLimit: '300',
      isActive: true,
    });
    setIsModalOpen(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="space-y-6 font-satoshi">
      {/* 1. Header & Add Coupon Button */}
      <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
            <Tag size={18} className="text-[#093624]" />
            <span>Discount Coupons & Promotional Offers </span>
          </h3>
         
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold uppercase tracking-wider flex items-center gap-2 transition-opacity cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus size={16} />
          <span>New Voucher</span>
        </button>
      </div>

      {/* 2. Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map((c) => {
          const usagePercent = Math.min(100, Math.round((c.usageCount / c.usageLimit) * 100));

          return (
            <div
              key={c.id}
              className={`border rounded-xs p-5 flex flex-col justify-between transition-all bg-white shadow-2xs hover:border-[#093624] ${
                c.isActive ? 'border-[#EBEBEB]' : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              <div>
                {/* Coupon Code Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#093624] text-[#F9F295] font-mono font-bold text-xs rounded-xs tracking-wider">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(c.code)}
                      className="p-1 text-gray-400 hover:text-[#093624] cursor-pointer"
                      title="Copy code"
                    >
                      <Copy size={13} />
                    </button>
                  </div>

                  <span
                    className={`text-[9px] font-satoshi-bold uppercase px-1.5 py-0.5 rounded-xs ${
                      c.isActive ? 'bg-[#093624] text-[#F9F295]' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* Discount Value */}
                <div className="text-xl font-bold font-satoshi-bold text-[#141414] mb-1">
                  {c.discountType === 'percentage'
                    ? `${c.discountValue}% OFF`
                    : `৳ ${c.discountValue} FLAT OFF`}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Min spend:{' '}
                  <strong className="text-gray-700">{formatPrice(c.minSpend)}</strong>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Usage</span>
                    <span>
                      {c.usageCount} / {c.usageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${usagePercent}%` }}
                      className="h-full bg-[#093624] rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Calendar size={12} />
                  <span>Expires: {c.expiryDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleCouponStatus(c.id)}
                  className={`font-satoshi-bold hover:underline cursor-pointer ${
                    c.isActive ? 'text-[#6D6868]' : 'text-[#093624]'
                  }`}
                >
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => deleteCoupon(c.id)}
                  className="p-1 text-gray-400 hover:text-[#093624] cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. New Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <h3 className="text-sm font-bold font-satoshi-bold text-white!">Create Promo Voucher</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 space-y-4 text-xs font-satoshi">
              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FLASH25"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs font-mono font-bold focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Discount Amount *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountValue}
                    placeholder="e.g. 15"
                    onChange={(e) => {
                      const val = e.target.value;
                      // Strip leading zeros if more than 1 digit, allow blank
                      const sanitized = val === '' ? '' : String(Number(val));
                      setForm({ ...form, discountValue: sanitized });
                    }}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Min Order Spend (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.minSpend}
                    placeholder="e.g. 2500"
                    onChange={(e) => {
                      const val = e.target.value;
                      const sanitized = val === '' ? '' : String(Number(val));
                      setForm({ ...form, minSpend: sanitized });
                    }}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                  />
                </div>

                <div>
                  <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                    Max Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    placeholder="e.g. 300"
                    onChange={(e) => {
                      const val = e.target.value;
                      const sanitized = val === '' ? '' : String(Number(val));
                      setForm({ ...form, usageLimit: sanitized });
                    }}
                    className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 font-satoshi-bold rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#093624] text-[#F9F295] font-satoshi-bold rounded-xs cursor-pointer"
                >
                  Activate Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
