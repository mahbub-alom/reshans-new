import React, { useState } from 'react';
import { TESTIMONIALS } from '../../data/products';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="max-w-4xl mx-auto relative px-6 sm:px-16"
        >
          {/* Navigation Arrows */}
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

          {/* Testimonial Card */}
          <div className="text-center flex flex-col items-center">
            {/* Quote Icon */}
            <div className="w-14 h-14 rounded-full bg-[#F9F295]/50 text-[#093624] flex items-center justify-center mb-6">
              <Quote size={28} className="fill-[#093624]/20 text-[#093624]" />
            </div>

            {/* Star Ratings */}
            <div className="flex text-[#093624] gap-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#093624]" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-2xl font-medium text-[#141414] leading-relaxed mb-8 max-w-2xl text-balance font-satoshi-med">
              {current.quote}
            </blockquote>

            {/* Author Info */}
            <div className="flex flex-col items-center">
              <h4 className="text-base font-bold text-[#093624] font-satoshi-bold">
                {current.name}
              </h4>
              <span className="text-xs text-[#7A7A7A] uppercase tracking-wider font-semibold mt-0.5 font-satoshi">
                {current.role}
              </span>
            </div>

            {/* Carousel Dots */}
            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#093624]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
