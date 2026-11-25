'use client';

import React, { useState, useMemo } from 'react';
import { TESTIMONIALS } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { ChevronLeft, ChevronRight, Star, Quote, ShieldCheck } from 'lucide-react';

interface DisplayReview {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  productName?: string;
}

export const TestimonialSection: React.FC = () => {
  const { reviews } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter approved and visible reviews from database / ShopContext
  const approvedReviews = useMemo<DisplayReview[]>(() => {
    const list = reviews.filter((r) => r.status === 'approved');
    if (list.length > 0) {
      return list.map((r) => ({
        id: r.id,
        name: r.customerName || 'Verified Buyer',
        role: r.productName ? `Reviewed: ${r.productName}` : 'Verified Buyer',
        quote: r.comment,
        rating: r.rating || 5,
        productName: r.productName,
      }));
    }
    // Fallback to initial curated testimonials if DB has no approved reviews yet
    return TESTIMONIALS.map((t, idx) => ({
      id: `fallback-${idx}`,
      name: t.name,
      role: t.role,
      quote: t.quote,
      rating: t.rating,
    }));
  }, [reviews]);

  const activeIndex = currentIndex >= approvedReviews.length ? 0 : currentIndex;
  const current = approvedReviews[activeIndex] || approvedReviews[0];

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? approvedReviews.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === approvedReviews.length - 1 ? 0 : prev + 1));
  };

  if (!current) return null;

  return (
    <section id="testimonials" className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="max-w-4xl mx-auto relative px-6 sm:px-16"
        >
          {/* Navigation Arrows */}
          {approvedReviews.length > 1 && (
            <>
              <div className="absolute top-1/2 -left-2 sm:left-0 -translate-y-1/2 z-10">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous review"
                  className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] hover:border-[#093624] shadow-xs transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div className="absolute top-1/2 -right-2 sm:right-0 -translate-y-1/2 z-10">
                <button
                  onClick={nextTestimonial}
                  aria-label="Next review"
                  className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] hover:border-[#093624] shadow-xs transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}

          {/* Testimonial Card */}
          <div className="text-center flex flex-col items-center">
            {/* Quote Icon */}
            <div className="w-14 h-14 rounded-full bg-[#F9F295]/50 text-[#093624] flex items-center justify-center mb-6">
              <Quote size={28} className="fill-[#093624]/20 text-[#093624]" />
            </div>

            {/* Star Ratings (Supports Half-Stars) */}
            <div className="flex items-center text-[#093624] gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const fillAmount = Math.max(0, Math.min(1, current.rating - (starIndex - 1)));
                return (
                  <div key={starIndex} className="relative inline-block w-4.5 h-4.5">
                    {/* Background empty star */}
                    <Star size={18} className="text-gray-300" />
                    {/* Filled foreground star with clip width */}
                    {fillAmount > 0 && (
                      <div
                        className="absolute top-0 left-0 overflow-hidden"
                        style={{ width: `${fillAmount * 100}%` }}
                      >
                        <Star size={18} className="fill-[#093624] text-[#093624]" />
                      </div>
                    )}
                  </div>
                );
              })}
              <span className="text-xs font-bold font-satoshi-bold text-[#093624] ml-1">
                {current.rating.toFixed(1)}
              </span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-2xl font-medium text-[#141414] leading-relaxed mb-8 max-w-2xl text-balance font-satoshi-med">
              "{current.quote}"
            </blockquote>

            {/* Author Info */}
            <div className="flex flex-col items-center">
              <h4 className="text-base font-bold text-[#093624] font-satoshi-bold flex items-center gap-1.5">
                <span>{current.name}</span>
                <span className="text-[#093624]" title="Verified Buyer">
                  <ShieldCheck size={16} />
                </span>
              </h4>
              <span className="text-xs text-[#7A7A7A] uppercase tracking-wider font-semibold mt-0.5 font-satoshi">
                {current.role}
              </span>
            </div>

            {/* Carousel Dots */}
            {approvedReviews.length > 1 && (
              <div className="flex gap-2 mt-8">
                {approvedReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeIndex === idx
                        ? 'w-6 bg-[#093624]'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
