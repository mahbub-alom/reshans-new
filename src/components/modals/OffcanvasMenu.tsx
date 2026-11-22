import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
import { X, ChevronDown, Phone, Mail, MapPin, Instagram, Heart, User, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const OffcanvasMenu: React.FC = () => {
  const {
    isOffcanvasOpen,
    closeOffcanvas,
    openSearch,
    openAuth,
    openCart,
    openWishlist,
    wishlistCount,
    navigate,
    navigateToCategory,
    activeCategoryFilter,
    isAuthenticated,
    isAdmin,
    settings,
  } = useShop();

  const handleAccountClick = () => {
    closeOffcanvas();
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden lg:hidden transition-[visibility] duration-500 ${
        isOffcanvasOpen ? 'visible pointer-events-auto' : 'invisible delay-500 pointer-events-none'
      }`}
    >
      {/* Backdrop with Slow Smooth Fade */}
      <div
        onClick={closeOffcanvas}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOffcanvasOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel: Slides from Left Smoothly and Slowly */}
      <div
        className={`fixed inset-y-0 left-0 max-w-full flex pr-10 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
          isOffcanvasOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Top Bar with Reshans BrandLogo & Animated Close Cross */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <BrandLogo />
            <button
              onClick={closeOffcanvas}
              aria-label="Close navigation"
              className="group w-9 h-9 rounded-full bg-gray-100 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] transition-all duration-300 cursor-pointer shadow-xs"
            >
              <X size={18} className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-6 py-3 bg-[#F1EFEE] flex items-center justify-between text-xs font-semibold text-[#093624] font-satoshi-med border-b border-gray-200/50">
            <button
              onClick={() => {
                closeOffcanvas();
                openWishlist();
              }}
              className="hover:underline cursor-pointer flex items-center gap-1"
            >
              <Heart size={13} className="text-[#093624]" />
              <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
            </button>
            <span>·</span>
            <button
              onClick={handleAccountClick}
              className="hover:underline cursor-pointer flex items-center gap-1"
            >
              <User size={13} className="text-[#093624]" />
              <span>{isAuthenticated ? (isAdmin ? 'Admin' : 'Dashboard') : 'Account'}</span>
            </button>
            <span>·</span>
            <button
              onClick={() => {
                closeOffcanvas();
                navigate('/cart');
              }}
              className="hover:underline cursor-pointer"
            >
              View Cart
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 px-6 py-4 space-y-1 font-satoshi-bold">
            {/* 1. Shop */}
            <div className="border-b border-gray-100 py-2.5">
              <Link
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                  closeOffcanvas();
                }}
                className="block text-sm font-bold text-[#141414] hover:text-[#093624] transition-colors cursor-pointer"
              >
                Shop
              </Link>
            </div>

            {/* 2. Men */}
            <div className="border-b border-gray-100 py-2.5">
              <Link
                href="/men"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/men');
                  closeOffcanvas();
                }}
                className="block text-sm font-bold text-[#141414] hover:text-[#093624] transition-colors cursor-pointer"
              >
                Men
              </Link>
            </div>

            {/* 3. Women */}
            <div className="border-b border-gray-100 py-2.5">
              <Link
                href="/women"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/women');
                  closeOffcanvas();
                }}
                className="block text-sm font-bold text-[#141414] hover:text-[#093624] transition-colors cursor-pointer"
              >
                Women
              </Link>
            </div>

            {/* 4. New Arrivals */}
            <div className="border-b border-gray-100 py-2.5">
              <Link
                href="/new-arrivals"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/new-arrivals');
                  closeOffcanvas();
                }}
                className="flex items-center justify-between text-sm font-bold text-[#141414] hover:text-[#093624] transition-colors cursor-pointer"
              >
                <span>New Arrivals</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#093624] text-[#F9F295] px-1.5 py-0.5 rounded-2xs">
                  NEW
                </span>
              </Link>
            </div>

            {/* 5. Collections with accordion */}
            <div className="border-b border-gray-100 pb-2">
              <button
                onClick={() => toggleSubmenu('collections')}
                className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-[#141414] hover:text-[#093624] cursor-pointer"
              >
                <span>Collections</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ease-out ${
                    openSubmenu === 'collections' ? 'rotate-180 text-[#093624]' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openSubmenu === 'collections'
                    ? 'grid-rows-[1fr] opacity-100 pb-2'
                    : 'grid-rows-[0fr] opacity-0 pb-0'
                }`}
              >
                <div className="overflow-hidden pl-4 space-y-2 text-xs text-[#55585B] font-satoshi-med pt-1 border-l-2 border-[#093624]/20 ml-1">
                  <button
                    onClick={() => {
                      navigate('/collections');
                      closeOffcanvas();
                    }}
                    className="block w-full text-left py-1 text-[#093624] font-bold hover:underline cursor-pointer"
                  >
                    View All Collections
                  </button>
                  <button
                    onClick={() => {
                      navigate('/collections');
                      closeOffcanvas();
                    }}
                    className="block w-full text-left py-1 hover:text-[#093624] cursor-pointer"
                  >
                    Summer Series 2026
                  </button>
                  <button
                    onClick={() => {
                      navigate('/collections');
                      closeOffcanvas();
                    }}
                    className="block w-full text-left py-1 hover:text-[#093624] cursor-pointer"
                  >
                    Winter & Alpaca Knits
                  </button>
                  <button
                    onClick={() => {
                      navigate('/collections');
                      closeOffcanvas();
                    }}
                    className="block w-full text-left py-1 hover:text-[#093624] cursor-pointer"
                  >
                    Office & Workleisure
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Sale */}
            <div className="border-b border-gray-100 py-2.5">
              <Link
                href="/sale"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/sale');
                  closeOffcanvas();
                }}
                className="flex items-center justify-between text-sm font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                <span>Sale</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded-2xs">
                  HOT
                </span>
              </Link>
            </div>

            {/* Divider for account / tracking */}
            <div className="pt-2" />

            {/* About */}
            <div className="border-b border-gray-100 py-2.5">
              <button
                onClick={() => {
                  closeOffcanvas();
                  navigate('/about');
                }}
                className="w-full text-left block text-sm font-bold text-[#141414] hover:text-[#093624] cursor-pointer"
              >
                About Us
              </button>
            </div>

            {/* Contact */}
            <div className="border-b border-gray-100 py-2.5">
              <button
                onClick={() => {
                  closeOffcanvas();
                  navigate('/contact');
                }}
                className="w-full text-left block text-sm font-bold text-[#141414] hover:text-[#093624] cursor-pointer"
              >
                Contact Us
              </button>
            </div>

            {/* Track Order */}
            <div className="border-b border-gray-100 py-2.5">
              <button
                onClick={() => {
                  closeOffcanvas();
                  navigate('/track-order');
                }}
                className="w-full text-left block text-sm font-bold text-[#141414] hover:text-[#093624] cursor-pointer"
              >
                Track Order
              </button>
            </div>

            {/* My Wishlist */}
            <div className="border-b border-gray-100 py-2.5">
              <button
                onClick={() => {
                  closeOffcanvas();
                  openWishlist();
                }}
                className="w-full flex items-center justify-between text-sm font-bold text-[#141414] hover:text-[#093624] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={16} className="text-[#093624]" />
                  <span>My Wishlist</span>
                </div>
                {wishlistCount > 0 ? (
                  <span className="w-5 h-5 bg-[#093624] text-[#F9F295] text-[10px] font-bold rounded-full flex items-center justify-center font-satoshi-bold tabular-nums">
                    {wishlistCount}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 font-satoshi">0 items</span>
                )}
              </button>
            </div>

            {/* My Account */}
            <div className="border-b border-gray-100 py-2.5">
              <button
                onClick={() => {
                  closeOffcanvas();
                  navigate('/dashboard');
                }}
                className="w-full flex items-center justify-between text-sm font-bold text-[#141414] hover:text-[#093624] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <User size={16} className="text-[#093624]" />
                  <span>Dashboard & Orders</span>
                </div>
                <span className="text-xs text-[#093624] font-satoshi-med">My Account</span>
              </button>
            </div>
          </div>

          {/* Contact Information & Socials (Original Design) */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3 text-xs text-[#55585B] font-satoshi">
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-[#093624]" />
              <a
                href={`tel:${(settings.phone || '+880 1977 378 642').replace(/[^0-9+]/g, '')}`}
                className="font-semibold text-[#141414] font-satoshi-bold hover:underline"
              >
                {settings.phone || '+880 1977 378 642'}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-[#093624]" />
              <a
                href={`mailto:${settings.email || 'Reshans@gmail.com'}`}
                className="hover:underline hover:text-[#093624]"
              >
                {settings.email || 'Reshans@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-[#093624]" />
              <span>{settings.address || 'Gulshan 2, Dhaka, Bangladesh'}</span>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <a
                href={settings.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#093624] hover:bg-[#093624] hover:text-[#F9F295] transition-colors"
              >
                <Instagram size={14} />
              </a>
              <span className="text-xs font-semibold text-[#093624] font-satoshi-bold">500k Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
