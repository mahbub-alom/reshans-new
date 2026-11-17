import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  ArrowRight,
  XCircle,
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  {
    key: 'Pending',
    label: 'Order Placed',
    desc: 'Your order is confirmed in our system and queued for verification.',
  },
  {
    key: 'Processing',
    label: 'Processing & Packing',
    desc: 'Our Dhaka atelier fulfillment team is inspecting and packing your garments.',
  },
  {
    key: 'Shipped',
    label: 'Shipped / In Transit',
    desc: 'Your parcel has been handed over to our courier partner for delivery.',
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    desc: 'Your package has been successfully delivered to your doorstep.',
  },
];

export const TrackOrderPage: React.FC = () => {
  const {
    orders,
    trackedCodeQuery,
    setTrackedCodeQuery,
    findOrderByTrackingCode,
    formatPrice,
    navigate,
  } = useShop();

  const [inputCode, setInputCode] = useState(trackedCodeQuery || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-load when arriving from Order Confirmation with trackedCodeQuery
  useEffect(() => {
    if (trackedCodeQuery) {
      setInputCode(trackedCodeQuery);
      const match = findOrderByTrackingCode(trackedCodeQuery);
      if (match) {
        setSearchedOrder(match);
        setHasSearched(true);
      }
    }
  }, [trackedCodeQuery, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed) {
      setSearchedOrder(null);
      setHasSearched(true);
      return;
    }
    setTrackedCodeQuery(trimmed);
    const match = findOrderByTrackingCode(trimmed);
    setSearchedOrder(match || null);
    setHasSearched(true);
  };

  const handleQuickSelect = (code: string) => {
    setInputCode(code);
    setTrackedCodeQuery(code);
    const match = findOrderByTrackingCode(code);
    setSearchedOrder(match || null);
    setHasSearched(true);
  };

  const getActiveStepIndex = (status: OrderStatus): number => {
    if (status === 'Cancelled') return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const sampleCodes = orders
    .filter((o) => o.trackingNumber)
    .slice(0, 4)
    .map((o) => ({
      code: o.trackingNumber as string,
      orderId: o.id,
      status: o.orderStatus,
    }));

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* Breadcrumb Banner */}
      <div className="bg-[#F9F9F9] py-12 border-b border-gray-100">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#55585B] font-satoshi-med mb-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-[#093624] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-[#141414] font-satoshi-bold">Track Order</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-satoshi-bold text-[#141414] tracking-tight mb-2">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6868] max-w-lg mx-auto">
            Enter the unique tracking code provided after checkout (e.g. RSH-2026-XXXXXX) or your Order ID to view live order progress.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-7 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter Tracking Code (e.g. RSH-2026-482910 or REDX-DH-98231)"
                className="w-full h-12 pl-11 pr-4 bg-white border border-gray-300 rounded-xs text-sm font-mono text-[#141414] placeholder:text-gray-400 placeholder:font-satoshi focus:outline-none focus:border-[#093624]"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-7 bg-[#093624] hover:bg-[#052216] text-[#F9F295] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer font-satoshi-bold shrink-0"
            >
              Track Order
            </button>
          </form>

          {/* Quick-Select Recent Tracking Codes */}
          {sampleCodes.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#6D6868]">Recent tracking codes:</span>
              {sampleCodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleQuickSelect(item.code)}
                  className={`font-mono px-2.5 py-1 rounded-xs border transition-colors cursor-pointer ${
                    searchedOrder?.trackingNumber === item.code
                      ? 'bg-[#093624] text-[#F9F295] border-[#093624]'
                      : 'bg-white text-[#141414] border-gray-300 hover:border-[#093624]'
                  }`}
                >
                  {item.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="py-12 sm:py-16">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6">
          {!hasSearched ? (
            <div className="border border-gray-200 rounded-xs p-8 sm:p-10 bg-[#F9F9F9] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#093624]/10 text-[#093624] mx-auto flex items-center justify-center">
                <Truck size={22} />
              </div>
              <h2 className="text-lg font-bold font-satoshi-bold text-[#141414]">
                Enter your tracking code above
              </h2>
              <p className="text-xs sm:text-sm text-[#6D6868] max-w-md mx-auto">
                You can track any order placed via bKash or Cash on Delivery across Dhaka and nationwide Bangladesh.
              </p>
            </div>
          ) : !searchedOrder ? (
            <div className="border border-gray-200 rounded-xs p-8 sm:p-10 bg-[#F9F9F9] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#141414]/10 text-[#141414] mx-auto flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <h2 className="text-lg font-bold font-satoshi-bold text-[#141414]">
                No order found for "{inputCode.trim()}"
              </h2>
              <p className="text-xs sm:text-sm text-[#6D6868] max-w-md mx-auto">
                Please double-check your tracking code or Order ID and try again. Tracking codes are case-insensitive.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Order Header Summary */}
              <div className="border border-gray-200 rounded-xs p-6 sm:p-8 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6D6868] block mb-1">
                    Tracking Code
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#093624] tracking-wide">
                    {searchedOrder.trackingNumber || searchedOrder.id}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6D6868] mt-1">
                    Order <strong className="text-[#141414]">{searchedOrder.id}</strong> · Placed on{' '}
                    <span className="tabular-nums">{searchedOrder.date}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <span className="px-4 py-1.5 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase tracking-wider rounded-xs font-satoshi-bold w-fit">
                    Status: {searchedOrder.orderStatus}
                  </span>
                  <span className="text-xs text-[#6D6868]">
                    Payment: <strong className="text-[#141414]">{searchedOrder.paymentMethod}</strong> ({searchedOrder.paymentStatus})
                  </span>
                </div>
              </div>

              {/* Status Timeline Stepper */}
              <div className="border border-gray-200 rounded-xs p-6 sm:p-8 bg-white">
                <h3 className="text-base font-bold font-satoshi-bold text-[#141414] mb-6 pb-3 border-b border-gray-100">
                  Shipment Progress
                </h3>

                {searchedOrder.orderStatus === 'Cancelled' ? (
                  <div className="p-5 bg-[#F9F9F9] border border-gray-300 rounded-xs flex items-start gap-3">
                    <XCircle size={20} className="text-[#141414] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                        This order has been cancelled
                      </h4>
                      <p className="text-xs text-[#6D6868] mt-1">
                        {searchedOrder.note || 'Please contact customer care if you need assistance with a refund or replacement.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {STATUS_STEPS.map((step, idx) => {
                      const activeIdx = getActiveStepIndex(searchedOrder.orderStatus);
                      const isCompleted = idx <= activeIdx;
                      const isCurrent = idx === activeIdx;

                      return (
                        <div
                          key={step.key}
                          className={`p-4 rounded-xs border transition-colors ${
                            isCurrent
                              ? 'border-[#093624] bg-[#093624]/5'
                              : isCompleted
                              ? 'border-gray-200 bg-[#F9F9F9]'
                              : 'border-gray-100 bg-white opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-[#093624] text-[#F9F295]'
                                  : 'bg-[#F1EFEE] text-[#6D6868]'
                              }`}
                            >
                              {idx === 0 && <Clock size={15} />}
                              {idx === 1 && <Package size={15} />}
                              {idx === 2 && <Truck size={15} />}
                              {idx === 3 && <CheckCircle2 size={15} />}
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6868]">
                              Step 0{idx + 1}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold font-satoshi-bold text-[#141414] mb-1">
                            {step.label}
                          </h4>
                          <p className="text-xs text-[#6D6868] leading-relaxed">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer Address & Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 border border-gray-200 rounded-xs p-6 bg-white space-y-4">
                  <div className="flex items-center gap-2 text-[#093624] font-bold font-satoshi-bold text-sm pb-2 border-b border-gray-100">
                    <MapPin size={16} />
                    <span>Delivery Destination</span>
                  </div>
                  <div className="text-xs sm:text-sm space-y-1.5 text-[#55585B]">
                    <p className="font-bold text-[#141414] font-satoshi-bold">
                      {searchedOrder.customerName}
                    </p>
                    <p>{searchedOrder.customerPhone}</p>
                    <p className="leading-relaxed text-[#141414]">
                      {searchedOrder.customerAddress}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[#6D6868] flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#093624]" />
                      Payment:
                    </span>
                    <span className="font-bold text-[#141414]">
                      {searchedOrder.paymentMethod} ({searchedOrder.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="md:col-span-7 border border-gray-200 rounded-xs overflow-hidden bg-white">
                  <div className="bg-[#F9F9F9] px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                      Order Items
                    </h3>
                    <span className="text-sm font-bold text-[#093624] tabular-nums font-satoshi-bold">
                      Total: {formatPrice(searchedOrder.total)}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-16 bg-[#F7F7F7] border border-gray-200 rounded-xs overflow-hidden shrink-0">
                            <img
                              src={item.product.frontImage}
                              alt={item.product.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold font-satoshi-bold text-[#141414] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-[#6D6868] mt-0.5">
                              Size: {item.selectedSize || 'M'} · Color: {item.selectedColor || 'Default'} · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#093624] tabular-nums shrink-0 font-satoshi-bold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#093624] text-white hover:text-[#F9F295] text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xs transition-colors cursor-pointer font-satoshi-bold"
                >
                  <span>Continue Shopping</span>
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
