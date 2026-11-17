import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { RotateCcw, Package, Calendar, Eye, Plus } from 'lucide-react';

export const DashboardReturnPage: React.FC = () => {
  const { navigate } = useShop();

  const RETURN_REQUESTS = [
    {
      returnId: '#BZ-10000049',
      date: 'Jan 11, 2026 at 3.34am',
      orderId: '#bj-10049',
      itemCount: '1 item',
      status: 'Delivered',
      reason: 'Damaged item during courier transit',
    },
    {
      returnId: '#BZ-10000048',
      date: 'Dec 28, 2025 at 11.20am',
      orderId: '#bj-10042',
      itemCount: '1 item',
      status: 'Completed',
      reason: 'Size exchange requested',
    },
  ];

  return (
    <DashboardLayout activeTab="return" title="Order Return Request">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
              Order Return Request
            </h3>
            <p className="text-xs text-brand-body font-satoshi mt-0.5">
              Review existing returns or initiate a replacement for eligible purchases
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => navigate('/dashboard/return-request')}
          >
            Create Return Request
          </Button>
        </div>

        {/* Return Requests Stack matching .aq-dashboard-returen */}
        <div className="space-y-4">
          {RETURN_REQUESTS.map((ret) => (
            <div
              key={ret.returnId}
              className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <h4 className="text-base font-bold font-satoshi-bold text-brand-black">
                  Return Request <span className="text-primary">{ret.returnId}</span>
                </h4>
                <p className="text-xs text-brand-body font-satoshi">{ret.date}</p>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-satoshi items-center">
                <div className="flex items-center gap-2.5">
                  <Package size={16} className="text-primary shrink-0" />
                  <p className="text-brand-body">
                    Original Order: <strong className="text-brand-black font-satoshi-med">{ret.orderId}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <RotateCcw size={16} className="text-primary shrink-0" />
                  <p className="text-brand-body">
                    Items Count: <strong className="text-brand-black font-satoshi-med">{ret.itemCount}</strong>
                  </p>
                </div>

                <div className="flex items-center sm:justify-end">
                  <span className="px-3 py-1 bg-[#093624] text-[#F9F295] text-[11px] font-bold uppercase tracking-wider font-satoshi-bold">
                    {ret.status}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-brand-body font-satoshi italic">
                  Reason: {ret.reason}
                </p>

                <Button
                  variant="black"
                  size="sm"
                  icon={<Eye size={14} />}
                  onClick={() => navigate('/dashboard/return-product')}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
