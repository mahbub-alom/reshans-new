'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
      setIsVisible(currentScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#093624] text-[#F9F295] hover:text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="rgba(249, 242, 149, 0.2)"
          strokeWidth="2.5"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="#F9F295"
          strokeWidth="2.5"
          strokeDasharray="113.1"
          strokeDashoffset={113.1 - (113.1 * scrollProgress) / 100}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      <ArrowUp size={18} />
    </button>
  );
};
