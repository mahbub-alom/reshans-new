import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Clock,
  Printer,
  Download,
  RotateCcw,
  MapPin,
  FileText,
} from 'lucide-react';

export const DashboardOrderDetailsPage: React.FC = () => {
  const { navigate, formatPrice } = useShop();

  const ORDER_PRODUCTS = [
    {
      id: 'p1',
      name: 'Osette backpack Bags',
      vendor: 'Girls Clothes',
      sku: 'BAG-902',
      weight: '5KG',
      boxes: '1 Box',
      price: 1600,
      quantity: 2,
      total: 3200,
      image: '/assets/img/others/dashboard-p-1.jpg',
    },
    {
      id: 'p2',
      name: 'Osette backpack Bags',
      vendor: 'Girls Clothes',
      sku: 'BAG-903',
      weight: '5KG',
      boxes: '1 Box',
      price: 1600,
      quantity: 2,
      total: 3200,
      image: '/assets/img/others/dashboard-p-2.jpg',
    },
  ];

  const subtotal = 6400;
  const discount = 400;
  const total = subtotal - discount;

  // 6 Timeline milestones exactly as in reference template
  const TIMELINE_STEPS = [
    {
      id: 'placed',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Order Placed',
      desc: 'Your order is successfully placed to Reshans. Order id #bj-10049',
      status: 'completed',
    },
    {
      id: 'processing',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Processing',
      desc: 'We have received your order, our fulfillment team will verify and pack shortly.',
      status: 'completed',
    },
    {
      id: 'packing',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Packing',
      desc: 'We are currently packing your order.',
      status: 'completed',
    },
    {
      id: 'packed',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Packed',
      desc: 'Your order is packed now.',
      status: 'pending',
    },
    {
      id: 'delivering',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Delivering',
      desc: 'Rider has picked up your order for delivering.',
      status: 'pending',
    },
    {
      id: 'payment',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Payment',
      desc: 'Your order is paid.',
      status: 'pending',
    },
    {
      id: 'delivered',
      day: '14 April',
      hour: '12:20 PM',
      title: 'Delivered',
      desc: 'You have received your order.',
      status: 'pending',
    },
  ];

  return (
    <DashboardLayout activeTab="order-details" title="Order Details">
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
            Order Status: <strong className="text-primary font-satoshi-bold">In Progress</strong>
          </span>
        </div>

        {/* 1. Order ID & Payment Banner matching .aq-dashboard-order-banner */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-brand-black mb-1.5">
              Order ID: <span className="text-primary">#bj-10049</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-body font-satoshi">
              Jan 11, 2026 at 10:30 am from <strong className="text-brand-black font-satoshi-med">Cash on delivery</strong>
            </p>
          </div>
          <span className="px-4 py-1.5 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase tracking-wider font-satoshi-bold">
            Delivered
          </span>
        </div>

        {/* 2. Products List matching .aq-dashboard-product-card */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED]">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
              Products
            </h3>
          </div>

          <div className="divide-y divide-[#F0EDED]">
            {ORDER_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Product left */}
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-[#F9F9F9] border border-[#EAE6E4] shrink-0 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 text-xs font-satoshi">
                    <p className="text-[11px] text-brand-body">
                      Vendor: <span className="text-primary font-satoshi-med">{prod.vendor}</span>
                    </p>
                    <h4 className="text-sm sm:text-base font-bold font-satoshi-bold text-brand-black">
                      {prod.name}
                    </h4>
                    <p className="text-brand-body text-[11px]">Weight: {prod.weight}, Boxes: {prod.boxes}</p>
                  </div>
                </div>

                {/* Product pricing matching .aq-dashboard-product-pricing */}
                <div className="flex items-center gap-6 sm:gap-10 text-xs font-satoshi w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div>
                    <span className="block text-brand-body text-[11px]">Price:</span>
                    <span className="font-bold text-brand-black font-satoshi-bold">{formatPrice(prod.price)}</span>
                  </div>
                  <div>
                    <span className="block text-brand-body text-[11px]">Quantity:</span>
                    <span className="font-bold text-brand-black font-satoshi-bold">{prod.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-brand-body text-[11px]">Total:</span>
                    <span className="font-bold text-primary font-satoshi-bold text-sm">
                      {formatPrice(prod.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FAF9F8] px-6 py-4 border-t border-[#F0EDED] flex items-center justify-between text-sm font-bold font-satoshi-bold text-brand-black">
            <span>Total Amount:</span>
            <span className="text-primary text-base">{formatPrice(subtotal)}</span>
          </div>
        </div>

        {/* 3. Shipping & Billing Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-3 font-satoshi">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black border-b border-gray-100 pb-2">
              Shipping Address
            </h3>
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold font-satoshi-bold text-brand-black text-sm">Floyd Miles</p>
                <p className="text-brand-body">(808) 555-0111</p>
                <p className="text-brand-body leading-relaxed">6391 Elgin St. Celina, Delaware 10299</p>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-3 font-satoshi">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black border-b border-gray-100 pb-2">
              Billing Address
            </h3>
            <div className="flex items-start gap-3.5 pt-1">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold font-satoshi-bold text-brand-black text-sm">Floyd Miles</p>
                <p className="text-brand-body">(808) 555-0111</p>
                <p className="text-brand-body leading-relaxed">6391 Elgin St. Celina, Delaware 10299</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Order Status Timeline matching .aq-dashboard-timeline */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
              Timeline
            </h3>
            <span className="text-xs text-brand-body font-satoshi">
              Live status tracking
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="relative pl-6 sm:pl-32 space-y-8 before:absolute before:left-[11px] sm:before:left-[107px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
              {TIMELINE_STEPS.map((step, idx) => {
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
                        <span>{step.day} at {step.hour}</span>
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

        {/* 5. Order Summary matching .aq-dashboard-summary-card */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
              Order Summary
            </h3>
            <div className="flex items-center gap-2 text-xs font-satoshi">
              <span className="text-brand-body">Status:</span>
              <span className="px-3 py-1 bg-[#093624] text-[#F9F295] text-[11px] font-bold uppercase tracking-wider font-satoshi-bold">
                Delivered
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3 text-xs font-satoshi">
            <div className="flex items-center justify-between text-brand-body">
              <span>Order ID:</span>
              <span className="font-bold text-brand-black font-satoshi-bold">#bj-10049</span>
            </div>
            <div className="flex items-center justify-between text-brand-body">
              <span>Order At:</span>
              <span className="text-brand-black font-medium">Jan 11, 2026</span>
            </div>
            <div className="flex items-center justify-between text-brand-body">
              <span>Subtotal (MRP):</span>
              <span className="text-brand-black font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-brand-body">
              <span>Discount applied:</span>
              <span className="text-[#093624] font-bold">-{formatPrice(discount)}</span>
            </div>
            <div className="flex items-center justify-between text-brand-body">
              <span>Delivery Charge (First Order):</span>
              <span className="text-[#093624] font-bold font-satoshi-bold">Free</span>
            </div>

            <div className="border-t border-[#EBEBEB] pt-4 flex items-center justify-between text-base font-bold font-satoshi-bold text-brand-black">
              <span>Amount Paid:</span>
              <span className="text-xl text-primary font-satoshi-bold">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* 6. Summary Buttons matching .aq-dashboard-summary-btns */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            icon={<Printer size={16} />}
            onClick={() => window.print()}
          >
            Print Invoice
          </Button>

          <Button
            variant="black"
            size="md"
            icon={<Download size={16} />}
            onClick={() => window.print()}
          >
            Download Invoice
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<RotateCcw size={15} />}
            onClick={() => navigate('/dashboard/return-request')}
          >
            Return Product
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
