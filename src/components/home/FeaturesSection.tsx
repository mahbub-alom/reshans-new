'use client';

import React from 'react';
import { Truck, RotateCcw, CreditCard, Headphones } from 'lucide-react';

const FEATURES = [
  {
    icon: <Truck size={26} className="text-[#093624]" />,
    title: 'Free Shipping in BD',
    desc: 'Free delivery on orders over ৳ 2,500',
  },
  {
    icon: <RotateCcw size={26} className="text-[#093624]" />,
    title: 'Easy Exchanges',
    desc: 'Within 7 days for size or style exchange',
  },
  {
    icon: <CreditCard size={26} className="text-[#093624]" />,
    title: 'Flexible BD Payment',
    desc: 'bKash, Nagad, Cards & Cash on Delivery',
  },
  {
    icon: <Headphones size={26} className="text-[#093624]" />,
    title: 'Support 24/7',
    desc: 'Dedicated customer support anytime',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-12 bg-white overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          data-aos-duration="750"
          className="bg-[#F1EFEE] rounded-sm py-9 px-6 sm:px-10 lg:px-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((item, idx) => (
              <div
                key={idx}
                data-aos="zoom-in"
                data-aos-duration="600"
                data-aos-delay={idx * 100}
                className="flex items-center gap-4"
              >
                <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-gray-200/50">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#141414] leading-snug font-satoshi-bold">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6D6868] mt-1 font-medium font-satoshi">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
