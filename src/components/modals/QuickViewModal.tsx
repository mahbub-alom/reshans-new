import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, ShoppingBag, Heart, Check, Plus, Minus } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist, formatPrice } = useShop();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.frontImage);
      setSelectedSize(quickViewProduct.sizes[0] || 'M');
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Default');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const images = [quickViewProduct.frontImage];
  if (quickViewProduct.backImage) {
    images.push(quickViewProduct.backImage);
  }

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xs max-w-4xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-gray-100 max-h-[90vh] overflow-y-auto font-satoshi transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Animated Close Button on Hover */}
        <button
          onClick={closeQuickView}
          aria-label="Close modal"
          className="group absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] transition-all duration-300 cursor-pointer shadow-xs"
        >
          <X size={18} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="aspect-[3/4] bg-[#F7F7F7] rounded-xs overflow-hidden relative border border-gray-100">
              <img
                src={selectedImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-top"
              />
              {quickViewProduct.discount && (
                <span className="absolute top-3 left-3 bg-[#093624] text-[#F9F295] text-xs font-bold px-2 py-0.5 rounded-xs font-satoshi-bold">
                  {quickViewProduct.discount}
                </span>
              )}
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-xs overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === img
                        ? 'border-[#093624] shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchasing Controls (6 cols) */}
          <div className="md:col-span-6 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7A7A] mb-1 font-satoshi-med">
              {quickViewProduct.category}
            </span>

            <h3 className="text-2xl font-bold text-[#141414] mb-2 font-satoshi-bold">
              {quickViewProduct.name}
            </h3>

            {/* Star Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#093624]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < quickViewProduct.rating ? 'fill-[#093624]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-[#7A7A7A]">
                ({quickViewProduct.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Price in BDT */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl font-bold text-[#093624] tabular-nums font-satoshi-bold">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-base text-[#A2A3A3] line-through tabular-nums font-satoshi">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#55585B] leading-relaxed mb-6 font-satoshi">
              {quickViewProduct.description}
            </p>

            {/* Color Selector */}
            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="mb-5">
                <label className="text-xs font-bold text-[#141414] uppercase tracking-wider block mb-2 font-satoshi-bold">
                  Color: <span className="font-normal text-gray-600 font-satoshi">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.image) {
                          setSelectedImage(c.image);
                        }
                      }}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === c.name
                          ? 'border-[#093624] scale-110 shadow-xs'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor === c.name && (
                        <Check size={12} className={c.hex === '#FFFFFF' || c.hex === '#F9F295' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="mb-6">
                <label className="text-xs font-bold text-[#141414] uppercase tracking-wider block mb-2 font-satoshi-bold">
                  Size: <span className="font-normal text-gray-600 font-satoshi">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 px-3 py-1.5 text-xs font-bold rounded-xs border transition-all cursor-pointer font-satoshi-bold ${
                        selectedSize === s
                          ? 'bg-[#093624] text-[#F9F295] border-[#093624]'
                          : 'bg-white text-[#141414] border-gray-300 hover:border-[#093624]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart & Wishlist */}
            <div className="flex items-center gap-3 pt-2 mb-6">
              <div className="flex items-center border border-gray-300 rounded-xs bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#141414] font-satoshi-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer font-satoshi-bold"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-label="Toggle Wishlist"
                className={`w-11 h-11 rounded-xs border flex items-center justify-center transition-colors cursor-pointer ${
                  inWishlist
                    ? 'border-[#093624] bg-[#093624] text-[#F9F295]'
                    : 'border-gray-300 hover:border-[#093624] text-[#141414]'
                }`}
              >
                <Heart size={18} className={inWishlist ? 'fill-[#F9F295]' : ''} />
              </button>
            </div>

            {/* Metadata Footer */}
            <div className="border-t border-gray-100 pt-4 text-xs text-[#7A7A7A] space-y-1 font-satoshi">
              <p>SKU: <span className="text-[#141414] font-medium font-mono">RS-00{quickViewProduct.id.replace('prod-', '')}</span></p>
              <p>Brand: <span className="text-[#093624] font-bold font-satoshi-bold">Reshans</span></p>
              <p>Categories: <span className="text-[#141414] font-medium">{quickViewProduct.category}, Luxury Apparel</span></p>
              <p>Payment: <span className="text-[#141414] font-medium">Cash on Delivery, bKash, Nagad, Visa, MasterCard</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
