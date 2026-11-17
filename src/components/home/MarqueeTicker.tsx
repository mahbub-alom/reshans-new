'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const MESSAGES = [
  'Spring Clearance Event: Save Up to 70%',
  'Flash Sale: Get 20% Off With Code RESHANS20',
  'Free Express Delivery Across Bangladesh on Orders Over ৳ 2,500',
  'Cash on Delivery & bKash Available Across BD',
  'Discover the New Reshans Luxury Capsule',
  'Premium Packaging & Same-Day Dispatch in Dhaka',
];

export const MarqueeTicker: React.FC = () => {
  const { banners } = useShop();
  const marqueeBanner = banners.find((b) => b.type === 'marquee' && b.isActive);
  const activeMessages = marqueeBanner
    ? [marqueeBanner.title, marqueeBanner.subtitle || '', ...MESSAGES].filter(Boolean)
    : MESSAGES;

  return (
    <div
      data-aos="fade-in"
      data-aos-duration="600"
      className="w-full bg-[#093624] text-[#F9F295] py-4 border-y border-[#0d4a32] overflow-hidden select-none"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Sequence 1 */}
        {activeMessages.map((msg, idx) => (
          <div key={`msg-1-${idx}`} className="flex items-center gap-6 mx-6">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-satoshi-bold">
              {msg}
            </span>
            <Zap size={14} className="text-[#F9F295] fill-[#F9F295] shrink-0" />
          </div>
        ))}

        {/* Sequence 2 for continuous loop */}
        {activeMessages.map((msg, idx) => (
          <div key={`msg-2-${idx}`} className="flex items-center gap-6 mx-6">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-satoshi-bold">
              {msg}
            </span>
            <Zap size={14} className="text-[#F9F295] fill-[#F9F295] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
