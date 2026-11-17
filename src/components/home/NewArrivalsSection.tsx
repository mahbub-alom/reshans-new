import React, { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../lib/utils';

const ARRIVAL_SETS = [
  {
    id: 1,
    lookbookImg: '/assets/img/fashion-2/arrival-product/nav-img-1.jpg',
    lookbookTitle: 'Summer Street Look Dhaka',
    products: [
      {
        id: 'arr-1-1',
        name: 'Women Fashion Tops',
        price: 3250,
        originalPrice: 3800,
        badge: '-15%',
        image: '/assets/img/fashion-2/arrival-product/nav-img-1-1.jpg',
        rating: 5,
      },
      {
        id: 'arr-1-2',
        name: 'Slim-Fit Crew in Cozy Waffle',
        price: 3850,
        originalPrice: 4200,
        badge: 'SALE',
        image: '/assets/img/fashion-2/arrival-product/nav-img-1-2.jpg',
        rating: 5,
      },
    ],
  },
  {
    id: 2,
    lookbookImg: '/assets/img/fashion-2/arrival-product/nav-img-2.jpg',
    lookbookTitle: 'Executive Formal Collection',
    products: [
      {
        id: 'arr-2-1',
        name: 'Tops Collection Premium',
        price: 2950,
        originalPrice: 3500,
        badge: 'HOT',
        image: '/assets/img/fashion-2/arrival-product/nav-img-2-1.jpg',
        rating: 5,
      },
      {
        id: 'arr-2-2',
        name: 'Casual & Dress Outerwear',
        price: 4150,
        originalPrice: 4800,
        badge: '-18%',
        image: '/assets/img/fashion-2/arrival-product/nav-img-2-2.jpg',
        rating: 5,
      },
    ],
  },
  {
    id: 3,
    lookbookImg: '/assets/img/fashion-2/arrival-product/nav-img-3.jpg',
    lookbookTitle: 'Urban Monochrome Look',
    products: [
      {
        id: 'arr-3-1',
        name: 'Classic Linen Button-down',
        price: 2650,
        originalPrice: 3100,
        badge: 'NEW',
        image: '/assets/img/fashion-2/arrival-product/nav-img-3-1.jpg',
        rating: 5,
      },
      {
        id: 'arr-3-2',
        name: 'Modern Dhaka Street Jacket',
        price: 3450,
        originalPrice: 3950,
        badge: '-12%',
        image: '/assets/img/fashion-2/arrival-product/nav-img-3-2.jpg',
        rating: 5,
      },
    ],
  },
  {
    id: 4,
    lookbookImg: '/assets/img/fashion-2/arrival-product/nav-img-4.jpg',
    lookbookTitle: 'Minimalist Resort Ensemble',
    products: [
      {
        id: 'arr-4-1',
        name: 'Ribbed Essential Tank',
        price: 2100,
        originalPrice: 2600,
        badge: 'SALE',
        image: '/assets/img/fashion-2/arrival-product/nav-img-4-1.jpg',
        rating: 5,
      },
      {
        id: 'arr-4-2',
        name: 'Tailored Wide-Leg Trouser',
        price: 3750,
        originalPrice: 4400,
        badge: 'HOT',
        image: '/assets/img/fashion-2/arrival-product/nav-img-4-2.jpg',
        rating: 5,
      },
    ],
  },
];

export const NewArrivalsSection: React.FC = () => {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, formatPrice, navigate } = useShop();
  
  // Dual Swiper instances controlled together in sync
  const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
  const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);

  const handlePrev = () => {
    secondSwiper?.slidePrev();
  };

  const handleNext = () => {
    secondSwiper?.slideNext();
  };

  return (
    <section id="arrivals" className="pt-20 sm:pt-28 pb-16 sm:pb-24 bg-white overflow-hidden">
      {/* Narrower container matching reference website proportions */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        {/* Split Layout: flush zero-gap row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 shadow-sm border border-[#E8E5E3] rounded-xs overflow-hidden">
          {/* Left Column: Synchronized Outfit Swiper (5 cols on desktop, hidden on small screens) */}
          <div className="lg:col-span-5 hidden lg:block bg-[#f1f0ee] relative overflow-hidden h-[620px]">
            <Swiper
              onSwiper={setFirstSwiper}
              controller={{ control: secondSwiper }}
              modules={[Controller]}
              loop={true}
              speed={900}
              allowTouchMove={true}
              className="h-full w-full"
            >
              {ARRIVAL_SETS.map((set) => (
                <SwiperSlide key={`lookbook-${set.id}`} className="h-full w-full">
                  <div className="relative h-full w-full select-none">
                    <img
                      src={set.lookbookImg}
                      alt={set.lookbookTitle}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 text-white z-10 pointer-events-none">
                      <span className="text-[#F9F295] text-xs font-bold uppercase tracking-widest font-satoshi-bold block mb-1">
                        Look {set.id}
                      </span>
                      <h4 className="text-xl font-bold font-satoshi-bold drop-shadow-xs">
                        {set.lookbookTitle}
                      </h4>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Column: Title Box, Synchronized Dual Products Carousel, Navigation, and Button (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative">
            {/* Title Box matching .aqf-arrivals-title-box */}
            <div className="relative text-center mb-8">
              <span className="text-xs font-medium uppercase tracking-widest text-[#6D6868] block mb-1 font-satoshi-med">
                New Arrivals
              </span>
              <h4 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#141414] font-satoshi-bold">
                Shop this look
              </h4>

              {/* Navigation Arrows positioned on the right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 z-10">
                <button
                  onClick={handlePrev}
                  aria-label="Previous look"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] hover:border-[#093624] transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next look"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] hover:border-[#093624] transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Synchronized 2-Product Swiper Carousel */}
            <div className="w-full">
              <Swiper
                onSwiper={setSecondSwiper}
                controller={{ control: firstSwiper }}
                modules={[Controller, Autoplay, Navigation]}
                loop={true}
                speed={900}
                allowTouchMove={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                className="w-full"
              >
                {ARRIVAL_SETS.map((set) => (
                  <SwiperSlide key={`prod-set-${set.id}`}>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 py-2">
                      {set.products.map((prod) => {
                        const inWishlist = isInWishlist(prod.id);
                        const prodUrl = `/product/${generateProductSlug(prod)}`;

                        return (
                          <div
                            key={prod.id}
                            className="group relative flex flex-col bg-white rounded-xs overflow-hidden border border-gray-100 p-2.5 sm:p-3 shadow-2xs hover:shadow-md transition-all duration-300"
                          >
                            {/* Product Image - only image click navigates to details */}
                            <Link
                              href={prodUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(prodUrl);
                              }}
                              className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-xs mb-3 cursor-pointer block"
                            >
                              {/* Badge */}
                              {prod.badge && (
                                <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 bg-[#093624] text-[#F9F295] rounded-xs font-satoshi-bold">
                                  {prod.badge}
                                </span>
                              )}

                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                              />

                              {/* Floating Actions on Hover */}
                              <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleWishlist(prod.id);
                                  }}
                                  aria-label="Wishlist"
                                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer ${
                                    inWishlist
                                      ? 'bg-[#093624] text-[#F9F295]'
                                      : 'bg-white text-[#141414] hover:bg-[#093624] hover:text-[#F9F295]'
                                  }`}
                                >
                                  <Heart size={14} className={inWishlist ? 'fill-[#F9F295]' : ''} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openQuickView({
                                      id: prod.id,
                                      name: prod.name,
                                      category: 'New Arrivals',
                                      price: prod.price,
                                      originalPrice: prod.originalPrice,
                                      badge: 'new',
                                      rating: prod.rating,
                                      reviewsCount: 16,
                                      frontImage: prod.image,
                                      backImage: prod.image,
                                      description: `${prod.name} - Exclusive Reshans collection look crafted from premium fabrics.`,
                                      sizes: ['S', 'M', 'L', 'XL'],
                                      colors: [{ name: 'Default', hex: '#093624' }],
                                      inStock: true,
                                      isNewArrival: true,
                                    });
                                  }}
                                  aria-label="Quick view"
                                  className="w-8 h-8 rounded-full bg-white text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center shadow-md transition-colors cursor-pointer"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart({
                                      id: prod.id,
                                      name: prod.name,
                                      category: 'New Arrivals',
                                      price: prod.price,
                                      originalPrice: prod.originalPrice,
                                      discount: prod.badge,
                                      rating: prod.rating,
                                      reviewsCount: 16,
                                      frontImage: prod.image,
                                      backImage: prod.image,
                                      description: `${prod.name} - Exclusive Reshans collection piece.`,
                                      sizes: ['S', 'M', 'L'],
                                      colors: [{ name: 'Default', hex: '#093624' }],
                                      inStock: true,
                                      isNewArrival: true,
                                    });
                                  }}
                                  aria-label="Add to cart"
                                  className="w-8 h-8 rounded-full bg-white text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center shadow-md transition-colors cursor-pointer"
                                >
                                  <ShoppingBag size={14} />
                                </button>
                              </div>
                            </Link>

                            {/* Details */}
                            <div className="text-center flex flex-col items-center">
                              {/* Rating Stars */}
                              <div className="flex items-center gap-0.5 mb-1.5 text-[#093624]">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={11} className="fill-[#093624] text-[#093624]" />
                                ))}
                              </div>

                              <Link
                                href={prodUrl}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(prodUrl);
                                }}
                                className="text-xs sm:text-sm font-semibold text-[#141414] line-clamp-1 font-satoshi-bold mb-1 group-hover:text-[#093624] transition-colors cursor-pointer block"
                              >
                                {prod.name}
                              </Link>

                              <div className="flex items-center gap-2">
                                {prod.originalPrice && (
                                  <span className="text-xs text-gray-400 line-through font-satoshi">
                                    {formatPrice(prod.originalPrice)}
                                  </span>
                                )}
                                <span className="text-xs sm:text-sm font-bold text-[#093624] font-satoshi-bold">
                                  {formatPrice(prod.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="flex sm:hidden justify-center items-center gap-3 mt-4">
              <button
                onClick={handlePrev}
                aria-label="Previous look"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] transition-colors shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next look"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] transition-colors shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Bottom Centered "Shop Now" Button matching Reference Site aqf-arrivals-btn */}
            <div className="text-center mt-6 sm:mt-8">
              <Link
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                }}
                className="inline-block border border-[#D5D2D0] hover:border-[#093624] hover:bg-[#093624] text-[#141414] hover:text-[#F9F295] font-satoshi-bold text-xs uppercase tracking-wider py-3.5 px-14 rounded-xs transition-colors shadow-xs cursor-pointer"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
