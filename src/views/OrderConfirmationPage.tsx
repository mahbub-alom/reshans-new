import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  ArrowRight,
  Printer,
  Download,
  MapPin,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { downloadOrderInvoice } from '../lib/invoiceGenerator';

export const OrderConfirmationPage: React.FC = () => {
  const {
    lastConfirmedOrder,
    orders,
    formatPrice,
    navigate,
    setTrackedCodeQuery,
    showToast,
  } = useShop();

  const [copied, setCopied] = useState(false);

  const order = lastConfirmedOrder || orders[0];

  if (!order) {
    return (
      <div className="bg-white min-h-screen text-[#141414] font-satoshi py-20 px-4">
        <div className="max-w-lg mx-auto text-center bg-[#F9F9F9] border border-gray-200 rounded-xs p-10">
          <div className="w-16 h-16 rounded-full bg-[#093624]/10 text-[#093624] mx-auto flex items-center justify-center mb-5">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-2xl font-bold font-satoshi-bold text-[#141414] mb-2">
            No recent order confirmation found
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6868] mb-6">
            Have a tracking code? Use our Order Tracking portal to check your shipment status.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/track-order')}
              className="bg-[#093624] hover:bg-[#052216] text-[#F9F295] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
            >
              Track an Order
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="border border-gray-300 hover:border-[#093624] text-[#141414] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trackingCode = order.trackingNumber || order.id;

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(trackingCode);
    }
    setCopied(true);
    showToast(`Tracking code ${trackingCode} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTrackOrder = () => {
    setTrackedCodeQuery(trackingCode);
    navigate('/track-order');
  };

  const computedSubtotal =
    order.subtotal !== undefined
      ? order.subtotal
      : order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const computedDiscount = order.discount || 0;
  const computedShipping =
    order.shippingCost !== undefined
      ? order.shippingCost
      : Math.max(0, order.total - (computedSubtotal - computedDiscount));

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* Top Confirmation Header */}
      <div className="bg-[#F9F9F9] py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#093624] text-[#F9F295] mx-auto flex items-center justify-center mb-5 shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#093624] block mb-2 font-satoshi-bold">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-satoshi-bold text-[#141414] tracking-tight mb-3 text-balance">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6868] max-w-xl mx-auto leading-relaxed">
            Your order <strong className="text-[#141414]">{order.id}</strong> has been received and confirmed. A receipt has been prepared for{' '}
            <strong className="text-[#141414]">{order.customerEmail}</strong>.
          </p>

          {/* Prominent Tracking Code Box */}
          <div className="mt-8 max-w-xl mx-auto bg-[#093624] text-white rounded-xs p-6 sm:p-7 shadow-md">
            <span className="text-[11px] uppercase tracking-widest text-[#F9F295] font-satoshi-bold block mb-2">
              Your Unique Order Tracking Code
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-[#F9F295] tabular-nums select-all">
                {trackingCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 bg-[#F9F295] hover:bg-[#fae968] text-[#093624] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xs transition-colors cursor-pointer font-satoshi-bold shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-xs text-white/80 mt-3">
              Save this code to check real-time fulfillment and courier status anytime.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleTrackOrder}
              className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
            >
              <Truck size={15} />
              <span>Track Order Status</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#093624] bg-white text-[#141414] hover:text-[#093624] text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
            >
              <span>Continue Shopping</span>
            </button>

            <button
              type="button"
              onClick={() => downloadOrderInvoice(order, formatPrice)}
              className="inline-flex items-center gap-2 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xs transition-colors cursor-pointer font-satoshi-bold shadow-xs"
            >
              <Download size={15} />
              <span>Download Invoice</span>
            </button>

            
          </div>
        </div>
      </div>

      {/* Detailed Receipt Summary */}
      <div className="py-12 sm:py-16">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 space-y-8">
          {/* Customer, Delivery & Payment Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xs p-6 bg-white space-y-3">
              <div className="flex items-center gap-2 text-[#093624] font-bold font-satoshi-bold text-sm pb-2 border-b border-gray-100">
                <MapPin size={16} />
                <span>Delivery Information</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 text-[#55585B]">
                <p className="font-bold text-[#141414] font-satoshi-bold">{order.customerName}</p>
                <p>{order.customerPhone}</p>
                <p>{order.customerEmail}</p>
                <p className="pt-1 leading-relaxed text-[#141414]">{order.customerAddress}</p>
                {order.note && (
                  <p className="text-xs text-[#6D6868] pt-1">
                    Note: <span className="italic">{order.note}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xs p-6 bg-white space-y-3">
              <div className="flex items-center gap-2 text-[#093624] font-bold font-satoshi-bold text-sm pb-2 border-b border-gray-100">
                <CreditCard size={16} />
                <span>Order & Payment Details</span>
              </div>
              <div className="text-xs sm:text-sm space-y-2 text-[#55585B]">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-bold text-[#141414] font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Placed On:</span>
                  <span className="font-medium text-[#141414] tabular-nums">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold text-[#141414] font-satoshi-bold">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Status:</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#F9F295]/60 text-[#093624] rounded-xs font-satoshi-bold">
                    {order.paymentStatus}
                  </span>
                </div>
                {order.bkashTransactionId && (
                  <div className="flex justify-between">
                    <span>bKash TrxID:</span>
                    <span className="font-mono font-bold text-[#093624]">
                      {order.bkashTransactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items & Totals */}
          <div className="border border-gray-200 rounded-xs overflow-hidden bg-white">
            <div className="bg-[#F9F9F9] px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold font-satoshi-bold text-[#141414]">
                Items Ordered ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-[#093624]">
                Status: {order.orderStatus}
              </span>
            </div>

            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => {
                const matchedColor = item.product.colors?.find(
                  (c) => c.name === item.selectedColor
                );
                return (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="p-5 sm:p-6 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-20 bg-[#F7F7F7] border border-gray-200 rounded-xs overflow-hidden shrink-0">
                        <img
                          src={item.product.frontImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold font-satoshi-bold text-[#141414] line-clamp-1">
                          {item.product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6D6868] mt-1">
                          <span>
                            Size: <strong className="text-[#141414]">{item.selectedSize || 'M'}</strong>
                          </span>
                          {item.selectedColor && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1.5">
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
                          <span>·</span>
                          <span className="tabular-nums">
                            Qty: <strong className="text-[#141414]">{item.quantity}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-sm sm:text-base font-bold text-[#093624] tabular-nums font-satoshi-bold shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#F9F9F9] px-6 py-5 border-t border-gray-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-[#55585B]">
                <span>Subtotal</span>
                <span className="font-bold text-[#141414] tabular-nums">
                  {formatPrice(computedSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#55585B]">
                <span>Shipping Charge</span>
                <span className="font-bold text-[#093624] tabular-nums">
                  {computedShipping === 0 ? 'Free' : formatPrice(computedShipping)}
                </span>
              </div>
              {computedDiscount > 0 && (
                <div className="flex justify-between text-[#093624] font-satoshi-bold">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span className="tabular-nums">-{formatPrice(computedDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-300 flex justify-between items-center">
                <span className="text-base font-bold text-[#141414] font-satoshi-bold">
                  Total Paid / Payable
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#093624] tabular-nums font-satoshi-bold">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
