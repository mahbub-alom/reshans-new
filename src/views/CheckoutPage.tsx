import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Banknote,
  Tag,
  Truck,
  User,
  AlertCircle,
  X,
} from 'lucide-react';

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  area?: string;
  city?: string;
  bkashNumber?: string;
  bkashTransactionId?: string;
}

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    checkoutMode,
    buyNowItem,
    clearBuyNow,
    formatPrice,
    navigate,
    settings,
    coupons,
    appliedCouponCode,
    applyCouponCode,
    removeCouponCode,
    calculateDiscount,
    orderNote,
    placeOrder,
    showToast,
  } = useShop();

  const isBuyNow = checkoutMode === 'buy-now' && buyNowItem !== null;
  const activeItems = isBuyNow && buyNowItem ? [buyNowItem] : cart;

  // Customer & Shipping Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('');
  const [shippingZone, setShippingZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [note, setNote] = useState(orderNote || '');

  // Payment Method State (bKash or Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Cash on Delivery'>('bKash');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTransactionId, setBkashTransactionId] = useState('');

  // Independent coupon state for Buy Now vs Cart
  const [buyNowCouponCode, setBuyNowCouponCode] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync shipping zone automatically if city changes to/from Dhaka
  useEffect(() => {
    if (city.trim().toLowerCase() === 'dhaka') {
      setShippingZone('inside_dhaka');
    }
  }, [city]);

  // Calculate Totals
  const subtotal = activeItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const activeCoupon = isBuyNow ? buyNowCouponCode : appliedCouponCode;
  const discountAmount = calculateDiscount(subtotal, activeCoupon);

  const freeThreshold = settings.freeShippingThreshold || 2500;
  const baseShipping =
    shippingZone === 'inside_dhaka'
      ? settings.shippingInsideDhaka || 60
      : settings.shippingOutsideDhaka || 120;
  const shippingCost = subtotal === 0 || subtotal >= freeThreshold ? 0 : baseShipping;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (!clean) {
      setCouponFeedback({ type: 'error', text: 'Please enter a promo code.' });
      return;
    }

    if (isBuyNow) {
      const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
      if (!found) {
        setCouponFeedback({
          type: 'error',
          text: `Promo code "${clean}" is invalid or expired.`,
        });
        return;
      }
      if (subtotal < found.minSpend) {
        setCouponFeedback({
          type: 'error',
          text: `Minimum spend of ${formatPrice(found.minSpend)} required for ${found.code}.`,
        });
        return;
      }
      setBuyNowCouponCode(found.code);
      setCouponFeedback({
        type: 'success',
        text: `${found.code} applied (${
          found.discountType === 'percentage'
            ? `${found.discountValue}% off`
            : `${formatPrice(found.discountValue)} off`
        })`,
      });
      showToast(`Promo code ${found.code} applied!`);
    } else {
      const res = applyCouponCode(clean, subtotal);
      setCouponFeedback({
        type: res.success ? 'success' : 'error',
        text: res.message,
      });
    }
  };

  const handleRemovePromo = () => {
    if (isBuyNow) {
      setBuyNowCouponCode(null);
    } else {
      removeCouponCode();
    }
    setCouponInput('');
    setCouponFeedback(null);
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      nextErrors.customerEmail = 'Please enter a valid email address.';
    }

    const digitsOnly = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || digitsOnly.length < 10) {
      nextErrors.customerPhone = 'Please enter a valid contact phone number (at least 10 digits).';
    }

    if (!customerAddress.trim() || customerAddress.trim().length < 5) {
      nextErrors.customerAddress = 'Please enter your full street address, house, and road number.';
    }

    if (!area.trim()) {
      nextErrors.area = 'Please enter your area or thana.';
    }

    if (!city.trim()) {
      nextErrors.city = 'Please enter your city or district.';
    }

    if (paymentMethod === 'bKash') {
      const bkashDigits = bkashNumber.replace(/\D/g, '');
      if (!bkashNumber.trim() || !/^01\d{9}$/.test(bkashDigits)) {
        nextErrors.bkashNumber = 'Enter a valid 11-digit bKash wallet number (e.g. 017XXXXXXXX).';
      }
      if (!bkashTransactionId.trim() || bkashTransactionId.trim().length < 6) {
        nextErrors.bkashTransactionId = 'Enter your bKash Transaction ID (TrxID, min 6 characters).';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItems.length === 0) return;

    if (!validateForm()) {
      showToast('Please complete all required checkout fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        mode: isBuyNow ? 'buy-now' : 'cart',
        items: activeItems,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        city: city.trim(),
        area: area.trim(),
        postalCode: postalCode.trim() || undefined,
        shippingZone,
        paymentMethod,
        bkashNumber: paymentMethod === 'bKash' ? bkashNumber.trim() : undefined,
        bkashTransactionId:
          paymentMethod === 'bKash' ? bkashTransactionId.trim().toUpperCase() : undefined,
        subtotal,
        shippingCost,
        discount: discountAmount,
        couponCode: activeCoupon || undefined,
        total: finalTotal,
        note: note.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 550);
  };

  const handleFillDemoBkash = () => {
    if (!bkashNumber.trim()) {
      setBkashNumber(
        customerPhone.replace(/\D/g, '').length === 11 ? customerPhone.replace(/\D/g, '') : '01712345678'
      );
    }
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let trx = '8N';
    for (let i = 0; i < 8; i++) {
      trx += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setBkashTransactionId(trx);
    setErrors((prev) => ({ ...prev, bkashNumber: undefined, bkashTransactionId: undefined }));
  };

  if (activeItems.length === 0) {
    return (
      <div className="bg-white min-h-screen text-[#141414] font-satoshi py-20 px-4">
        <div className="max-w-lg mx-auto text-center bg-[#F9F9F9] border border-gray-200 rounded-xs p-10">
          <div className="w-16 h-16 rounded-full bg-[#093624]/10 text-[#093624] mx-auto flex items-center justify-center mb-5">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-2xl font-bold font-satoshi-bold text-[#141414] mb-2">
            No items ready for checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6868] mb-6">
            Add products to your shopping cart or choose Buy Now on any product page to proceed.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 bg-[#093624] hover:bg-[#052216] text-[#F9F295] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
          >
            <span>Explore Shop</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* Breadcrumb Area */}
      <div className="bg-[#F9F9F9] py-10 border-b border-gray-100">
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
            {!isBuyNow && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="hover:text-[#093624] transition-colors cursor-pointer"
                >
                  Cart
                </button>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-[#141414] font-satoshi-bold">Checkout</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-satoshi-bold text-[#141414] tracking-tight">
                {isBuyNow ? 'Express Direct Checkout' : 'Checkout'}
              </h1>
              <p className="text-xs sm:text-sm text-[#6D6868] mt-1">
                Complete your delivery details and select bKash or Cash on Delivery to place your order.
              </p>
            </div>

            {isBuyNow && (
              <div className="flex items-center gap-3 bg-[#F9F295]/50 border border-[#093624]/20 px-4 py-2 rounded-xs text-xs text-[#093624] font-satoshi-bold">
                <span>Direct Buy Now Mode (1 selected item)</span>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      clearBuyNow();
                      navigate('/cart');
                    }}
                    className="underline hover:text-[#141414] cursor-pointer"
                  >
                    Switch to Cart ({cart.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Checkout Grid */}
      <div className="py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handlePlaceOrder}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column: Customer Info, Delivery Address, Payment Method (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Validation Error Alert Banner */}
              {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-[#F9F9F9] border border-[#141414] rounded-xs flex items-start gap-3 text-xs text-[#141414]">
                  <AlertCircle size={18} className="text-[#093624] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold font-satoshi-bold">
                      Please review the highlighted fields before placing your order.
                    </p>
                    <p className="text-[#6D6868] mt-0.5">
                      Ensure your contact information, delivery address, and payment details are accurate.
                    </p>
                  </div>
                </div>
              )}

              {/* Section 1: Customer Contact Information */}
              <div className="border border-gray-200 rounded-xs p-6 sm:p-8 bg-white space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center text-xs font-bold font-satoshi-bold">
                    01
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-satoshi-bold text-[#141414]">
                      Customer & Contact Information
                    </h2>
                    <p className="text-xs text-[#6D6868]">
                      Used for order confirmation and courier delivery updates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="checkout-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.customerName)
                            setErrors((prev) => ({ ...prev, customerName: undefined }));
                        }}
                        placeholder="e.g. Tanvir Rahman"
                        className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none transition-colors ${
                          errors.customerName
                            ? 'border-[#141414] bg-[#F9F9F9]'
                            : 'border-gray-300 focus:border-[#093624]'
                        }`}
                      />
                    </div>
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                        <AlertCircle size={12} className="text-[#093624]" />
                        <span>{errors.customerName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-email"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Email Address *
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (errors.customerEmail)
                          setErrors((prev) => ({ ...prev, customerEmail: undefined }));
                      }}
                      placeholder="you@example.com"
                      className={`w-full h-12 px-4 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none transition-colors ${
                        errors.customerEmail
                          ? 'border-[#141414] bg-[#F9F9F9]'
                          : 'border-gray-300 focus:border-[#093624]'
                      }`}
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                        <AlertCircle size={12} className="text-[#093624]" />
                        <span>{errors.customerEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="checkout-phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (errors.customerPhone)
                            setErrors((prev) => ({ ...prev, customerPhone: undefined }));
                        }}
                        placeholder="+880 17XX XXXXXX"
                        className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none transition-colors ${
                          errors.customerPhone
                            ? 'border-[#141414] bg-[#F9F9F9]'
                            : 'border-gray-300 focus:border-[#093624]'
                        }`}
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                        <AlertCircle size={12} className="text-[#093624]" />
                        <span>{errors.customerPhone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="border border-gray-200 rounded-xs p-6 sm:p-8 bg-white space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center text-xs font-bold font-satoshi-bold">
                    02
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-satoshi-bold text-[#141414]">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-[#6D6868]">
                      Fast doorstep delivery across Dhaka and all 64 districts of Bangladesh.
                    </p>
                  </div>
                </div>

                {/* Delivery Zone Selection */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#141414] font-satoshi-bold">
                    Shipping Zone *
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShippingZone('inside_dhaka');
                        if (!city.trim() || city.trim().toLowerCase() !== 'dhaka') {
                          setCity('Dhaka');
                        }
                      }}
                      className={`p-3.5 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
                        shippingZone === 'inside_dhaka'
                          ? 'border-[#093624] bg-[#093624]/5 ring-1 ring-[#093624]'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-[#141414] font-satoshi-bold">
                          Inside Dhaka
                        </span>
                        <span className="text-[11px] text-[#6D6868]">
                          24–48 hours express delivery
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#093624] tabular-nums font-satoshi-bold">
                        {subtotal >= freeThreshold
                          ? 'Free'
                          : formatPrice(settings.shippingInsideDhaka || 60)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShippingZone('outside_dhaka');
                        if (city.trim().toLowerCase() === 'dhaka') {
                          setCity('');
                        }
                      }}
                      className={`p-3.5 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
                        shippingZone === 'outside_dhaka'
                          ? 'border-[#093624] bg-[#093624]/5 ring-1 ring-[#093624]'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-[#141414] font-satoshi-bold">
                          Outside Dhaka
                        </span>
                        <span className="text-[11px] text-[#6D6868]">
                          3–5 days nationwide courier
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#093624] tabular-nums font-satoshi-bold">
                        {subtotal >= freeThreshold
                          ? 'Free'
                          : formatPrice(settings.shippingOutsideDhaka || 120)}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Street Address (House, Road, Flat) *
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="checkout-address"
                        type="text"
                        value={customerAddress}
                        onChange={(e) => {
                          setCustomerAddress(e.target.value);
                          if (errors.customerAddress)
                            setErrors((prev) => ({ ...prev, customerAddress: undefined }));
                        }}
                        placeholder="e.g. House 42, Road 11, Block D, Apt 4B"
                        className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none transition-colors ${
                          errors.customerAddress
                            ? 'border-[#141414] bg-[#F9F9F9]'
                            : 'border-gray-300 focus:border-[#093624]'
                        }`}
                      />
                    </div>
                    {errors.customerAddress && (
                      <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                        <AlertCircle size={12} className="text-[#093624]" />
                        <span>{errors.customerAddress}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-area"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Area / Thana *
                    </label>
                    <input
                      id="checkout-area"
                      type="text"
                      value={area}
                      onChange={(e) => {
                        setArea(e.target.value);
                        if (errors.area) setErrors((prev) => ({ ...prev, area: undefined }));
                      }}
                      placeholder="e.g. Banani, Gulshan, Dhanmondi"
                      className={`w-full h-12 px-4 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none transition-colors ${
                        errors.area
                          ? 'border-[#141414] bg-[#F9F9F9]'
                          : 'border-gray-300 focus:border-[#093624]'
                      }`}
                    />
                    {errors.area && (
                      <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                        <AlertCircle size={12} className="text-[#093624]" />
                        <span>{errors.area}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      City / District *
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                      }}
                      placeholder="e.g. Dhaka, Chattogram, Sylhet"
                      className={`w-full h-12 px-4 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none transition-colors ${
                        errors.city
                          ? 'border-[#141414] bg-[#F9F9F9]'
                          : 'border-gray-300 focus:border-[#093624]'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                        <AlertCircle size={12} className="text-[#093624]" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-postal"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Postal Code (Optional)
                    </label>
                    <input
                      id="checkout-postal"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 1213"
                      className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-note"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                    >
                      Delivery Note (Optional)
                    </label>
                    <input
                      id="checkout-note"
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Call before arrival"
                      className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method (Strictly bKash & Cash on Delivery) */}
              <div className="border border-gray-200 rounded-xs p-6 sm:p-8 bg-white space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center text-xs font-bold font-satoshi-bold">
                    03
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-satoshi-bold text-[#141414]">
                      Payment Method
                    </h2>
                    <p className="text-xs text-[#6D6868]">
                      Choose between instant bKash verification or Cash on Delivery.
                    </p>
                  </div>
                </div>

                {/* Payment Method Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A: bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bKash')}
                    className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      paymentMethod === 'bKash'
                        ? 'border-[#093624] bg-[#093624] text-[#F9F295] shadow-xs'
                        : 'border-gray-200 bg-white text-[#141414] hover:border-[#093624]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xs flex items-center justify-center shrink-0 ${
                        paymentMethod === 'bKash'
                          ? 'bg-[#F9F295] text-[#093624]'
                          : 'bg-[#F1EFEE] text-[#093624]'
                      }`}
                    >
                      <Smartphone size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold font-satoshi-bold">bKash</span>
                        {paymentMethod === 'bKash' && <Check size={16} />}
                      </div>
                      <p
                        className={`text-xs mt-0.5 ${
                          paymentMethod === 'bKash' ? 'text-white/85' : 'text-[#6D6868]'
                        }`}
                      >
                        Instant mobile wallet payment
                      </p>
                    </div>
                  </button>

                  {/* Option B: Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Cash on Delivery');
                      setErrors((prev) => ({
                        ...prev,
                        bkashNumber: undefined,
                        bkashTransactionId: undefined,
                      }));
                    }}
                    className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#093624] bg-[#093624] text-[#F9F295] shadow-xs'
                        : 'border-gray-200 bg-white text-[#141414] hover:border-[#093624]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xs flex items-center justify-center shrink-0 ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'bg-[#F9F295] text-[#093624]'
                          : 'bg-[#F1EFEE] text-[#093624]'
                      }`}
                    >
                      <Banknote size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold font-satoshi-bold">
                          Cash on Delivery (COD)
                        </span>
                        {paymentMethod === 'Cash on Delivery' && <Check size={16} />}
                      </div>
                      <p
                        className={`text-xs mt-0.5 ${
                          paymentMethod === 'Cash on Delivery' ? 'text-white/85' : 'text-[#6D6868]'
                        }`}
                      >
                        Pay in cash when your order arrives
                      </p>
                    </div>
                  </button>
                </div>

                {/* Dynamic Payment Instructions Panel */}
                {paymentMethod === 'bKash' ? (
                  <div className="bg-[#F9F9F9] border border-gray-200 rounded-xs p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#093624] font-satoshi-bold">
                          bKash Payment Verification
                        </h3>
                        <p className="text-xs text-[#6D6868] mt-0.5">
                          Send <strong className="text-[#141414] tabular-nums">{formatPrice(finalTotal)}</strong> to our official bKash Merchant account and enter your transaction reference.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleFillDemoBkash}
                        className="text-[11px] font-bold font-satoshi-bold text-[#093624] bg-[#F9F295] hover:bg-[#fae968] px-3 py-1.5 rounded-xs transition-colors cursor-pointer"
                      >
                        Auto-Fill Sample TrxID
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-gray-200 p-3.5 rounded-xs text-xs">
                      <div>
                        <span className="text-[#6D6868] block">Merchant bKash Number</span>
                        <span className="font-mono font-bold text-[#141414] text-sm">
                          01700-000000
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6D6868] block">Payable Amount</span>
                        <span className="font-bold text-[#093624] text-sm tabular-nums">
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="bkash-number"
                          className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                        >
                          Your bKash Number *
                        </label>
                        <input
                          id="bkash-number"
                          type="tel"
                          value={bkashNumber}
                          onChange={(e) => {
                            setBkashNumber(e.target.value);
                            if (errors.bkashNumber)
                              setErrors((prev) => ({ ...prev, bkashNumber: undefined }));
                          }}
                          placeholder="017XXXXXXXX"
                          className={`w-full h-11 px-3.5 bg-white border rounded-xs text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none ${
                            errors.bkashNumber
                              ? 'border-[#141414]'
                              : 'border-gray-300 focus:border-[#093624]'
                          }`}
                        />
                        {errors.bkashNumber && (
                          <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                            <AlertCircle size={12} className="text-[#093624]" />
                            <span>{errors.bkashNumber}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="bkash-trx"
                          className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold"
                        >
                          bKash Transaction ID (TrxID) *
                        </label>
                        <input
                          id="bkash-trx"
                          type="text"
                          value={bkashTransactionId}
                          onChange={(e) => {
                            setBkashTransactionId(e.target.value);
                            if (errors.bkashTransactionId)
                              setErrors((prev) => ({ ...prev, bkashTransactionId: undefined }));
                          }}
                          placeholder="e.g. 8N7A2K9P1X"
                          className={`w-full h-11 px-3.5 bg-white border rounded-xs text-sm font-mono uppercase text-[#141414] placeholder:text-gray-400 placeholder:normal-case focus:outline-none ${
                            errors.bkashTransactionId
                              ? 'border-[#141414]'
                              : 'border-gray-300 focus:border-[#093624]'
                          }`}
                        />
                        {errors.bkashTransactionId && (
                          <p className="mt-1 text-xs text-[#141414] font-satoshi-med flex items-center gap-1">
                            <AlertCircle size={12} className="text-[#093624]" />
                            <span>{errors.bkashTransactionId}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F9F9F9] border border-gray-200 rounded-xs p-5 space-y-2.5 text-xs text-[#55585B]">
                    <div className="flex items-center gap-2 text-[#093624] font-bold font-satoshi-bold text-sm">
                      <Truck size={16} />
                      <span>Cash on Delivery Confirmation</span>
                    </div>
                    <p className="leading-relaxed">
                      You will pay{' '}
                      <strong className="text-[#141414] tabular-nums">
                        {formatPrice(finalTotal)}
                      </strong>{' '}
                      in cash directly to our delivery rider upon receiving your parcel. Our courier partner will call your contact number prior to arrival.
                    </p>
                    <p className="text-[11px] text-[#6D6868]">
                      Includes 7-day size or style exchange guarantee across Bangladesh.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-[#F9F9F9] border border-gray-200 rounded-xs p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h2 className="text-lg font-bold font-satoshi-bold text-[#141414]">
                    Order Summary
                  </h2>
                  <span className="text-xs font-satoshi-bold text-[#093624]">
                    {activeItems.reduce((sum, i) => sum + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Itemized Products */}
                <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto pr-1">
                  {activeItems.map((item) => {
                    const matchedColor = item.product.colors?.find(
                      (c) => c.name === item.selectedColor
                    );
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5"
                      >
                        <div className="relative w-16 h-20 bg-white border border-gray-200 rounded-xs overflow-hidden shrink-0">
                          <img
                            src={item.product.frontImage}
                            alt={item.product.name}
                            className="w-full h-full object-cover object-top"
                          />
                          <span className="absolute -top-0 -right-0 bg-[#093624] text-[#F9F295] text-[10px] font-bold px-1.5 py-0.5 tabular-nums">
                            {item.quantity}x
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold font-satoshi-bold text-[#141414] line-clamp-1">
                            {item.product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#6D6868] mt-1">
                            <span>
                              Size: <strong className="text-[#141414]">{item.selectedSize || 'M'}</strong>
                            </span>
                            {item.selectedColor && (
                              <>
                                <span>·</span>
                                <span className="inline-flex items-center gap-1">
                                  {matchedColor?.hex && (
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                                      style={{ backgroundColor: matchedColor.hex }}
                                    />
                                  )}
                                  <strong className="text-[#141414]">{item.selectedColor}</strong>
                                </span>
                              </>
                            )}
                          </div>
                          <span className="text-[11px] text-[#6D6868] block mt-0.5 tabular-nums">
                            {formatPrice(item.product.price)} × {item.quantity}
                          </span>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-[#093624] tabular-nums font-satoshi-bold shrink-0">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Input */}
                <div className="pt-4 border-t border-gray-200 space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5 font-satoshi-bold">
                    <Tag size={13} className="text-[#093624]" />
                    <span>Discount / Promo Code</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Try RESHANS20 or WELCOME10"
                      className="flex-1 h-10 px-3 bg-white border border-gray-300 rounded-xs text-xs text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="h-10 px-4 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer font-satoshi-bold shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {couponFeedback && (
                    <p className="text-xs font-satoshi-med text-[#093624]">{couponFeedback.text}</p>
                  )}

                  {activeCoupon && (
                    <div className="flex items-center justify-between bg-[#F9F295]/50 border border-[#093624]/20 px-3 py-1.5 rounded-xs text-xs text-[#093624] font-satoshi-bold">
                      <span>Code Applied: {activeCoupon}</span>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="hover:text-[#141414] cursor-pointer"
                        aria-label="Remove promo code"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-[#55585B]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#141414] tabular-nums font-satoshi-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#55585B]">
                    <span>
                      Shipping ({shippingZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                    </span>
                    <span className="font-bold text-[#093624] tabular-nums font-satoshi-bold">
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#55585B]">
                    <span>Discount {activeCoupon ? `(${activeCoupon})` : ''}</span>
                    <span className="font-bold text-[#093624] tabular-nums font-satoshi-bold">
                      {discountAmount > 0 ? `-${formatPrice(discountAmount)}` : formatPrice(0)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                    <span className="text-base font-bold text-[#141414] font-satoshi-bold">
                      Final Total
                    </span>
                    <span className="text-2xl font-bold text-[#093624] tabular-nums font-satoshi-bold">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 bg-[#093624] hover:bg-[#052216] disabled:opacity-60 text-[#F9F295] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer font-satoshi-bold"
                >
                  <Lock size={14} />
                  <span>
                    {isSubmitting
                      ? 'Confirming Your Order...'
                      : paymentMethod === 'bKash'
                      ? `Confirm bKash Payment (${formatPrice(finalTotal)})`
                      : `Place COD Order (${formatPrice(finalTotal)})`}
                  </span>
                </button>

                {/* Back Link & Security Note */}
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      isBuyNow
                        ? navigate(`/product/${buyNowItem?.product.id || ''}`)
                        : navigate('/cart')
                    }
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-[#6D6868] hover:text-[#093624] font-satoshi-med cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span>{isBuyNow ? 'Return to Product Details' : 'Back to Shopping Cart'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#6D6868]">
                    <ShieldCheck size={14} className="text-[#093624] shrink-0" />
                    <span>Encrypted checkout · Unique tracking code generated upon confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
