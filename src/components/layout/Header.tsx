import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from '../common/BrandLogo';

export const Header: React.FC = () => {
  const {
    openCart,
    openWishlist,
    openSearch,
    openOffcanvas,
    openAuth,
    cartCount,
    cartTotal,
    wishlistCount,
    formatPrice,
    navigate,
    navigateToCategory,
    currentPath,
    activeCategoryFilter,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-40 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md py-3' : 'py-4 sm:py-5'
      }`}
    >
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 relative">
          {/* Mobile Hamburger Button on Left (< lg) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={openOffcanvas}
              aria-label="Open navigation menu"
              className="group p-2 text-[#141414] hover:text-[#093624] transition-colors cursor-pointer shrink-0 flex flex-col justify-center items-start w-10 h-10 gap-1.5"
            >
              <span className="w-6 h-[2px] bg-[#141414] group-hover:bg-[#093624] rounded-full transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:w-5" />
              <span className="w-4 h-[2px] bg-[#141414] group-hover:bg-[#093624] rounded-full transition-all duration-300 ease-out group-hover:w-6" />
              <span className="w-5 h-[2px] bg-[#141414] group-hover:bg-[#093624] rounded-full transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:w-4" />
            </button>
          </div>

          {/* Brand Logo: Centered on Mobile (< lg), Left-aligned on Desktop (lg:) */}
          <div className="lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 flex items-center shrink-0">
            <BrandLogo />
          </div>

          {/* Desktop Navigation Links: Clean, minimal, modern */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 font-satoshi-bold">
            {/* 1. Shop */}
            <Link
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory('all');
              }}
              className={`text-[15px] transition-colors cursor-pointer py-1 ${
                currentPath === '/shop' && (!activeCategoryFilter || activeCategoryFilter === 'all')
                  ? 'text-[#093624] font-black'
                  : 'text-[#141414] hover:text-[#093624]'
              }`}
            >
              Shop
            </Link>

            {/* 2. Men */}
            <Link
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory('Men Collection');
              }}
              className={`text-[15px] transition-colors cursor-pointer py-1 ${
                activeCategoryFilter === 'Men Collection'
                  ? 'text-[#093624] font-black'
                  : 'text-[#141414] hover:text-[#093624]'
              }`}
            >
              Men
            </Link>

            {/* 3. Women */}
            <Link
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory('Women Collection');
              }}
              className={`text-[15px] transition-colors cursor-pointer py-1 ${
                activeCategoryFilter === 'Women Collection' || activeCategoryFilter === 'Casual Wear'
                  ? 'text-[#093624] font-black'
                  : 'text-[#141414] hover:text-[#093624]'
              }`}
            >
              Women
            </Link>

            {/* 4. New Arrivals */}
            <Link
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory('new');
              }}
              className={`text-[15px] transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                activeCategoryFilter === 'new'
                  ? 'text-[#093624] font-black'
                  : 'text-[#141414] hover:text-[#093624]'
              }`}
            >
              <span>New Arrivals</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#093624] text-[#F9F295] px-1.5 py-0.5 rounded-2xs font-satoshi-bold">
                New
              </span>
            </Link>

            {/* 5. Collections (Minimal dropdown) */}
            <div
              className="relative py-2 group"
              onMouseEnter={() => setActiveDropdown('collections')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  navigateToCategory('all');
                  setActiveDropdown(null);
                }}
                className={`flex items-center gap-1.5 text-[15px] transition-colors cursor-pointer ${
                  activeDropdown === 'collections' ||
                  ['Workleisure', 'Smart Casual', 'Streetwear', 'Knitwear'].includes(activeCategoryFilter)
                    ? 'text-[#093624]'
                    : 'text-[#141414] hover:text-[#093624]'
                }`}
              >
                <span>Collections</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ease-out ${
                    activeDropdown === 'collections' ? 'rotate-180 text-[#093624]' : ''
                  }`}
                />
              </button>

              {/* Smooth Minimal Collections Dropdown Menu */}
              <div
                className={`absolute top-full left-0 pt-2 z-50 transition-all duration-200 ease-out ${
                  activeDropdown === 'collections'
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 translate-y-1.5 invisible pointer-events-none'
                }`}
              >
                <div className="w-56 bg-white shadow-xl rounded-xs py-2 border border-gray-100 ring-1 ring-black/5">
                  <button
                    onClick={() => {
                      navigateToCategory('Workleisure');
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left block px-4 py-2.5 text-xs font-satoshi-med text-[#141414] hover:bg-[#093624]/5 hover:text-[#093624] transition-colors cursor-pointer"
                  >
                    Summer Casuals 2026
                  </button>
                  <button
                    onClick={() => {
                      navigateToCategory('Smart Casual');
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left block px-4 py-2.5 text-xs font-satoshi-med text-[#141414] hover:bg-[#093624]/5 hover:text-[#093624] transition-colors cursor-pointer"
                  >
                    Executive Formal Wear
                  </button>
                  <button
                    onClick={() => {
                      navigateToCategory('Streetwear');
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left block px-4 py-2.5 text-xs font-satoshi-med text-[#141414] hover:bg-[#093624]/5 hover:text-[#093624] transition-colors cursor-pointer"
                  >
                    Urban Streetwear Essentials
                  </button>
                  <button
                    onClick={() => {
                      navigateToCategory('Knitwear');
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left block px-4 py-2.5 text-xs font-satoshi-med text-[#141414] hover:bg-[#093624]/5 hover:text-[#093624] transition-colors cursor-pointer"
                  >
                    Exclusive Dhaka Editions
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Sale */}
            <Link
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory('sale');
              }}
              className={`text-[15px] font-bold transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                activeCategoryFilter === 'sale'
                  ? 'text-red-700'
                  : 'text-red-600 hover:text-red-700'
              }`}
            >
              <span>Sale</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded-2xs">
                HOT
              </span>
            </Link>
          </nav>

          {/* Right Action Icons:
              1st: Search
              2nd: Profile (Account)
              3rd: Wishlist (with saved count, opens Wishlist drawer)
              4th: Cart bag (with count and total BDT amount)
          */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* 1st: Search Trigger */}
            <button
              onClick={openSearch}
              aria-label="Search store"
              className="p-2 text-[#141414] hover:text-[#093624] hover:scale-105 transition-all cursor-pointer rounded-full hover:bg-gray-100/80"
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* 2nd: Profile / Account Trigger (Desktop Only, accessible in hamburger menu on mobile) */}
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="User account"
              className="hidden lg:flex p-2 text-[#141414] hover:text-[#093624] hover:scale-105 transition-all cursor-pointer rounded-full hover:bg-gray-100/80"
              title="Customer Dashboard"
            >
              <User size={20} />
            </button>

            {/* 3rd: Wishlist Button (Desktop Only, accessible in hamburger menu on mobile) */}
            <button
              onClick={openWishlist}
              aria-label="Saved wishlist"
              className="hidden lg:flex relative p-2 text-[#141414] hover:text-[#093624] hover:scale-105 transition-all cursor-pointer rounded-full hover:bg-gray-100/80"
              title="My Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#093624] text-[#F9F295] text-[10px] font-bold rounded-full flex items-center justify-center font-satoshi-bold shadow-xs tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 4th: Cartmini Button with Bag Icon, Counter & BDT Total */}
            <button
              onClick={openCart}
              aria-label="Shopping bag"
              className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 sm:py-2 bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white rounded-xs transition-colors cursor-pointer shadow-xs active:scale-98"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#F9F295] text-[#093624] text-[9px] font-bold rounded-full flex items-center justify-center font-satoshi-bold tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-white tracking-wider font-satoshi-bold tabular-nums">
                {formatPrice(cartTotal)}
              </span>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};
