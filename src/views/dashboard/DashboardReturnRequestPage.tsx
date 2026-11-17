import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Package, Calendar, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

export const DashboardReturnRequestPage: React.FC = () => {
  const { navigate, formatPrice } = useShop();

  const [returnReason, setReturnReason] = useState('Damaged product');
  const [selectedProduct, setSelectedProduct] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigate('/dashboard/return-product');
    }, 1800);
  };

  return (
    <DashboardLayout activeTab="return-request" title="Request Return">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
          Request Return Product’s
        </h3>

        {/* 1. Order Information Box matching .aq-dashboard-returen-r-card */}
        <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold font-satoshi-bold text-brand-black">
            <Package size={18} className="text-primary" />
            <span>Order Information</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-satoshi">
            <div>
              <span className="block text-brand-body text-[11px] mb-1"># Order number</span>
              <span className="font-bold font-satoshi-bold text-brand-black">#bj-100000049</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Order Date</span>
              <span className="font-medium text-brand-black">Jan 11, 2026 at 3.34am</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Completed at</span>
              <span className="font-medium text-brand-black">Jan 11, 2026 at 3.34am</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Shipment Status</span>
              <span className="inline-block px-2 py-0.5 bg-[#093624] text-[#F9F295] text-[10px] font-bold uppercase tracking-wider font-satoshi-bold">
                Delivered
              </span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Payment Status</span>
              <span className="inline-block px-2 py-0.5 bg-[#093624] text-[#F9F295] text-[10px] font-bold uppercase tracking-wider font-satoshi-bold">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* 2. Return Request Form matching .aq-dashboard-returen-from-card */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center gap-2 text-sm font-bold font-satoshi-bold text-brand-black">
            <RotateCcw size={16} className="text-primary" />
            <span>Return Request Form</span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {isSuccess && (
              <div className="p-4 bg-[#F9F295]/50 border border-[#093624] text-[#093624] text-xs font-satoshi-bold">
                Return request submitted successfully! Opening summary...
              </div>
            )}

            {/* Select Reason */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                Return Reason *
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full sm:w-80 h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
              >
                <option value="Damaged product">Damaged product</option>
                <option value="No longer want">No longer want</option>
                <option value="Defective">Defective / Stitch flaw</option>
                <option value="Incorrect product">Incorrect product received</option>
                <option value="Arived late">Arrived late</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Select products to return */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                Select products to return *
              </label>

              {/* Product Card Row */}
              <div
                onClick={() => setSelectedProduct(!selectedProduct)}
                className={`p-4 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer ${
                  selectedProduct
                    ? 'border-primary bg-primary/5'
                    : 'border-[#EBEBEB] bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.checked)}
                    className="w-4 h-4 rounded-none accent-primary cursor-pointer shrink-0"
                  />
                  <div className="w-16 h-16 bg-white border border-[#EBEBEB] shrink-0 overflow-hidden">
                    <img
                      src="/assets/img/others/dashboard-p-2.jpg"
                      alt="Classic Urban Oversized Shirt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-0.5 font-satoshi">
                    <span className="text-[10px] text-gray-400">SKU: 2K-135</span>
                    <h4 className="font-bold text-sm font-satoshi-bold text-brand-black">
                      Classic Urban Oversized Shirt
                    </h4>
                    <p className="text-brand-body text-[11px]">
                      <strong className="text-primary font-satoshi-med">{formatPrice(2450)}</strong> per item
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-satoshi w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="bg-white px-3 py-1.5 border border-gray-200">
                    <span className="text-brand-body text-[11px] mr-2">Quantity:</span>
                    <span className="font-bold text-brand-black font-satoshi-bold">1</span>
                  </div>

                  <div className="bg-white px-3 py-1.5 border border-gray-200">
                    <span className="text-brand-body text-[11px] mr-2">Refund Amount:</span>
                    <span className="font-bold text-[#093624] font-satoshi-bold">
                      {formatPrice(2450)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note & Submit Button matching reference */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-brand-body font-satoshi text-center sm:text-left">
                Please review your selection before submitting the return request. Reshans ensures free Dhaka pickups.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!selectedProduct}
                icon={<ArrowRight size={16} />}
              >
                Submit Return Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
