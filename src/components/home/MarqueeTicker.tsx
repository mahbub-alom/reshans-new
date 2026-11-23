'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const MarqueeTicker: React.FC = () => {
  const { banners } = useShop();
  const marqueeBanner = banners.find((b) => b.type === 'marquee');

  // If marquee is explicitly toggled off by admin, do not render
  if (marqueeBanner && !marqueeBanner.isActive) {
    return null;
  }

  // Strictly use ONLY the text provided by admin in the dashboard
  const activeMessages: string[] = [];
  if (marqueeBanner?.title?.trim()) {
    activeMessages.push(marqueeBanner.title.trim());
  }
  if (marqueeBanner?.subtitle?.trim()) {
    activeMessages.push(marqueeBanner.subtitle.trim());
  }

  // If admin left both empty, don't show or show single default announcement
  if (activeMessages.length === 0) {
    return null;
  }

  // Repeat the messages 3 to 4 times so the infinite marquee strip smoothly fills the entire width without blank gaps
  const loopSequence = [...activeMessages, ...activeMessages, ...activeMessages, ...activeMessages];

  return (
    <div
      data-aos="fade-in"
      data-aos-duration="600"
      className="w-full bg-[#093624] text-[#F9F295] py-4 border-y border-[#0d4a32] overflow-hidden select-none"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Sequence 1 */}
        {loopSequence.map((msg, idx) => (
          <div key={`msg-1-${idx}`} className="flex items-center gap-6 mx-6">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-satoshi-bold">
              {msg}
            </span>
            {/* <Zap size={14} className="text-[#F9F295] fill-[#F9F295] shrink-0" /> */}
          </div>
        ))}

        {/* Sequence 2 for seamless continuous infinite loop */}
        {loopSequence.map((msg, idx) => (
          <div key={`msg-2-${idx}`} className="flex items-center gap-6 mx-6">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase font-satoshi-bold">
              {msg}
            </span>
            {/* <Zap size={14} className="text-[#F9F295] fill-[#F9F295] shrink-0" /> */}
          </div>
        ))}
      </div>
    </div>
  );
};
