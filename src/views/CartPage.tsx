import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  X,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const [couponInput, setCouponInput] = useState(appliedCouponCode || '');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const freeShippingThreshold = settings.freeShippingThreshold || 2500;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));

  const discountAmount = calculateDiscount(cartTotal, appliedCouponCode);
  const estimatedShipping =
    cartTotal === 0 || cartTotal >= freeShippingThreshold
      ? 0
      : settings.shippingInsideDhaka || 60;
  const estimatedTotal = Math.max(0, cartTotal - discountAmount + estimatedShipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCouponCode(couponInput, cartTotal);
    setCouponFeedback({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
  };

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* Breadcrumb Banner */}
      <div className="bg-[#F9F9F9] py-10 sm:py-12 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#55585B] font-satoshi-med mb-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-[#141414] font-satoshi-bold">Shopping Cart</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-satoshi-bold text-[#141414] tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-xs sm:text-sm text-[#6D6868] mt-1">
                Review your selected items, adjust quantities, or proceed to checkout.
              </p>
            </div>
            {cart.length > 0 && (
              <span className="text-xs font-satoshi-bold text-[#093624] bg-[#F9F295]/50 border border-[#093624]/15 px-3 py-1.5 rounded-xs w-fit tabular-nums">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Bag
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Cart Content */}
      <div className="py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-16 px-6 bg-[#F9F9F9] border border-gray-200/80 rounded-xs">
              <div className="w-16 h-16 rounded-full bg-[#093624]/10 text-[#093624] mx-auto flex items-center justify-center mb-5">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-satoshi-bold text-[#141414] mb-2">
                Your shopping cart is empty
              </h2>
              <p className="text-xs sm:text-sm text-[#6D6868] mb-7 leading-relaxed">
                Looks like you haven’t added any garments to your bag yet. Explore our latest Dhaka collections and curated essentials.
              </p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-2 bg-[#093624] hover:bg-[#052216] text-[#F9F295] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
              >
                <span>Browse Collection</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column: Free Shipping Progress + Cart Items Table */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Progress */}
                <div className="bg-[#F1EFEE] p-4 sm:p-5 rounded-xs border border-[#E8E5E3]">
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-[#141414] font-satoshi-med mb-2.5">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-[#093624] shrink-0" />
                      {freeShippingDiff === 0 ? (
                        <span className="text-[#093624] font-bold font-satoshi-bold">
                          You have unlocked Free Nationwide Delivery across Bangladesh.
                        </span>
                      ) : (
                        <span>
                          Add <strong className="text-[#093624] font-satoshi-bold tabular-nums">{formatPrice(freeShippingDiff)}</strong> more to unlock{' '}
                          <strong className="text-[#141414]">Free Shipping</strong>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#093624] tabular-nums shrink-0">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-gray-200/70">
                    <div
                      className="bg-[#093624] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Desktop Table Header */}
                <div className="border border-gray-200 rounded-xs overflow-hidden bg-white">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#F9F9F9] border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#55585B] font-satoshi-bold">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  {/* Cart Item Rows */}
                  <div className="divide-y divide-gray-200">
                    {cart.map((item) => {
                      const matchedColor = item.product.colors?.find(
                        (c) => c.name === item.selectedColor
                      );
                      const lineSubtotal = item.product.price * item.quantity;

                      return (
                        <div
                          key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                          className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-center"
                        >
                          {/* Product Thumbnail & Variant Info */}
                          <div className="md:col-span-6 flex items-start sm:items-center gap-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/product/${item.product.id}`)}
                              className="w-20 h-24 sm:w-22 sm:h-28 bg-[#F7F7F7] rounded-xs overflow-hidden border border-gray-200 shrink-0 cursor-pointer"
                            >
                              <img
                                src={item.product.frontImage}
                                alt={item.product.name}
                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                              />
                            </button>

                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-satoshi-med block">
                                {item.product.category}
                              </span>
                              <button
                                type="button"
                                onClick={() => navigate(`/product/${item.product.id}`)}
                                className="text-sm sm:text-base font-bold font-satoshi-bold text-[#141414] hover:text-[#093624] transition-colors text-left line-clamp-2 mt-0.5 cursor-pointer"
                              >
                                {item.product.name}
                              </button>

                              {/* Variants: Size & Color with circular color swatch indicator */}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6D6868] mt-2">
                                <span>
                                  Size:{' '}
                                  <strong className="text-[#141414] font-satoshi-bold">
                                    {item.selectedSize || 'M'}
                                  </strong>
                                </span>
                                {item.selectedColor && (
                                  <>
                                    <span className="text-gray-300">·</span>
                                    <span className="inline-flex items-center gap-1.5">
                                      Color:
                                      {matchedColor?.hex && (
                                        <span
                                          className="w-3 h-3 rounded-full border border-black/20 inline-block shrink-0"
                                          style={{ backgroundColor: matchedColor.hex }}
                                        />
                                      )}
                                      <strong className="text-[#141414] font-satoshi-bold">
                                        {item.selectedColor}
                                      </strong>
                                    </span>
                                  </>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    item.product.id,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-xs text-[#6D6868] hover:text-[#093624] mt-3 transition-colors cursor-pointer font-satoshi-med"
                              >
                                <Trash2 size={13} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                          {/* Unit Price */}
                          <div className="md:col-span-2 flex md:justify-center items-center justify-between text-xs sm:text-sm">
                            <span className="md:hidden text-[#6D6868]">Unit Price:</span>
                            <span className="font-semibold text-[#141414] tabular-nums">
                              {formatPrice(item.product.price)}
                            </span>
                          </div>

                          {/* Quantity Stepper */}
                          <div className="md:col-span-2 flex md:justify-center items-center justify-between">
                            <span className="md:hidden text-xs text-[#6D6868]">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-xs bg-white h-10">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="w-9 h-full flex items-center justify-center text-[#141414] hover:bg-[#F1EFEE] transition-colors cursor-pointer"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-9 text-center text-xs font-bold text-[#141414] tabular-nums font-satoshi-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                                aria-label="Increase quantity"
                                className="w-9 h-full flex items-center justify-center text-[#141414] hover:bg-[#F1EFEE] transition-colors cursor-pointer"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="md:col-span-2 flex md:justify-end items-center justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                            <span className="md:hidden text-xs text-[#6D6868]">Subtotal:</span>
                            <span className="text-sm sm:text-base font-bold text-[#093624] tabular-nums font-satoshi-bold">
                              {formatPrice(lineSubtotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141414] hover:text-[#093624] border border-gray-300 hover:border-[#093624] px-5 py-3 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
                  >
                    <ArrowLeft size={14} />
                    <span>Continue Shopping</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center gap-1.5 text-xs font-satoshi-med text-[#6D6868] hover:text-[#141414] underline underline-offset-4 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Clear Shopping Cart</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-[#F9F9F9] border border-gray-200 rounded-xs p-6 sm:p-7 space-y-6">
                  <h2 className="text-lg font-bold font-satoshi-bold text-[#141414] pb-3 border-b border-gray-200">
                    Order Summary
                  </h2>

                  {/* Promo Code Form */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5 font-satoshi-bold">
                      <Tag size={13} className="text-[#093624]" />
                      <span>Promo Code</span>
                    </label>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. RESHANS20 or WELCOME10"
                        className="flex-1 h-11 px-3 bg-white border border-gray-300 rounded-xs text-xs text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624] font-satoshi"
                      />
                      <button
                        type="submit"
                        className="h-11 px-4 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer font-satoshi-bold shrink-0"
                      >
                        Apply
                      </button>
                    </form>

                    {couponFeedback && (
                      <p
                        className={`text-xs font-satoshi-med ${
                          couponFeedback.type === 'success' ? 'text-[#093624]' : 'text-[#141414]'
                        }`}
                      >
                        {couponFeedback.text}
                      </p>
                    )}

                    {appliedCouponCode && (
                      <div className="flex items-center justify-between bg-[#F9F295]/40 border border-[#093624]/20 px-3 py-2 rounded-xs text-xs text-[#093624] font-satoshi-bold">
                        <span>Applied: {appliedCouponCode}</span>
                        <button
                          type="button"
                          onClick={() => {
                            removeCouponCode();
                            setCouponInput('');
                            setCouponFeedback(null);
                          }}
                          className="hover:text-[#141414] cursor-pointer"
                          aria-label="Remove coupon"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delivery Note */}
                  <div className="space-y-2">
                    <label
                      htmlFor="cart-order-note"
                      className="text-xs font-bold uppercase tracking-wider text-[#141414] block font-satoshi-bold"
                    >
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      id="cart-order-note"
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Call before arrival, gate code, or gift note..."
                      className="w-full p-3 bg-white border border-gray-300 rounded-xs text-xs text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624] font-satoshi resize-none"
                    />
                  </div>

                  {/* Totals Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-[#55585B]">
                      <span>Subtotal ({cartCount} items)</span>
                      <span className="font-bold text-[#141414] tabular-nums font-satoshi-bold">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-[#093624] font-satoshi-bold">
                        <span>Discount ({appliedCouponCode})</span>
                        <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[#55585B]">
                      <span>Estimated Shipping</span>
                      <span className="font-bold text-[#093624] tabular-nums font-satoshi-bold">
                        {estimatedShipping === 0 ? 'Free' : formatPrice(estimatedShipping)}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-base font-bold text-[#141414] font-satoshi-bold">
                        Estimated Total
                      </span>
                      <span className="text-2xl font-bold text-[#093624] tabular-nums font-satoshi-bold">
                        {formatPrice(estimatedTotal)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6D6868]">
                      Final shipping charge (Inside Dhaka ৳ 60 / Outside Dhaka ৳ 120) is confirmed at checkout.
                    </p>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <button
                    type="button"
                    onClick={proceedToCartCheckout}
                    className="w-full h-12 bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer font-satoshi-bold"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={15} />
                  </button>

                  {/* Trust Footer */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#6D6868]">
                    <ShieldCheck size={15} className="text-[#093624] shrink-0" />
                    <span>bKash & Cash on Delivery available across Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
