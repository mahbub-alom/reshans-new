'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';

interface BrandLogoProps {
  className?: string;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', light = false }) => {
  const { navigate } = useShop();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Link href="/" onClick={handleClick} className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* Emblem SVG icon */}
      <div className={`w-8 h-8 rounded-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
        light ? 'bg-[#F9F295] text-[#093624]' : 'bg-[#093624] text-[#F9F295]'
      }`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 3H14C17.3137 3 20 5.68629 20 9C20 12.3137 17.3137 15 14 15H6V3Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 14L18 21"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M6 9H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <span className={`text-2xl font-black tracking-[-0.03em] font-satoshi-bold uppercase ${
        light ? 'text-white' : 'text-[#093624]'
      }`}>
        Reshans
      </span>
    </Link>
  );
};
