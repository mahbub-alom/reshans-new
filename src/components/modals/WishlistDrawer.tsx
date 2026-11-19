import React from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { X, Heart, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    closeWishlist,
    wishlist,
    toggleWishlist,
    moveToCart,
    clearWishlist,
    formatPrice,
    openCart,
    products,
    navigate,
  } = useShop();

  const sourceProducts = products && products.length ? products : PRODUCTS;
  const wishlistProducts = sourceProducts.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      moveToCart(product.id);
    });
    closeWishlist();
    openCart();
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-400 ${
        isWishlistOpen ? 'visible' : 'invisible delay-400 pointer-events-none'
      }`}
    >
      {/* Backdrop with smooth fade */}
      <div
        onClick={closeWishlist}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-400 ease-out ${
          isWishlistOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel: Smooth slide-in from right */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#093624]/10 flex items-center justify-center text-[#093624]">
                <Heart size={18} className="fill-[#093624]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#141414] font-satoshi-bold">
                  My Wishlist
                </h3>
                <p className="text-xs text-[#7A7A7A] font-satoshi">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            <button
              onClick={closeWishlist}
              aria-label="Close wishlist"
              className="group w-9 h-9 rounded-full bg-gray-100 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] transition-all duration-300 cursor-pointer shadow-xs"
            >
              <X size={18} className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <Heart size={36} />
                </div>
                <h4 className="text-base font-bold text-[#141414] mb-1 font-satoshi-bold">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-[#7A7A7A] max-w-xs mb-6 font-satoshi">
                  Tap the heart icon on any outfit or apparel to save your favorite styles here.
                </p>
                <button
                  onClick={closeWishlist}
                  className="bg-[#093624] text-[#F9F295] font-bold text-xs uppercase px-6 py-3 rounded-xs hover:bg-[#052216] transition-colors font-satoshi-bold shadow-xs cursor-pointer"
                >
                  Explore Trending Apparel
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 bg-gray-50/80 rounded-xs border border-gray-100 relative group transition-colors hover:bg-gray-50"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      closeWishlist();
                      navigate(`/product/${product.id}`);
                    }}
                    className="w-20 h-24 rounded-xs overflow-hidden bg-white shrink-0 border border-gray-200 cursor-pointer"
                  >
                    <img
                      src={product.frontImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#093624] tracking-wider font-satoshi-bold">
                            {product.category}
                          </span>
                          <h4
                            onClick={() => {
                              closeWishlist();
                              navigate(`/product/${product.id}`);
                            }}
                            className="text-xs sm:text-sm font-semibold text-[#141414] line-clamp-1 font-satoshi-bold mt-0.5 cursor-pointer hover:text-[#093624]"
                          >
                            {product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-gray-400 hover:text-[#093624] transition-colors p-1 cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#093624] bg-[#F9F295]/70 px-2 py-0.5 rounded-xs font-satoshi-bold">
                          <Check size={10} /> In Stock
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60">
                      {/* Price in BDT */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#093624] tabular-nums font-satoshi-bold">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through tabular-nums font-satoshi">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => moveToCart(product.id)}
                        className="inline-flex items-center gap-1.5 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xs transition-colors font-satoshi-bold cursor-pointer shadow-xs active:scale-95"
                      >
                        <ShoppingBag size={12} />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Batch Actions */}
          {wishlistProducts.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-gray-100 space-y-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer font-satoshi-bold"
              >
                <span>Add All to Shopping Bag</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={clearWishlist}
                className="w-full text-center text-xs text-gray-500 hover:text-[#141414] py-1 font-satoshi-med cursor-pointer transition-colors"
              >
                Clear Entire Wishlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
