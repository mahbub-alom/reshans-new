import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Printer, Download, ArrowLeft } from 'lucide-react';

export const DashboardInvoiceDetailsPage: React.FC = () => {
  const { navigate, formatPrice } = useShop();

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <DashboardLayout activeTab="invoice-details" title="Invoice BJ-049">
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            Invoices: <span className="text-primary">BJ-049</span>
          </h3>

          <button
            onClick={() => navigate('/dashboard/invoices')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Invoices</span>
          </button>
        </div>

        {/* 1. Invoice Meta & To Grid matching .aq-dashboard-invoice-card */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Group: Invoice Details */}
            <div className="space-y-4">
              <h4 className="text-base font-bold font-satoshi-bold text-brand-black uppercase tracking-wider border-b border-gray-100 pb-2">
                Invoice Overview
              </h4>
              <ul className="space-y-2.5 text-xs font-satoshi">
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Invoice Code:</span>
                  <span className="font-bold font-satoshi-bold text-brand-black">BJ-049</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Issue At:</span>
                  <span className="font-medium text-brand-black">Jan 11, 2026 at 10.30am</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Payment Status:</span>
                  <span className="px-2.5 py-0.5 bg-[#093624] text-[#F9F295] text-[11px] font-bold font-satoshi-bold">
                    Paid
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Payment Method:</span>
                  <span className="font-medium text-brand-black">Cash on delivery</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Linked Order:</span>
                  <button
                    onClick={() => navigate('/dashboard/order-details')}
                    className="font-bold text-primary font-satoshi-bold hover:underline"
                  >
                    Order #BZ-10049
                  </button>
                </li>
              </ul>
            </div>

            {/* Right Group: Invoice To */}
            <div className="space-y-4">
              <h4 className="text-base font-bold font-satoshi-bold text-brand-black uppercase tracking-wider border-b border-gray-100 pb-2">
                Billed To
              </h4>
              <ul className="space-y-2.5 text-xs font-satoshi">
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Full Name:</span>
                  <span className="font-bold font-satoshi-bold text-brand-black">Floyd Miles</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Email:</span>
                  <span className="font-medium text-brand-black">floydmiles@gmail.com</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Phone:</span>
                  <span className="font-medium text-brand-black">(+880) 1700 000 000</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-brand-body">Address:</span>
                  <span className="font-medium text-brand-black text-right">
                    29 SE 2nd Ave, Gulshan 2, Dhaka 1212
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Invoice Summary Card matching .aq-dashboard-invoice-summary-card */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED]">
            <h4 className="text-base font-bold font-satoshi-bold text-brand-black">
              Line Item Description
            </h4>
          </div>

          <div className="p-6 space-y-4 text-xs font-satoshi">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="font-bold font-satoshi-bold text-sm text-brand-black">
                  Osette Leather Crossbody Bag & Urban Shirt
                </p>
                <p className="text-brand-body text-[11px]">Reshans Curated Luxury Dhaka Edition</p>
              </div>
              <span className="font-bold text-brand-black font-satoshi-bold text-sm">
                {formatPrice(4850)}
              </span>
            </div>

            <div className="space-y-2 text-brand-body pt-1">
              <div className="flex items-center justify-between">
                <span>Quantity:</span>
                <span className="text-brand-black font-medium">3 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="text-brand-black font-medium">{formatPrice(4850)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard Delivery:</span>
                <span className="text-brand-black font-medium">{formatPrice(60)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Promotional Discount:</span>
                <span className="text-[#093624] font-bold">-{formatPrice(60)}</span>
              </div>
            </div>

            <div className="border-t border-[#EBEBEB] pt-4 flex items-center justify-between text-base font-bold font-satoshi-bold text-brand-black">
              <span>Grand Total:</span>
              <span className="text-xl text-primary">{formatPrice(4850)}</span>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons matching .aq-dashboard-summary-btns */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            icon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>

          <Button
            variant="black"
            size="md"
            icon={<Download size={16} />}
            onClick={handlePrint}
          >
            Download Invoice
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/dashboard/invoices')}
          >
            Back to Invoices
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
