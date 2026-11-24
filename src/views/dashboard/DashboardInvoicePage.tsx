import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { FileText, Eye, Printer, MapPin } from 'lucide-react';

export const DashboardInvoicePage: React.FC = () => {
  const { navigate, formatPrice, orders, setSelectedOrderId } = useShop();

  const handleViewInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate('/dashboard/invoice-details');
  };

  return (
    <DashboardLayout activeTab="invoices" title="Invoices">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            Invoices
          </h3>
          <span className="text-xs text-brand-body font-satoshi">
            Total Invoices: <strong className="text-brand-black font-satoshi-bold">{orders.length}</strong>
          </span>
        </div>

        {/* Invoice Cards Stack matching .aq-dashboard-order-card */}
        {orders.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs">
            <p className="text-brand-body text-sm font-satoshi mb-4">No invoices available.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/shop')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden"
              >
                {/* Invoice Header */}
                <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold font-satoshi-bold text-brand-black text-sm">
                    Invoice Code: <span className="text-primary">{ord.trackingNumber || ord.id}</span>
                  </span>
                  <span className="text-brand-body font-satoshi">
                    Date: <strong className="text-brand-black font-satoshi-med">{ord.date}</strong>
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
                        {ord.customerName}
                      </p>
                      <p className="text-brand-body">{ord.customerPhone}</p>
                      <p className="text-brand-body">
                        {ord.customerAddress}
                        {(ord.area || ord.city || ord.postalCode) ? `, ${[ord.area, ord.city, ord.postalCode].filter(Boolean).join(', ')}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Amount and Method */}
                  <div className="md:col-span-5 bg-[#FAF9F8] p-4 border border-[#F0EDED] space-y-2 text-xs font-satoshi">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-body">Invoice Total:</span>
                      <span className="font-bold font-satoshi-bold text-primary text-sm">
                        {formatPrice(ord.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-body">Payment Channel:</span>
                      <span className="font-medium text-brand-black">{ord.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Footer */}
                <div className="bg-white px-6 py-4 border-t border-[#F0EDED] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-satoshi">
                    <span className="text-brand-body">Status:</span>
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider font-satoshi-bold ${
                      ord.paymentStatus === 'Paid'
                        ? 'bg-[#093624] text-[#F9F295]'
                        : ord.paymentStatus === 'Refunded'
                        ? 'bg-[#F1EFEE] text-[#6D6868] border border-[#E8E5E3]'
                        : 'bg-[#F9F295] text-[#093624]'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="black"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => handleViewInvoice(ord.id)}
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
