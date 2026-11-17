'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Truck,
  CreditCard,
  Share2,
  Building,
  CheckCircle,
} from 'lucide-react';
import { WebsiteSettings } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminSettingsTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useShop();
  const [formData, setFormData] = useState<WebsiteSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Store settings saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-satoshi text-xs">
      {/* 1. General Store Identity */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
          <Building size={18} className="text-[#093624]" />
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Store Identity & Contact Details
            </h3>
            <p className="text-xs text-brand-body">
              Primary brand information presented to buyers across Bangladesh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Support Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Physical Atelier / Flagship Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>
        </div>
      </div>

      {/* 2. Shipping & Delivery Charges */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
          <Truck size={18} className="text-[#093624]" />
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Courier & Shipping Tariffs (BDT ৳)
            </h3>
            <p className="text-xs text-brand-body">
              Automatic delivery fees applied during customer checkout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Inside Dhaka Delivery (৳)
            </label>
            <input
              type="number"
              min={0}
              value={formData.shippingInsideDhaka}
              onChange={(e) =>
                setFormData({ ...formData, shippingInsideDhaka: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Outside Dhaka Delivery (৳)
            </label>
            <input
              type="number"
              min={0}
              value={formData.shippingOutsideDhaka}
              onChange={(e) =>
                setFormData({ ...formData, shippingOutsideDhaka: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Free Delivery Threshold (৳)
            </label>
            <input
              type="number"
              min={0}
              value={formData.freeShippingThreshold}
              onChange={(e) =>
                setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>
        </div>
      </div>

      {/* 3. Payment Methods */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
          <CreditCard size={18} className="text-[#093624]" />
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Payment Gateways & Options
            </h3>
            <p className="text-xs text-brand-body">
              Enable or disable payment channels available to customers at checkout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="p-3 border border-[#EBEBEB] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#093624] transition-colors">
            <div>
              <span className="font-satoshi-bold text-[#141414] block">Cash on Delivery (COD)</span>
              <span className="text-[11px] text-gray-500">Pay cash upon package arrival</span>
            </div>
            <input
              type="checkbox"
              checked={formData.paymentCOD}
              onChange={(e) => setFormData({ ...formData, paymentCOD: e.target.checked })}
              className="w-4 h-4 accent-[#093624]"
            />
          </label>

          <label className="p-3 border border-[#EBEBEB] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#093624] transition-colors">
            <div>
              <span className="font-satoshi-bold text-[#141414] block">bKash Merchant Gateway</span>
              <span className="text-[11px] text-gray-500">Instant mobile financial service</span>
            </div>
            <input
              type="checkbox"
              checked={formData.paymentBkash}
              onChange={(e) => setFormData({ ...formData, paymentBkash: e.target.checked })}
              className="w-4 h-4 accent-[#093624]"
            />
          </label>

          <label className="p-3 border border-[#EBEBEB] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#093624] transition-colors">
            <div>
              <span className="font-satoshi-bold text-[#141414] block">Nagad Direct Gateway</span>
              <span className="text-[11px] text-gray-500">Bangladesh Post Office digital payment</span>
            </div>
            <input
              type="checkbox"
              checked={formData.paymentNagad}
              onChange={(e) => setFormData({ ...formData, paymentNagad: e.target.checked })}
              className="w-4 h-4 accent-[#093624]"
            />
          </label>

          <label className="p-3 border border-[#EBEBEB] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#093624] transition-colors">
            <div>
              <span className="font-satoshi-bold text-[#141414] block">Visa / Mastercard / Amex</span>
              <span className="text-[11px] text-gray-500">SSLCommerz secure card processing</span>
            </div>
            <input
              type="checkbox"
              checked={formData.paymentCards}
              onChange={(e) => setFormData({ ...formData, paymentCards: e.target.checked })}
              className="w-4 h-4 accent-[#093624]"
            />
          </label>
        </div>
      </div>

      {/* 4. Social Media Channels */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
          <Share2 size={18} className="text-[#093624]" />
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Social Media Channels
            </h3>
            <p className="text-xs text-brand-body">
              Footer links and customer engagement channels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Facebook Page
            </label>
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Instagram Handle
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              YouTube Channel
            </label>
            <input
              type="text"
              value={formData.youtube}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold uppercase tracking-wider flex items-center gap-2 transition-opacity cursor-pointer shadow-md"
        >
          <Save size={16} />
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
};
