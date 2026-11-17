import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { FileText, Eye, Printer, MapPin } from 'lucide-react';

export const DashboardInvoicePage: React.FC = () => {
  const { navigate, formatPrice } = useShop();

  const INVOICES = [
    {
      code: 'BJ-049',
      date: 'Jan 11, 2026',
      customer: 'Floyd Miles',
      phone: '(808) 555-0111',
      address: '29 SE 2nd Ave, Gulshan 2, Dhaka 1212',
      amount: 4850,
      paymentMethod: 'Cash on delivery',
      status: 'Paid',
    },
    {
      code: 'BJ-050',
      date: 'Jan 08, 2026',
      customer: 'Floyd Miles',
      phone: '(808) 555-0111',
      address: '29 SE 2nd Ave, Gulshan 2, Dhaka 1212',
      amount: 7200,
      paymentMethod: 'bKash Online',
      status: 'Paid',
    },
    {
      code: 'BJ-051',
      date: 'Jan 02, 2026',
      customer: 'Floyd Miles',
      phone: '(808) 555-0111',
      address: '29 SE 2nd Ave, Gulshan 2, Dhaka 1212',
      amount: 3200,
      paymentMethod: 'Cash on delivery',
      status: 'Paid',
    },
  ];

  return (
    <DashboardLayout activeTab="invoices" title="Invoices">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            Invoices
          </h3>
          <span className="text-xs text-brand-body font-satoshi">
            Total Invoices: <strong className="text-brand-black font-satoshi-bold">{INVOICES.length}</strong>
          </span>
        </div>

        {/* Invoice Cards Stack matching .aq-dashboard-order-card */}
        <div className="space-y-5">
          {INVOICES.map((inv) => (
            <div
              key={inv.code}
              className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden"
            >
              {/* Invoice Header */}
              <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold font-satoshi-bold text-brand-black text-sm">
                  Invoice Code: <span className="text-primary">{inv.code}</span>
                </span>
                <span className="text-brand-body font-satoshi">
                  Date: <strong className="text-brand-black font-satoshi-med">{inv.date}</strong>
                </span>
              </div>

              {/* Invoice Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Customer Details */}
                <div className="md:col-span-7 flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div className="text-xs space-y-1 font-satoshi">
                    <p className="font-bold text-sm font-satoshi-bold text-brand-black">
                      {inv.customer}
                    </p>
                    <p className="text-brand-body">{inv.phone}</p>
                    <p className="text-brand-body">{inv.address}</p>
                  </div>
                </div>

                {/* Amount and Method */}
                <div className="md:col-span-5 bg-[#FAF9F8] p-4 border border-[#F0EDED] space-y-2 text-xs font-satoshi">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-body">Invoice Total:</span>
                    <span className="font-bold font-satoshi-bold text-primary text-sm">
                      {formatPrice(inv.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-body">Payment Channel:</span>
                    <span className="font-medium text-brand-black">{inv.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="bg-white px-6 py-4 border-t border-[#F0EDED] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-satoshi">
                  <span className="text-brand-body">Status:</span>
                  <span className="px-3 py-1 bg-[#093624] text-[#F9F295] text-[11px] font-bold uppercase tracking-wider font-satoshi-bold">
                    {inv.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="black"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => navigate('/dashboard/invoice-details')}
                  >
                    View Invoice
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
