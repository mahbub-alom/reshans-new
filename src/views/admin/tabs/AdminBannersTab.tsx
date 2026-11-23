'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Edit,
  Save,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { WebsiteBanner } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminBannersTab: React.FC = () => {
  const { banners, updateBanner, toggleBanner, navigate } = useShop();
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [tempBanner, setTempBanner] = useState<Partial<WebsiteBanner>>({});

  const heroBanners = banners.filter((b) => b.type === 'hero');
  const dualBanners = banners.filter((b) => b.type === 'dual');
  const marqueeBanners = banners.filter((b) => b.type === 'marquee');

  const handleStartEdit = (b: WebsiteBanner) => {
    setEditingBannerId(b.id);
    setTempBanner({
      title: b.title,
      subtitle: b.subtitle,
      buttonText: b.buttonText,
      link: b.link,
      imageUrl: b.imageUrl,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateBanner(id, tempBanner);
    setEditingBannerId(null);
  };

  return (
    <div className="space-y-8 font-satoshi">
      {/* 1. Hero Campaign Banner Manager */}
      {/* <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBEB]">
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
              <ImageIcon size={18} className="text-[#093624]" />
              <span>Hero Slider & Campaign Banners</span>
            </h3>
            <p className="text-xs text-brand-body">
              Primary hero section displayed at the top of the homepage
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-satoshi-bold text-[#093624] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Preview on Homepage</span>
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="space-y-4">
          {heroBanners.map((banner) => (
            <div
              key={banner.id}
              className="border border-[#EBEBEB] rounded-xs p-4 bg-[#F9F9F9] hover:bg-white transition-colors"
            >
              {editingBannerId === banner.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                      Hero Headline *
                    </label>
                    <input
                      type="text"
                      value={tempBanner.title || ''}
                      onChange={(e) => setTempBanner({ ...tempBanner, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={tempBanner.subtitle || ''}
                        onChange={(e) => setTempBanner({ ...tempBanner, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={tempBanner.buttonText || ''}
                        onChange={(e) => setTempBanner({ ...tempBanner, buttonText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                      Background Image Path
                    </label>
                    <input
                      type="text"
                      value={tempBanner.imageUrl || ''}
                      onChange={(e) => setTempBanner({ ...tempBanner, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingBannerId(null)}
                      className="px-3 py-1.5 border border-gray-300 text-xs font-satoshi-bold rounded-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(banner.id)}
                      className="px-4 py-1.5 bg-[#093624] text-[#F9F295] text-xs font-satoshi-bold rounded-xs cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 bg-gray-200 rounded-xs overflow-hidden shrink-0 border border-gray-200">
                      <img
                        src={banner.imageUrl || '/assets/img/fashion-1/slider/slider-1.jpg'}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                        {banner.title}
                      </h4>
                      <p className="text-xs text-gray-500">{banner.subtitle}</p>
                      <span className="text-[10px] text-[#093624] font-satoshi-bold mt-1 inline-block">
                        Button: "{banner.buttonText}" → {banner.link}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBanner(banner.id)}
                      className={`px-3 py-1 rounded-xs text-xs font-satoshi-bold cursor-pointer transition-colors ${
                        banner.isActive
                          ? 'bg-[#093624] text-[#F9F295]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => handleStartEdit(banner)}
                      className="p-1.5 text-gray-500 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                      title="Edit Banner"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* 2. Dual Promotional Banners */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="pb-4 border-b border-[#EBEBEB]">
          <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
            Dual Campaign
          </h3>
      
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dualBanners.map((banner) => (
            <div
              key={banner.id}
              className="border border-[#EBEBEB] rounded-xs p-4 bg-[#F9F9F9] hover:bg-white transition-colors"
            >
              {editingBannerId === banner.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-satoshi-bold uppercase text-brand-body mb-1">
                      Banner Title
                    </label>
                    <input
                      type="text"
                      value={tempBanner.title || ''}
                      onChange={(e) => setTempBanner({ ...tempBanner, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-satoshi-bold uppercase text-brand-body mb-1">
                      Offer Description
                    </label>
                    <input
                      type="text"
                      value={tempBanner.subtitle || ''}
                      onChange={(e) => setTempBanner({ ...tempBanner, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded-xs text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingBannerId(null)}
                      className="px-3 py-1.5 border border-gray-300 text-xs font-satoshi-bold rounded-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(banner.id)}
                      className="px-4 py-1.5 bg-[#093624] text-[#F9F295] text-xs font-satoshi-bold rounded-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-200 rounded-xs overflow-hidden shrink-0">
                      <img
                        src={banner.imageUrl || '/assets/img/fashion-1/banner/banner-1.jpg'}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-satoshi-bold text-[#141414]">
                        {banner.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">{banner.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBanner(banner.id)}
                      className={`px-2.5 py-0.5 rounded-xs text-[11px] font-satoshi-bold cursor-pointer ${
                        banner.isActive
                          ? 'bg-[#093624] text-[#F9F295]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Off'}
                    </button>
                    <button
                      onClick={() => handleStartEdit(banner)}
                      className="p-1 text-gray-400 hover:text-[#093624] cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Marquee Announcement Ticker */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="pb-3 border-b border-[#EBEBEB] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
             
              <span>Marquee Announcement Bar</span>
            </h3>
         
          </div>
        </div>

        {marqueeBanners.map((m) => (
          <div key={m.id} className="p-4 bg-[#093624] text-white rounded-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-[#F9F295] font-satoshi-bold uppercase tracking-wider">
              <span>Marquee Preview</span>
              <button
                onClick={() => toggleBanner(m.id)}
                className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded-xs text-white text-[10px] cursor-pointer"
              >
                {m.isActive ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="text-xs font-satoshi-bold tracking-widest uppercase bg-black/20 p-2.5 rounded-xs border border-white/10 truncate">
              {m.title} • {m.subtitle}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-satoshi-bold text-white/70 uppercase mb-1">
                  Marquee Announcement Text
                </label>
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => updateBanner(m.id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder-white/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-satoshi-bold text-white/70 uppercase mb-1">
                  Coupon Voucher Code in Marquee
                </label>
                <input
                  type="text"
                  value={m.subtitle || ''}
                  onChange={(e) => updateBanner(m.id, { subtitle: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
