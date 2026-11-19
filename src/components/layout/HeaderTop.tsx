'use client';

import React, { useState } from 'react';
import { Phone, ChevronDown, Instagram } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const HeaderTop: React.FC = () => {
  const { openAuth, navigate } = useShop();
  const [lang, setLang] = useState('English');
  const [curr, setCurr] = useState('BDT');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);

  return (
    <div className="bg-[#093624] text-white text-[12px] py-2.5 border-b border-[#0d4a32] relative z-40">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Followers & Telephone */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer">
              <Instagram size={14} className="text-[#F9F295]" />
              <span className="font-satoshi-med">500k Followers</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <Phone size={13} className="text-[#F9F295]" />
              
              <a href="tel:01977378642" className="font-satoshi-med hover:underline">
                +880 1977 378 642
              </a>
            </div>
          </div>

          {/* Center: Free Delivery / Promotion in BDT */}
          {/* <div className="flex-1 text-center text-white/90 font-satoshi-med px-2">
            <span>Free delivery across Bangladesh on orders over ৳ 2,500:{' '}</span>
            <button
              onClick={openAuth}
              className="text-[#F9F295] font-satoshi-bold underline underline-offset-2 hover:text-white transition-colors ml-1 cursor-pointer"
            >
              Sign Up
            </button>
          </div> */}

          {/* Right: Currency & Language Dropdowns */}
          {/* <div className="hidden sm:flex items-center gap-5">
        
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsCurrOpen(false);
                }}
                className="flex items-center gap-1 text-white/80 hover:text-white font-satoshi-med cursor-pointer"
              >
                <span>{lang}</span>
                <ChevronDown size={12} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 bg-white text-[#141414] shadow-lg rounded-xs py-1.5 z-50 border border-gray-100">
                  {['English', 'বাংলা (Bangla)', 'Spanish'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 ${
                        lang === l ? 'font-bold text-[#093624]' : ''
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

      
            <div className="relative">
              <button
                onClick={() => {
                  setIsCurrOpen(!isCurrOpen);
                  setIsLangOpen(false);
                }}
                className="flex items-center gap-1 text-white/80 hover:text-white font-satoshi-med cursor-pointer"
              >
                <span>{curr} (৳)</span>
                <ChevronDown size={12} />
              </button>
              {isCurrOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 bg-white text-[#141414] shadow-lg rounded-xs py-1.5 z-50 border border-gray-100">
                  {['BDT (৳)', 'USD ($)', 'EUR (€)', 'GBP (£)'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurr(c.split(' ')[0]);
                        setIsCurrOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 ${
                        curr === c.split(' ')[0] ? 'font-bold text-[#093624]' : ''
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={openAuth}
              className="text-white/80 hover:text-[#F9F295] font-satoshi-med transition-colors cursor-pointer"
            >
              Account
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="px-2 py-0.5 bg-white/10 hover:bg-[#F9F295] text-[#F9F295] hover:text-[#093624] rounded-xs font-satoshi-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F9F295] group-hover:bg-[#093624]" />
              <span>Admin Panel</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
