import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, Tag } from 'lucide-react';

export const CartminiDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    formatPrice,
    navigate,
    proceedToCartCheckout,
    appliedCouponCode,
    applyCouponCode,
    removeCouponCode,
    calculateDiscount,
    orderNote,
    setOrderNote,
    settings,
  } = useShop();

  const [couponCode, setCouponCode] = useState(appliedCouponCode || '');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'note' | 'coupon' | null>(null);

  const freeShippingThreshold = settings.freeShippingThreshold || 2500;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));
  const discountAmount = calculateDiscount(cartTotal, appliedCouponCode);
  const netSubtotal = Math.max(0, cartTotal - discountAmount);

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-400 ${
        isCartOpen ? 'visible' : 'invisible delay-400 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-400 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header with animated close cross */}
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[#141414] flex items-center gap-2 font-satoshi-bold">
                  <ShoppingBag size={20} className="text-[#093624]" />
                  <span>Shopping Cart</span>
                </h3>
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="text-xs font-bold text-[#093624] underline underline-offset-4 hover:text-[#141414] cursor-pointer font-satoshi-bold"
                >
                  View Cart
                </button>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="group w-9 h-9 rounded-full bg-gray-100 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] transition-all duration-300 cursor-pointer shadow-xs"
              >
                <X size={18} className="transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Free Shipping Progress in BDT */}
            <div className="bg-[#F1EFEE] p-3 rounded-xs font-satoshi">
              <p className="text-xs text-[#141414] font-medium mb-2 flex items-center gap-1.5">
                <Truck size={14} className="text-[#093624]" />
                {freeShippingDiff === 0 ? (
                  <span className="text-[#093624] font-bold font-satoshi-bold">
                    Congratulations! You unlocked Free BD Shipping!
                  </span>
                ) : (
                  <span>
                    Buy <b className="text-[#093624] font-satoshi-bold tabular-nums">{formatPrice(freeShippingDiff)}</b> more to enjoy <b>Free Shipping</b>
                  </span>
                )}
              </p>
              <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#093624] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#F1EFEE] text-[#093624] flex items-center justify-center mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h4 className="text-base font-bold text-[#141414] mb-1 font-satoshi-bold">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#7A7A7A] mb-6 font-satoshi">
                  Explore our modern fashion catalog to discover exclusive Reshans apparel.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="bg-[#093624] text-[#F9F295] font-bold text-xs uppercase px-6 py-2.5 rounded-xs hover:bg-[#052216] transition-colors font-satoshi-bold cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 p-3 bg-gray-50/70 rounded-xs border border-gray-100"
                >
                  {/* Thumbnail */}
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      navigate(`/product/${item.product.id}`);
                    }}
                    className="w-20 h-24 rounded-xs overflow-hidden bg-white shrink-0 border border-gray-200 cursor-pointer"
                  >
                    <img
                      src={item.product.frontImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            closeCart();
                            navigate(`/product/${item.product.id}`);
                          }}
                          className="text-left text-xs sm:text-sm font-semibold text-[#141414] hover:text-[#093624] line-clamp-1 font-satoshi-bold cursor-pointer"
                        >
                          {item.product.name}
                        </button>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-gray-400 hover:text-[#093624] transition-colors p-1 cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#7A7A7A] mt-1 font-satoshi">
                        <span>Size: <b className="text-[#141414]">{item.selectedSize || 'M'}</b></span>
                        {item.selectedColor && (
                          <>
                            <span>·</span>
                            <span>Color: <b className="text-[#141414]">{item.selectedColor}</b></span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-300 rounded-xs bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#141414] font-satoshi-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price in BDT */}
                      <span className="text-sm font-bold text-[#093624] tabular-nums font-satoshi-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Tools, View Cart & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-gray-100 space-y-4">
              {/* Accordion tools for note & coupon */}
              <div className="flex items-center gap-3 text-xs text-[#093624] font-semibold border-b border-gray-100 pb-3 font-satoshi-bold">
                <button
                  onClick={() => setActiveTool(activeTool === 'coupon' ? null : 'coupon')}
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Tag size={13} />
                  <span>Promo Code</span>
                </button>
                <span>·</span>
                <button
                  onClick={() => setActiveTool(activeTool === 'note' ? null : 'note')}
                  className="hover:underline cursor-pointer"
                >
                  Delivery Note
                </button>
              </div>

              {activeTool === 'coupon' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter RESHANS20"
                      className="flex-1 text-xs border border-gray-300 px-3 py-2 rounded-xs focus:outline-none focus:border-[#093624] font-satoshi"
                    />
                    <button
                      onClick={() => {
                        const res = applyCouponCode(couponCode, cartTotal);
                        setCouponMsg(res.message);
                      }}
                      className="bg-[#093624] text-[#F9F295] text-xs font-bold px-3 py-2 rounded-xs font-satoshi-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && <p className="text-[11px] text-[#093624] font-satoshi-med">{couponMsg}</p>}
                </div>
              )}

              {activeTool === 'note' && (
                <div>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Add delivery instructions (e.g. Call before delivery, Dhaka address details)..."
                    rows={2}
                    className="w-full text-xs border border-gray-300 p-2 rounded-xs focus:outline-none focus:border-[#093624] font-satoshi"
                  />
                </div>
              )}

              {appliedCouponCode && discountAmount > 0 && (
                <div className="flex justify-between items-center text-xs text-[#093624] font-bold bg-[#F9F295]/50 border border-[#093624]/15 p-2 rounded-xs font-satoshi-bold">
                  <span>Coupon {appliedCouponCode} applied</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        removeCouponCode();
                        setCouponCode('');
                        setCouponMsg(null);
                      }}
                      className="text-[#141414] hover:text-[#093624] cursor-pointer"
                      aria-label="Remove coupon"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Subtotal in BDT */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#7A7A7A] font-satoshi-med">Subtotal</span>
                <span className="text-xl font-bold text-[#093624] tabular-nums font-satoshi-bold">
                  {formatPrice(netSubtotal)}
                </span>
              </div>

              <p className="text-[11px] text-[#888888] font-satoshi">
                Delivery charges (inside Dhaka ৳ 60, outside Dhaka ৳ 120) free if total exceeds ৳ 2,500.
              </p>

              {/* Action Buttons: View Cart & Proceed to Checkout */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="border border-[#093624] bg-white hover:bg-[#F1EFEE] text-[#093624] font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xs flex items-center justify-center transition-colors cursor-pointer font-satoshi-bold"
                >
                  View Cart
                </button>
                <button
                  type="button"
                  onClick={proceedToCartCheckout}
                  className="bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer font-satoshi-bold"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
