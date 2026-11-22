'use client';

import React, { useState } from 'react';
import { Phone, ChevronDown, Instagram } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const HeaderTop: React.FC = () => {
  const { openAuth, navigate, currentUser, isAuthenticated, isAdmin, logoutUser } = useShop();
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

          {/* Right: Auth & Account Navigation */}
          {/* <div className="flex items-center gap-4 text-xs font-satoshi-med">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-white/80">
                  Welcome, <strong className="text-[#F9F295] font-satoshi-bold">{currentUser?.name}</strong>
                </span>

                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-2 py-0.5 bg-[#F9F295] text-[#093624] font-bold rounded-xs text-[11px] uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-white/80 hover:text-white hover:underline cursor-pointer"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => logoutUser()}
                  className="text-white/60 hover:text-red-300 transition-colors cursor-pointer ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-white/90 hover:text-[#F9F295] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <span className="text-white/40">|</span>
                <button
                  onClick={() => navigate('/register')}
                  className="text-white/90 hover:text-[#F9F295] transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
