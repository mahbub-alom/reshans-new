import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  RotateCcw,
  MapPin,
  XCircle,
  PackageCheck,
} from 'lucide-react';

export const DashboardOrderDetailsPage: React.FC = () => {
  const { navigate, formatPrice, selectedOrder, cancelOrder, setTrackedCodeQuery, setSelectedOrderId } = useShop();

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleTrack = (code: string) => {
    setTrackedCodeQuery(code);
    navigate('/track-order');
  };

  if (!selectedOrder) {
    return (
      <DashboardLayout activeTab="order-details" title="Order Details">
        <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs space-y-4">
          <p className="text-brand-body text-sm font-satoshi">No order selected or order not found.</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/orders')}>
            Back to Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const order = selectedOrder;
  const isDone = order.orderStatus === 'Delivered';
  const isCancelled = order.orderStatus === 'Cancelled';
  const isPending = order.orderStatus === 'Pending';
  const subtotal = order.subtotal || order.total;
  const discount = order.discount || 0;
  const shippingCost = order.shippingCost || 0;
  const grandTotal = order.total;

  // Real-time timeline steps based on order status
  const getTimelineSteps = () => {
    const status = order.orderStatus;
    const isProcessing = status === 'Processing' || status === 'Shipped' || status === 'Delivered';
    const isShipped = status === 'Shipped' || status === 'Delivered';

    return [
      {
        id: 'placed',
        day: order.date?.split(' ')[0] || 'Order Date',
        hour: order.date?.split(' ')[1] || 'Completed',
        title: 'Order Placed',
        desc: `Your order was successfully placed. Order ID #${order.id}`,
        status: 'completed',
      },
      {
        id: 'processing',
        day: 'Verification',
        hour: 'Fulfillment',
        title: 'Processing',
        desc: isCancelled
          ? 'Order cancellation requested.'
          : 'Fulfillment team verified and items are prepared for packaging.',
        status: isCancelled ? 'pending' : isProcessing ? 'completed' : 'pending',
      },
      {
        id: 'shipped',
        day: 'Courier Transit',
        hour: 'Dispatch',
        title: 'Shipped & In Transit',
        desc: order.trackingNumber
          ? `Dispatched with consignment tracking code ${order.trackingNumber}.`
          : 'Package handed over to delivery partner.',
        status: isShipped ? 'completed' : 'pending',
      },
      {
        id: 'delivered',
        day: 'Delivery',
        hour: isDone ? 'Fulfilled' : 'Estimated',
        title: 'Delivered',
        desc: isDone
          ? 'Package has been delivered to customer destination.'
          : isCancelled
          ? 'Order was cancelled.'
          : 'Awaiting doorstep fulfillment by courier rider.',
        status: isDone ? 'completed' : 'pending',
      },
    ];
  };

  const timelineSteps = getTimelineSteps();

  return (
    <DashboardLayout activeTab="order-details" title={`Order #${order.id}`}>
      <div className="space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Orders</span>
          </button>

          <span className="text-xs text-brand-body font-satoshi">
            Order Status: <strong className={`font-satoshi-bold ${
              isDone ? 'text-[#093624]' : isCancelled ? 'text-red-600' : 'text-primary'
            }`}>{order.orderStatus}</strong>
          </span>
        </div>

        {/* 1. Order ID & Status Banner */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-brand-black mb-1.5">
              Order ID: <span className="text-primary">#{order.id}</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-body font-satoshi">
              {order.date} via <strong className="text-brand-black font-satoshi-med">{order.paymentMethod}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-satoshi-bold ${
                isDone
                  ? 'bg-[#093624] text-[#F9F295]'
                  : isCancelled
                  ? 'bg-[#F1EFEE] text-[#6D6868] border border-[#E8E5E3]'
                  : 'bg-[#F9F295] text-[#093624]'
              }`}
            >
              {order.orderStatus}
            </span>
            <span
              className={`px-3 py-1.5 text-xs font-bold font-satoshi-bold ${
                order.paymentStatus === 'Paid'
                  ? 'bg-[#093624]/10 text-[#093624]'
                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}
            >
              {order.paymentStatus}
            </span>

            {isDone && (
              <Button
                variant="primary"
                size="sm"
                icon={<RotateCcw size={14} />}
                onClick={() => {
                  setSelectedOrderId(order.id);
                  navigate('/dashboard/return-request');
                }}
              >
                Return Request
              </Button>
            )}
          </div>
        </div>

        {/* 2. Products List */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
              Ordered Products ({order.items.reduce((s, it) => s + it.quantity, 0)})
            </h3>
            <span className="text-xs text-brand-body font-satoshi">
              {order.items.length} unique item{order.items.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-[#F0EDED]">
            {order.items.map((it, idx) => (
              <div
                key={idx}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Product left */}
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#F9F9F9] border border-[#EAE6E4] shrink-0 overflow-hidden flex items-center justify-center">
                    {it.product.frontImage ? (
                      <img
                        src={it.product.frontImage}
                        alt={it.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-brand-body">No image</span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs font-satoshi">
                    <p className="text-[11px] text-brand-body">
                      Category: <span className="text-primary font-satoshi-med">{it.product.category || 'Luxury Collection'}</span>
                    </p>
                    <h4 className="text-sm sm:text-base font-bold font-satoshi-bold text-brand-black">
                      {it.product.name}
                    </h4>
                    <p className="text-brand-body text-[11px]">
                      Color: <strong className="text-brand-black">{it.selectedColor || 'Standard'}</strong> | Size: <strong className="text-brand-black">{it.selectedSize || 'Standard'}</strong>
                    </p>
                  </div>
                </div>

                {/* Product pricing */}
                <div className="flex items-center gap-6 sm:gap-10 text-xs font-satoshi w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div>
                    <span className="block text-brand-body text-[11px]">Price:</span>
                    <span className="font-bold text-brand-black font-satoshi-bold">{formatPrice(it.product.price)}</span>
                  </div>
                  <div>
                    <span className="block text-brand-body text-[11px]">Quantity:</span>
                    <span className="font-bold text-brand-black font-satoshi-bold">{it.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-brand-body text-[11px]">Total:</span>
                    <span className="font-bold text-primary font-satoshi-bold text-sm">
                      {formatPrice(it.product.price * it.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FAF9F8] px-6 py-4 border-t border-[#F0EDED] flex items-center justify-between text-sm font-bold font-satoshi-bold text-brand-black">
            <span>Subtotal:</span>
            <span className="text-primary text-base">{formatPrice(subtotal)}</span>
          </div>
        </div>

        {/* 3. Shipping & Billing Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-3 font-satoshi">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black border-b border-gray-100 pb-2">
              Shipping Information
            </h3>
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold font-satoshi-bold text-brand-black text-sm">{order.customerName}</p>
                <p className="text-brand-body">{order.customerPhone}</p>
                <p className="text-brand-body">{order.customerEmail}</p>
                <p className="text-brand-body leading-relaxed">{order.customerAddress}</p>
              </div>
            </div>
          </div>

          {/* Payment & Tracking */}
          <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-3 font-satoshi">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black border-b border-gray-100 pb-2">
              Payment & Consignment
            </h3>
            <div className="text-xs space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-brand-body">Payment Channel:</span>
                <span className="font-bold text-brand-black font-satoshi-bold">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-body">Payment Status:</span>
                <span className="font-bold text-primary font-satoshi-bold">{order.paymentStatus}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-brand-body">Tracking Code:</span>
                  <span className="font-mono font-bold text-[#093624] bg-[#F9F295] px-2 py-0.5">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
              {order.note && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="block text-brand-body text-[11px]">Special Instructions:</span>
                  <p className="text-brand-black italic">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Live Order Status Timeline */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
              Live Order Timeline
            </h3>
            <span className="text-xs text-brand-body font-satoshi">
              Real-time database sync
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="relative pl-6 sm:pl-32 space-y-8 before:absolute before:left-[11px] sm:before:left-[107px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
              {timelineSteps.map((step) => {
                const isCompleted = step.status === 'completed';
                return (
                  <div key={step.id} className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 group">
                    {/* Timestamp left */}
                    <div className="hidden sm:block absolute -left-32 w-24 text-right pr-4">
                      <span className="block text-xs font-bold font-satoshi-bold text-brand-black">
                        {step.day}
                      </span>
                      <span className="block text-[11px] text-brand-body font-satoshi">
                        {step.hour}
                      </span>
                    </div>

                    {/* Timeline Node */}
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 -ml-6 sm:-ml-3 transition-colors ${
                        isCompleted
                          ? 'bg-primary text-secondary ring-4 ring-primary/10'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={14} className="stroke-[2.5]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="text-xs font-satoshi space-y-1">
                      <div className="flex sm:hidden items-center gap-2 text-brand-body text-[11px] mb-0.5">
                        <Clock size={12} />
                        <span>{step.day} - {step.hour}</span>
                      </div>
                      <h4 className="text-sm font-bold font-satoshi-bold text-brand-black">
                        {step.title}
                      </h4>
                      <p className="text-brand-body max-w-xl leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Order Summary */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
              Order Financial Summary
            </h3>
            <div className="flex items-center gap-2 text-xs font-satoshi">
              <span className="text-brand-body">Status:</span>
              <span
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider font-satoshi-bold ${
                  isDone
                    ? 'bg-[#093624] text-[#F9F295]'
                    : isCancelled
                    ? 'bg-[#F1EFEE] text-[#6D6868] border border-[#E8E5E3]'
                    : 'bg-[#F9F295] text-[#093624]'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3 text-xs font-satoshi">
            <div className="flex items-center justify-between text-brand-body">
              <span>Order ID:</span>
              <span className="font-bold text-brand-black font-satoshi-bold">#{order.id}</span>
            </div>
            <div className="flex items-center justify-between text-brand-body">
              <span>Order Placed:</span>
              <span className="text-brand-black font-medium">{order.date}</span>
            </div>
            <div className="flex items-center justify-between text-brand-body">
              <span>Subtotal:</span>
              <span className="text-brand-black font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-brand-body">
                <span>Coupon / Promotional Discount:</span>
                <span className="text-[#093624] font-bold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-brand-body">
              <span>Delivery Fee:</span>
              <span className="text-brand-black font-medium">
                {shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}
              </span>
            </div>

            <div className="border-t border-[#EBEBEB] pt-4 flex items-center justify-between text-base font-bold font-satoshi-bold text-brand-black">
              <span>Total Amount:</span>
              <span className="text-xl text-primary font-satoshi-bold">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
