'use client';

import React from 'react';
import { Button } from '../common/Button';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#141414]">
      {/* Hero Image Container */}
      <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px]">
        {/* Desktop Image */}
        <img
          src="/assets/img/fashion-2/hero/hero-img.jpg"
          alt="Reshans Online Exclusive Fashion"
          className="hidden md:block w-full h-full object-cover object-center"
        />
        {/* Mobile Image */}
        <img
          src="/assets/img/fashion-1/banner/banner-1-1.jpg"
          alt="Reshans Online Exclusive Fashion"
          className="block md:hidden w-full h-full object-cover object-center"
        />

        {/* Ambient Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />

        {/* Centered Content with AOS Smooth Animation */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Subtitle tag with AOS */}
            <span
              data-aos="fade-down"
              data-aos-duration="600"
              className="inline-block text-[#F9F295] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 py-1 px-3 bg-black/40 backdrop-blur-xs rounded-xs border border-[#F9F295]/30 font-satoshi"
            >
              Flash Sale Madness
            </span>

            {/* Display Headline with AOS */}
            <h1
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="150"
              className="text-white text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-7 drop-shadow-md text-balance font-satoshi-bold"
            >
              Online Exclusive
            </h1>

            {/* CTA Button with AOS */}
            <div data-aos="zoom-in" data-aos-duration="700" data-aos-delay="300">
              <Button
                variant="secondary"
                size="lg"
                icon={<ArrowRight size={16} />}
                onClick={() => {
                  const target = document.getElementById('trending');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
