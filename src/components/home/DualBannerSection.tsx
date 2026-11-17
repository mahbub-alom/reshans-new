'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const DualBannerSection: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section className="py-6 sm:py-10 bg-white overflow-hidden">
      {/* Width adjusted to be more compact matching reference container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Banner 1: Discover latest In Fashion */}
          <div
            data-aos="fade-right"
            data-aos-duration="850"
            className="group relative overflow-hidden rounded-xs bg-[#F7F7F7] min-h-[340px] sm:min-h-[400px] flex items-center"
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/assets/img/fashion-2/banner/banner-1.jpg"
                alt="Discover latest In Fashion"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
            </div>

            {/* Content Box */}
            <div className="relative z-10 p-8 sm:p-12 max-w-sm">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#141414] mb-3 font-satoshi-bold">
                New Collection
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#141414] leading-tight mb-6 font-satoshi-bold">
                Discover latest <br /> In Fashion
              </h3>
              <Link
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                }}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] font-bold text-xs uppercase tracking-wider py-3 px-7 rounded-xs transition-colors font-satoshi-bold shadow-xs cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Banner 2: Discover Style In Tshirt */}
          <div
            data-aos="fade-left"
            data-aos-duration="850"
            className="group relative overflow-hidden rounded-xs bg-[#F7F7F7] min-h-[340px] sm:min-h-[400px] flex items-center"
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/assets/img/fashion-2/banner/banner-2.jpg"
                alt="Discover Style In Tshirt"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
            </div>

            {/* Content Box */}
            <div className="relative z-10 p-8 sm:p-12 max-w-sm">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#141414] mb-3 font-satoshi-bold">
                New Collection
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#141414] leading-tight mb-6 font-satoshi-bold">
                Discover <br /> Style In Tshirt
              </h3>
              <Link
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                }}
                className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] font-bold text-xs uppercase tracking-wider py-3 px-7 rounded-xs transition-colors font-satoshi-bold shadow-xs cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
