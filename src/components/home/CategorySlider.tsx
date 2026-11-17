'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { useShop } from '../../context/ShopContext';

const ORIGINAL_SLIDES = [
  {
    id: 'cat-1',
    title: 'Tops & Shirts',
    categoryFilter: 'Tops',
    image: '/assets/img/fashion-2/category/cat-1.jpg',
  },
  {
    id: 'cat-2',
    title: 'Tops Collection',
    categoryFilter: 'Tops',
    image: '/assets/img/fashion-2/category/cat-2.jpg',
  },
  {
    id: 'cat-3',
    title: 'Casual & Dress',
    categoryFilter: 'Dress',
    image: '/assets/img/fashion-2/category/cat-3.jpg',
  },
  {
    id: 'cat-4',
    title: 'Fashion Tees',
    categoryFilter: 'T-Shirts',
    image: '/assets/img/fashion-2/category/cat-4.jpg',
  },
  {
    id: 'cat-5',
    title: 'Stylish Shirts',
    categoryFilter: 'Tops',
    image: '/assets/img/fashion-2/category/cat-5.jpg',
  },
  {
    id: 'cat-6',
    title: 'Women’s Tops',
    categoryFilter: 'Tops',
    image: '/assets/img/fashion-2/category/cat-4.jpg',
  },
];

// Duplicate slides to allow completely seamless infinite coverflow rotation without hitching
const CATEGORY_SLIDES = [...ORIGINAL_SLIDES, ...ORIGINAL_SLIDES];

export const CategorySlider: React.FC = () => {
  const { navigateToCategory } = useShop();
  return (
    <div id="categories" className="py-10 sm:py-14 bg-white overflow-hidden">
      {/* 100% Accurate Swiper 3D Coverflow matching Reference Website aqf-category-2-area */}
      <div className="w-full">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          speed={600}
          watchSlidesProgress={true}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          breakpoints={{
            1400: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 2,
            },
            576: {
              slidesPerView: 2,
            },
            0: {
              slidesPerView: 1,
            },
          }}
          className="!py-6"
        >
          {CATEGORY_SLIDES.map((item, idx) => (
            <SwiperSlide key={`${item.id}-${idx}`}>
              <div
                onClick={() => navigateToCategory(item.categoryFilter)}
                className="group relative w-full h-[460px] sm:h-[540px] md:h-[600px] overflow-hidden shadow-[0_0_20px_rgba(20,20,20,0.14)] select-none cursor-pointer"
              >
                {/* Image Container with Zoom on Hover */}
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-900 pointer-events-none"
                  />
                </div>

                {/* Constant Overlay matching .aqf-category-2-overlay::after rgba(0,0,0,0.24) */}
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                {/* Content at Bottom matching .aqf-category-2-content: title + blur button */}
                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 flex flex-col items-center justify-end text-center z-10">
                  <h4 className="text-2xl sm:text-[38px] font-bold text-white font-satoshi-bold mb-4 drop-shadow-sm leading-tight">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToCategory(item.categoryFilter);
                      }}
                      className="hover:text-[#F9F295] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </button>
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToCategory(item.categoryFilter);
                    }}
                    className="inline-block border border-white/50 bg-black/10 hover:bg-white hover:text-[#141414] hover:border-white text-white backdrop-blur-[7px] text-xs font-bold uppercase tracking-wider py-3.5 px-8 transition-all duration-300 font-satoshi-bold cursor-pointer"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
