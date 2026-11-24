import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Package, RotateCcw, ArrowLeft, CheckCircle } from 'lucide-react';

export const DashboardReturnProductPage: React.FC = () => {
  const { navigate, formatPrice, selectedOrder, orders } = useShop();

  const order = selectedOrder || (orders.length > 0 ? orders[0] : null);
  const firstItem = order?.items && order.items.length > 0 ? order.items[0] : null;

  if (!order) {
    return (
      <DashboardLayout activeTab="return-product" title="Return Product Status">
        <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs space-y-4">
          <p className="text-brand-body text-sm font-satoshi">No return product data found.</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/orders')}>
            Back to Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const refundAmount = firstItem ? firstItem.product.price * firstItem.quantity : order.total;

  return (
    <DashboardLayout activeTab="return-product" title="Return Product Status">
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            Return Product Details
          </h3>

          <button
            onClick={() => navigate('/dashboard/return')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Return List</span>
          </button>
        </div>

        {/* 1. Order Information Box */}
        <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold font-satoshi-bold text-brand-black">
            <Package size={18} className="text-primary" />
            <span>Order Information</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-satoshi">
            <div>
              <span className="block text-brand-body text-[11px] mb-1"># Order number</span>
              <span className="font-bold font-satoshi-bold text-brand-black">#{order.id}</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Order Date</span>
              <span className="font-medium text-brand-black">{order.date}</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Return Reason</span>
              <span className="font-bold font-satoshi-bold text-[#141414]">Damaged / Transit Flaw</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Customer</span>
              <span className="font-medium text-brand-black">{order.customerName}</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Order Status</span>
              <span className="inline-block px-2 py-0.5 bg-[#093624] text-[#F9F295] text-[10px] font-bold uppercase tracking-wider font-satoshi-bold">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Return Item Card */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold font-satoshi-bold text-brand-black">
              <RotateCcw size={16} className="text-primary" />
              <span>Return Item Under Inspection</span>
            </div>
            <span className="px-2.5 py-1 bg-[#F9F295] text-[#093624] text-[11px] font-bold uppercase tracking-wider font-satoshi-bold">
              In Review
            </span>
          </div>

          <div className="p-6">
            {firstItem ? (
              <div className="p-4 border border-[#EBEBEB] bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 bg-[#F9F9F9] border border-[#EBEBEB] shrink-0 overflow-hidden flex items-center justify-center">
                    {firstItem.product.frontImage ? (
                      <img
                        src={firstItem.product.frontImage}
                        alt={firstItem.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-brand-body">No image</span>
                    )}
                  </div>
                  <div className="text-xs space-y-1 font-satoshi">
                    <span className="text-[10px] text-gray-400">SKU: {firstItem.product.sku || firstItem.product.id}</span>
                    <h4 className="font-bold text-sm font-satoshi-bold text-brand-black">
                      {firstItem.product.name}
                    </h4>
                    <p className="text-brand-body">
                      Original Price: <strong className="text-primary font-satoshi-med">{formatPrice(firstItem.product.price)}</strong> (Qty: {firstItem.quantity})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-satoshi w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="bg-[#F9F9F9] px-4 py-2 border border-gray-200">
                    <span className="block text-brand-body text-[10px]">Original Order</span>
                    <span className="font-bold text-brand-black font-satoshi-bold">#{order.id}</span>
                  </div>

                  <div className="bg-[#F9F9F9] px-4 py-2 border border-gray-200 text-right">
                    <span className="block text-brand-body text-[10px]">Estimated Refund</span>
                    <span className="font-bold text-[#093624] font-satoshi-bold text-sm">
                      {formatPrice(refundAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 p-4 bg-[#F9F295]/40 border border-[#093624]/25 text-xs font-satoshi text-[#141414] flex items-start gap-3">
              <CheckCircle size={18} className="text-[#093624] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-satoshi-bold mb-0.5">
                  Dhaka Doorstep Pickup Scheduled
                </strong>
                Our delivery partner will arrive at {order.customerAddress || 'your address'} within 24-48 hours to collect the item. Your refund of {formatPrice(refundAmount)} will be credited immediately upon inspection.
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/dashboard/orders')}
              >
                Back to Orders
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/contact')}
              >
                Contact Concierge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
