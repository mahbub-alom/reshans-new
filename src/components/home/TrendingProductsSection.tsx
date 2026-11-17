import React, { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../lib/utils';

interface TrendingCardItemProps {
  product: (typeof PRODUCTS)[0];
}

const TrendingCardItem: React.FC<TrendingCardItemProps> = ({ product }) => {
  const { addToCart, openQuickView, toggleWishlist, isInWishlist, formatPrice, navigate } = useShop();
  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]?.name || '');
  const inWishlist = isInWishlist(product.id);

  const productUrl = `/product/${generateProductSlug(product)}`;

  const activeColorObj = product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0];
  const activeColorIndex = product.colors ? product.colors.findIndex((c) => c.name === selectedColor) : 0;

  const resolvedFrontImage =
    activeColorObj?.image ||
    (activeColorIndex > 0 && product.frontImage.includes('/product-')
      ? product.frontImage.replace(/front-img-\d+\.jpg$/, `front-img-${(activeColorIndex % 3) + 1}.jpg`)
      : product.frontImage);

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(productUrl);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-xs transition-all duration-300">
      {/* Thumbnail Image with Hover Swap - click navigates to details */}
      <Link
        href={productUrl}
        onClick={handleProductClick}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-xs cursor-pointer block"
      >
        {/* Discount Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded-xs font-satoshi-bold shadow-xs ${
              product.badge === 'sale'
                ? 'bg-[#F9F295] text-[#093624]'
                : 'bg-[#093624] text-[#F9F295]'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Main Image */}
        <img
          key={resolvedFrontImage}
          src={resolvedFrontImage}
          alt={`${product.name} - ${selectedColor}`}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
        />

        {/* Secondary Image for Hover Swap */}
        {product.backImage && (
          <img
            src={product.backImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Floating Action Buttons */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer ${
              inWishlist
                ? 'bg-[#093624] text-[#F9F295]'
                : 'bg-white text-[#141414] hover:bg-[#093624] hover:text-[#F9F295]'
            }`}
          >
            <Heart size={16} className={inWishlist ? 'fill-[#F9F295]' : ''} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            aria-label="Quick preview"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#093624] text-[#141414] hover:text-[#F9F295] flex items-center justify-center transition-colors shadow-md cursor-pointer"
            title="Quick view"
          >
            <Eye size={16} />
          </button>

          {/* Quick Add To Bag Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1, selectedColor);
            }}
            aria-label="Add to cart"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#093624] text-[#141414] hover:text-[#F9F295] flex items-center justify-center transition-colors shadow-md cursor-pointer"
            title="Add to shopping bag"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="pt-4 pb-3 flex flex-col text-center items-center">
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-1.5 text-[#093624]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? 'fill-[#093624]' : 'text-gray-300'}
            />
          ))}
        </div>

        {/* Product Name */}
        <Link
          href={productUrl}
          onClick={handleProductClick}
          className="text-sm sm:text-base font-semibold text-[#141414] hover:text-[#093624] transition-colors cursor-pointer line-clamp-1 font-satoshi-bold mb-1 block"
        >
          {product.name}
        </Link>

        {/* Price in BDT */}
        <div className="flex items-center justify-center gap-2">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through tabular-nums font-satoshi">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-[#093624] tabular-nums font-satoshi-bold">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-2.5 py-1">
            {product.colors.map((c, idx) => (
              <div key={idx} className="relative group/swatch flex items-center justify-center">
                {/* Hover Tooltip showing color name */}
                <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover/swatch:flex flex-col items-center pointer-events-none z-20 whitespace-nowrap">
                  <span className="bg-[#141414] text-white text-[10px] font-medium py-0.5 px-1.5 rounded shadow-md font-satoshi">
                    {c.name}
                  </span>
                  <span className="w-1.5 h-1.5 bg-[#141414] rotate-45 -mt-0.5"></span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  onMouseEnter={() => {
                    setSelectedColor(c.name);
                  }}
                  aria-label={c.name}
                  className={`w-4 h-4 rounded-full border transition-all duration-150 cursor-pointer ${
                    selectedColor === c.name
                      ? 'ring-2 ring-[#093624] ring-offset-1 scale-110 shadow-xs'
                      : 'border-gray-300 opacity-80 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const TrendingProductsSection: React.FC = () => {
  const { products } = useShop();
  const swiperRef = useRef<SwiperType | null>(null);

  // Trending products selection
  const trendingProducts = (products && products.length ? products : PRODUCTS).slice(0, 8);

  return (
    <section id="trending" className="pt-20 pb-16 bg-white overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Centered without category tabs as requested) */}
        <div
          data-aos="fade-up"
          data-aos-duration="700"
          className="text-center max-w-xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#141414] font-satoshi-bold mb-3">
            Trending Product
          </h2>
          <p className="text-sm text-[#7A7A7A] font-satoshi leading-relaxed">
            Here’s some of our most new arrivals products that people <br className="hidden sm:inline" /> are in love with.
          </p>
        </div>

        {/* Carousel Wrapper with Left / Right Navigation Controls */}
        <div className="relative group/slider px-2 sm:px-6">
          {/* Left Arrow Button */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous products"
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next products"
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#141414] hover:bg-[#093624] hover:text-[#F9F295] transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105"
          >
            <ChevronRight size={20} />
          </button>

          {/* Swiper Slider: 4 on desktop, 3 on laptop, 2 on tablet, 1 on mobile */}
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              1400: {
                slidesPerView: 4,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
            }}
            className="!pb-6 !overflow-visible"
          >
            {trendingProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <TrendingCardItem product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
