import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { generateProductSlug } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showCategory = true }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView, formatPrice, navigate } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const inWishlist = isInWishlist(product.id);

  const productUrl = `/product/${generateProductSlug(product)}`;

  // Active color option and dynamic image resolution based on selected/hovered color
  const activeColorObj = product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0];
  const activeColorIndex = product.colors ? product.colors.findIndex((c) => c.name === selectedColor) : 0;
  
  // Resolve image for the variant: if color has image, use it; otherwise generate standard variant fallback
  const resolvedFrontImage =
    activeColorObj?.image ||
    (activeColorIndex > 0 && product.frontImage.includes('/product-')
      ? product.frontImage.replace(/front-img-\d+\.jpg$/, `front-img-${(activeColorIndex % 3) + 1}.jpg`)
      : product.frontImage);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(productUrl);
  };

  return (
    <div
      className="group relative flex flex-col font-satoshi"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame - only image is clickable to product details */}
      <Link
        href={productUrl}
        onClick={handleImageClick}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] rounded-sm cursor-pointer block"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.discount && (
            <span className="bg-[#093624] text-[#F9F295] text-[11px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase font-satoshi-bold">
              {product.discount}
            </span>
          )}
          {product.badge === 'hot' && !product.discount && (
            <span className="bg-[#093624] text-[#F9F295] text-[11px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase font-satoshi-bold">
              HOT
            </span>
          )}
          {product.badge === 'new' && (
            <span className="bg-[#141414] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase font-satoshi-bold">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
            inWishlist
              ? 'bg-[#093624] text-[#F9F295]'
              : 'bg-white text-[#141414] opacity-0 group-hover:opacity-100 hover:bg-[#093624] hover:text-white'
          }`}
        >
          <Heart size={16} className={inWishlist ? 'fill-[#F9F295]' : ''} />
        </button>

        {/* Front & Back Image Swap on Hover with Smooth Zoom */}
        <div className="relative w-full h-full overflow-hidden cursor-pointer">
          <img
            key={resolvedFrontImage}
            src={resolvedFrontImage}
            alt={`${product.name} - ${selectedColor}`}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered && product.backImage
                ? 'opacity-0 scale-100 pointer-events-none'
                : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />
          {product.backImage && (
            <img
              src={product.backImage}
              alt={`${product.name} back view`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                isHovered
                  ? 'opacity-100 scale-108'
                  : 'opacity-0 scale-100 pointer-events-none'
              }`}
              loading="lazy"
            />
          )}
        </div>

        {/* Quick Action Floating Bar on Hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1, selectedColor);
            }}
            className="flex-1 bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer font-satoshi-bold uppercase tracking-wider"
          >
            <ShoppingBag size={14} />
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            aria-label="Quick View"
            className="group/qv w-10 bg-white hover:bg-[#141414] text-[#141414] hover:text-white rounded-xs flex items-center justify-center shadow-md transition-colors cursor-pointer"
          >
            <Eye size={16} className="group-hover/qv:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-3 pb-2 flex flex-col font-satoshi">
        {showCategory && (
          <span className="text-[12px] font-medium text-[#7A7A7A] tracking-wider uppercase mb-1 font-satoshi-med">
            {product.category}
          </span>
        )}

        <Link
          href={productUrl}
          onClick={handleImageClick}
          className="text-[15px] font-bold text-[#141414] group-hover:text-[#093624] transition-colors cursor-pointer line-clamp-1 mb-1.5 font-satoshi-bold block"
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex text-[#093624]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < product.rating ? 'fill-[#093624]' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#888888] font-satoshi">({product.reviewsCount})</span>
        </div>

        {/* Price in BDT & Color Swatches */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-baseline gap-2 font-satoshi-bold">
            <span className="text-[16px] font-bold text-[#093624] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[13px] text-[#A2A3A3] line-through tabular-nums font-satoshi">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color dots with hover/selected tooltip and larger swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="relative flex items-center gap-1.5 py-1">
              {product.colors.map((c) => (
                <div key={c.name} className="relative group/color flex items-center justify-center">
                  {/* Floating tooltip above the color on hover */}
                  <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover/color:flex flex-col items-center pointer-events-none z-20 whitespace-nowrap">
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
                        : 'border-black/20 opacity-80 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
