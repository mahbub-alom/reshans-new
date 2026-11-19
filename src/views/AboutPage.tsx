'use client';

import React from 'react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';
import { ArrowRight, Check, Sparkles, Shield, Clock, RotateCcw, CreditCard, Truck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useShop();

  const TEAM_MEMBERS = [
    {
      name: 'Jariya Rahman',
      role: 'CO-FOUNDER & CEO',
      image: '/assets/img/about/about-thumb-5.jpg',
    },
    {
      name: 'Price Khan',
      role: 'HEAD OF BRAND MARKETING',
      image: '/assets/img/about/about-thumb-6.jpg',
    },
    {
      name: 'Edward Lindgren',
      role: 'LEAD FASHION DESIGNER',
      image: '/assets/img/about/about-thumb-7.jpg',
    },
    {
      name: 'Ayesha Rahman',
      role: 'TEXTILE & SUSTAINABILITY DIRECTOR',
      image: '/assets/img/about/about-thumb-5.jpg',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* 1. Breadcrumb Top Area matching .aq-breadcrumb-ptb */}
      <div className="pt-16 sm:pt-24 pb-12 sm:pb-16 bg-[#FAFAFA] border-b border-[#F0EDED]">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#6D6868] font-satoshi-bold mb-4">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              home
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-[#093624]">about us</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#141414] font-satoshi-bold mb-4 tracking-tight leading-tight">
            Best store <br className="hidden sm:inline" /> Available to Everyone!
          </h1>
          <p className="text-base sm:text-lg text-[#6D6868] max-w-2xl mx-auto font-satoshi">
            "It pains me physically to see woman victimized, rendered pathetic by fast fashion." — We craft enduring, dignified wardrobe essentials that empower everyday confidence.
          </p>
        </div>
      </div>

      {/* 2. Hero Big Banner Image matching .aq-about-banner */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-xs shadow-lg bg-gray-100">
            <img
              src="/assets/img/about/about-thumb-1.jpg"
              alt="Reshans Atelier Story"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* 3. Three Features Area matching .aq-about-feature-style */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#141414] font-satoshi-bold">
              We are proudly crafted with excellence.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            {/* Feature 1 */}
            <div className="p-8 bg-[#F9F9F9] rounded-xs border border-[#F0EDED] hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
                <Sparkles size={26} />
              </div>
              <h4 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-3">Soft Fabric</h4>
              <p className="text-sm text-[#6D6868] leading-relaxed font-satoshi">
                Get complimentary ground shipping on every order across Bangladesh. Don't love the fit? Send it back, on us.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-[#F9F9F9] rounded-xs border border-[#F0EDED] hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
                <Shield size={26} />
              </div>
              <h4 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-3">Lightweight</h4>
              <p className="text-sm text-[#6D6868] leading-relaxed font-satoshi">
                Join Reshans Privileged Rewards to earn special vouchers, early access drops, and member-exclusive previews.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-[#F9F9F9] rounded-xs border border-[#F0EDED] hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center">
                <Clock size={26} />
              </div>
              <h4 className="text-xl font-bold font-satoshi-bold text-[#141414] mb-3">All Day Comfort</h4>
              <p className="text-sm text-[#6D6868] leading-relaxed font-satoshi">
                We believe getting dressed should be the easiest and most uplifting part of your day from morning commute to gala evening.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Product Story Section 1: "Designed to last." */}
      <div className="py-16 sm:py-20 bg-[#FAFAFA] border-y border-[#F0EDED]">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden shadow-md">
                <img
                  src="/assets/img/about/about-thumb-2.jpg"
                  alt="Designed to last"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#093624] block mb-2 font-satoshi-bold">
                Philosophy & Craft
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold font-satoshi-bold text-[#141414] mb-5">
                Designed to last.
              </h3>
              <p className="text-base text-[#6D6868] leading-relaxed mb-6 font-satoshi">
                Luxe, lightweight, and engineered with the finest Egyptian long-staple cotton and breathable cashmere-modal blends, our collections transcend fleeting micro-trends.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-[#141414] font-satoshi-med">
                    Precision French seam stitching for structural durability
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-[#141414] font-satoshi-med">
                    OEKO-TEX® certified non-toxic organic dye pigmentation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-[#141414] font-satoshi-med">
                    Tailored drape tailored specifically for South Asian silhouettes
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/')}
                variant="primary"
                size="md"
                icon={<ArrowRight size={14} />}
              >
                Explore Trending Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Product Story Section 2: "Our Heritage" */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#093624] block mb-2 font-satoshi-bold">
                Responsible Fashion
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold font-satoshi-bold text-[#141414] mb-5">
                Rooted in conscious production.
              </h3>
              <p className="text-base text-[#6D6868] leading-relaxed mb-6 font-satoshi">
                Founded with a bold ambition to bring premier quality tailoring to Bangladesh at accessible valuations, Reshans partners with domestic artisan weaver co-operatives and state-of-the-art green facilities.
              </p>
              <p className="text-sm text-[#6D6868] leading-relaxed mb-8 font-satoshi">
                Every purchase supports safe labor rights, fair wages for craftswomen, and closed-loop garment lifecycle programs.
              </p>

              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                size="md"
                icon={<ArrowRight size={14} />}
              >
                Get In Touch
              </Button>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden shadow-md">
                <img
                  src="/assets/img/about/about-thumb-3.jpg"
                  alt="Responsible Fashion"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Team Showcase matching .aq-about-team-style */}
      <div className="py-20 sm:py-24 bg-[#FAFAFA] border-t border-[#F0EDED]">
        <div className="max-w-[1330px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#093624] block mb-2 font-satoshi-bold">
              Leadership
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-satoshi-bold text-[#141414] mb-3">
              Meet Our Visionaries
            </h3>
            <p className="text-sm text-[#6D6868] font-satoshi">
              The passionate leaders, stylists, and creatives reimagining modern wardrobe staples.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-xs overflow-hidden border border-[#EBEBEB] text-center p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xs mb-4 bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-lg font-bold text-[#141414] font-satoshi-bold mb-1">
                  {member.name}
                </h4>
                <p className="text-xs uppercase tracking-wider text-[#6D6868] font-satoshi-bold">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

     
    </div>
  );
};
