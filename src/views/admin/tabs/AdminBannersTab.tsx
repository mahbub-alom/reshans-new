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
  const { banners, updateBanner, toggleBanner, navigate, showToast } = useShop();
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [tempBanner, setTempBanner] = useState<Partial<WebsiteBanner>>({});

  const heroBanners = banners.filter((b) => b.type === 'hero');
  const dualBanners = banners.filter((b) => b.type === 'dual');
  const marqueeBanners = banners.filter((b) => b.type === 'marquee');
  const activeMarquee = marqueeBanners[0];

  // Dedicated marquee state for editing
  const [marqueeTitle, setMarqueeTitle] = useState(activeMarquee?.title || '');
  const [marqueeSubtitle, setMarqueeSubtitle] = useState(activeMarquee?.subtitle || '');
  const [isSavingMarquee, setIsSavingMarquee] = useState(false);

  // Sync state if banners update from DB
  React.useEffect(() => {
    if (activeMarquee) {
      setMarqueeTitle(activeMarquee.title);
      setMarqueeSubtitle(activeMarquee.subtitle || '');
    }
  }, [activeMarquee?.title, activeMarquee?.subtitle]);

  const handleSaveMarquee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMarquee) return;
    setIsSavingMarquee(true);

    try {
      await updateBanner(activeMarquee.id, {
        title: marqueeTitle.trim(),
        subtitle: marqueeSubtitle.trim(),
      });
      showToast('Marquee announcement updated and live in real-time!');
    } catch {
      showToast('Failed to save marquee announcement');
    } finally {
      setIsSavingMarquee(false);
    }
  };

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
      {/* <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-5">
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
      </div> */}

      {/* 3. Marquee Announcement Ticker */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="pb-3 border-b border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
              
              <span>Marquee Announcement </span>
            </h3>
            
          </div>
          
        </div>

        {marqueeBanners.length === 0 ? (
          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xs text-center text-xs text-gray-500">
            No marquee announcement configured. Click below to initialize one.
          </div>
        ) : (
          <form onSubmit={handleSaveMarquee} className="p-5 bg-[#093624] text-white rounded-xs space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#F9F295] font-satoshi-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span>Live Storefront Marquee Status</span>
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-2xs ${
                    activeMarquee?.isActive ? 'bg-[#F9F295] text-[#093624]' : 'bg-white/20 text-white'
                  }`}
                >
                  {activeMarquee?.isActive ? 'Active' : 'Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => activeMarquee && toggleBanner(activeMarquee.id)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xs text-white text-[11px] font-bold cursor-pointer transition-colors"
                >
                  {activeMarquee?.isActive ? 'Turn Off Marquee' : 'Turn On Marquee'}
                </button>
              </div>
            </div>

            {/* Live Preview Strip */}
            <div className="overflow-hidden bg-black/30 p-3 rounded-xs border border-white/15">
              <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider mb-1">
                Preview in real-time
              </span>
              <div className="text-xs sm:text-sm font-bold tracking-widest uppercase font-satoshi-bold text-[#F9F295] truncate">
                 {marqueeTitle || 'SPECIAL STOREWIDE PROMOTION'} {marqueeSubtitle ? `• ${marqueeSubtitle}` : ''} 
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-satoshi-bold text-white/80 uppercase tracking-wider mb-1.5">
                  Announcement Headline *
                </label>
                <input
                  type="text"
                  required
                  value={marqueeTitle}
                  onChange={(e) => setMarqueeTitle(e.target.value)}
                  placeholder="e.g. FREE EXPRESS SHIPPING ACROSS BANGLADESH ON ORDERS OVER ৳ 2,500"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F9F295] focus:bg-white/15 transition-all"
                />
                <span className="text-[10px] text-white/50 mt-1 block">
                  Displays prominently across the sliding announcement ticker.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-satoshi-bold text-white/80 uppercase tracking-wider mb-1.5">
                  Promo Offer or Voucher Code (Optional)
                </label>
                <input
                  type="text"
                  value={marqueeSubtitle}
                  onChange={(e) => setMarqueeSubtitle(e.target.value)}
                  placeholder="e.g. USE CODE: EID2026 FOR 25% OFF"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F9F295] focus:bg-white/15 transition-all"
                />
                <span className="text-[10px] text-white/50 mt-1 block">
                  Appended next to the headline separated by a divider.
                </span>
              </div>
            </div>

            {/* Save Action Button */}
            <div className="pt-2 flex justify-end border-t border-white/15">
              <button
                type="submit"
                disabled={isSavingMarquee}
                className="px-6 py-2.5 bg-[#F9F295] hover:bg-[#fae968] disabled:opacity-60 text-[#093624] font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 transition-all cursor-pointer font-satoshi-bold shadow-xs"
              >
                <Save size={14} />
                <span>{isSavingMarquee ? 'Saving...' : 'Save Marquee Announcement'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
