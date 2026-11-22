import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '../common/BrandLogo';
import { useShop } from '../../context/ShopContext';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openWishlist, openAuth, openCart, navigate, settings } = useShop();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const displayEmail = settings.email || 'Reshans@gmail.com';
  const displayPhone = settings.phone || '+880 1977 378 642';
  const telLink = displayPhone.replace(/[^0-9+]/g, '');
  const displayAddress = settings.address || '73/A, Gulshan 2, Dhaka 1212, Bangladesh';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer id="footer" className="bg-[#F1EFEE] text-[#141414] pt-20 sm:pt-24 select-none font-satoshi">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5-Column Widget Grid matching Reference Site 100% */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-10 pb-16 lg:pb-20">
          {/* Column 1: Brand Info & Contacts (lg:col-span-3) */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <BrandLogo />
            </div>

            <div className="space-y-4 text-[15px] text-[#6D6868] font-satoshi leading-relaxed">
              {/* Email */}
              <div className="flex items-center gap-3">
                <span className="text-[#141414] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path
                      d="M0.75 4.75C0.75 1.95 2.35 0.75 4.75 0.75H12.75C15.15 0.75 16.75 1.95 16.75 4.75V10.35C16.75 13.15 15.15 14.35 12.75 14.35H4.75M12.75 5.15028L10.246 7.15003C9.422 7.80596 8.07 7.80596 7.246 7.15003L4.75 5.15028M0.75 11.1503H5.55M0.75 7.94945H3.15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <a href={`mailto:${displayEmail}`} className="hover:text-[#093624] transition-colors">
                  {displayEmail}
                </a>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <span className="text-[#141414] shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
                    <path
                      d="M8.25099 10.6922C9.74975 10.6922 10.9647 9.47717 10.9647 7.9784C10.9647 6.47964 9.74975 5.26465 8.25099 5.26465C6.75222 5.26465 5.53723 6.47964 5.53723 7.9784C5.53723 9.47717 6.75222 10.6922 8.25099 10.6922Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M0.962124 6.39496C2.67562 -1.13745 13.8351 -1.12875 15.5399 6.40366C16.5401 10.8222 13.7916 14.5623 11.3822 16.876C9.63396 18.5634 6.86802 18.5634 5.11104 16.876C2.71041 14.5623 -0.0381381 10.8135 0.962124 6.39496Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span>
                  {displayAddress}
                </span>
              </div>

              {/* Telephone matching bold fs-bold */}
              <div className="pt-1">
                <a
                  href={`tel:${telLink}`}
                  className="text-[22px] font-bold text-[#141414] hover:text-[#093624] font-satoshi-bold transition-colors block"
                >
                  {displayPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Shopping (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="text-[20px] font-bold text-[#141414] font-satoshi-bold mb-4 sm:mb-5">
              Shopping
            </h4>
            <ul className="space-y-1.5 text-[15px] sm:text-[16px] text-[#6D6868] font-satoshi">
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <button onClick={openWishlist} className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer">
                  Wishlist
                </button>
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <Link
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/shop');
                  }}
                  className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer"
                >
                  Shop by Brand
                </Link>
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <Link
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/shop');
                  }}
                  className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer"
                >
                  Offers
                </Link>
              </li>
          
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <button onClick={() => navigate('/about')} className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer">
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Information (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="text-[20px] font-bold text-[#141414] font-satoshi-bold mb-4 sm:mb-5">
              Infomation
            </h4>
            <ul className="space-y-1.5 text-[15px] sm:text-[16px] text-[#6D6868] font-satoshi">
            
          
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer font-medium"
                >
                  About us
                </button>
              </li>
              {/* 1/ Contact us placed directly under About us */}
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer font-medium"
                >
                  Contact us
                </button>
              </li>
              {/* 4/ Privacy & Policy link */}
              <li className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-[#6D6868] mr-2.5 inline-block shrink-0" />
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-[#093624] transition-colors leading-[34px] cursor-pointer"
                >
                  Privacy & Policy
                </button>
              </li>
            
            </ul>
          </div>

          {/* Column 5: Subscribe & Social (lg:col-span-3) */}
          <div className="lg:col-span-4">
            <h4 className="text-[20px] font-bold text-[#141414] font-satoshi-bold mb-3">
              Subscribe.
            </h4>
            <p className="text-[15px] text-[#6D6868] mb-3 font-satoshi leading-relaxed">
              Our conversation is just getting started
            </p>

            {/* Newsletter Input matching .aq-footer-widget-input */}
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  required
                  className="h-[56px] w-full bg-white border border-[#E0DCD9] pl-5 pr-36 text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624] font-satoshi rounded-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-[48px] px-6 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] text-xs font-bold uppercase tracking-wider font-satoshi-bold transition-colors cursor-pointer rounded-none"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <p className="text-xs text-[#093624] font-bold mt-2 font-satoshi-bold">
                  Thank you for subscribing to Reshans!
                </p>
              )}
            </form>

            {/* Social Icons matching .aq-footer-widget-social */}
           <div>
  <h5 className="text-[15px] font-bold text-[#141414] font-satoshi-bold mb-3">
    Follow Us On
  </h5>
  <div className="flex items-center gap-2">
    {/* Facebook */}
    {settings.facebook && (
      <a
        href={settings.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className="w-[38px] h-[38px] bg-white text-[#141414] hover:text-white hover:bg-[#093624] shadow-[0_1px_4px_rgba(20,20,20,0.1)] flex items-center justify-center transition-all duration-300 rounded-none cursor-pointer"
      >
        <Facebook className="w-4 h-4" />
      </a>
    )}

    {/* Instagram */}
    {settings.instagram && (
      <a
        href={settings.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="w-[38px] h-[38px] bg-white text-[#141414] hover:text-white hover:bg-[#093624] shadow-[0_1px_4px_rgba(20,20,20,0.1)] flex items-center justify-center transition-all duration-300 rounded-none cursor-pointer"
      >
        <Instagram className="w-4 h-4" />
      </a>
    )}

    {/* TikTok */}
    {settings.tiktok && (
      <a
        href={settings.tiktok}
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
        title="Follow us on TikTok"
        className="w-[38px] h-[38px] bg-white text-[#141414] hover:text-white hover:bg-[#093624] shadow-[0_1px_4px_rgba(20,20,20,0.1)] flex items-center justify-center transition-all duration-300 rounded-none cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-4 h-4"
        >
          <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
        </svg>
      </a>
    )}

    {/* YouTube */}
    {settings.youtube && (
      <a
        href={settings.youtube}
        target="_blank"
        rel="noreferrer"
        aria-label="YouTube"
        className="w-[38px] h-[38px] bg-white text-[#141414] hover:text-white hover:bg-[#093624] shadow-[0_1px_4px_rgba(20,20,20,0.1)] flex items-center justify-center transition-all duration-300 rounded-none cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-4 h-4"
        >
          <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v5.582l4.88-2.791L6.4 5.209z"/>
        </svg>
      </a>
    )}
  </div>
</div>
          </div>
        </div>

        {/* Bottom Copyright Area with Payment Gateway Badge Image */}
        <div className="border-t border-[#E0DCD9] py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-[#6D6868] font-satoshi mb-0 text-center sm:text-left">
              All rights reserved — {new Date().getFullYear()} &copy; <span className="font-bold text-[#141414] font-satoshi-bold">Reshans</span>
            </p>
            {/* <div className="shrink-0 flex items-center justify-center">
              <img
                src="/assets/img/payment/payment.png"
                alt="Supported Payment Gateways"
                className="h-6 sm:h-7 object-contain"
              />
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
