import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { RotateCcw, Package, Calendar, Eye, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const DashboardReturnPage: React.FC = () => {
  const { navigate, returnRequests, orders, setSelectedOrderId } = useShop();

  const handleCreateReturn = () => {
    // If there is any delivered order, direct to request form
    const deliveredOrder = orders.find((o) => o.orderStatus?.toLowerCase() === 'delivered');
    if (deliveredOrder) {
      setSelectedOrderId(deliveredOrder.id);
    }
    navigate('/dashboard/return-request');
  };

  const handleViewReturnDetails = (ret: any) => {
    setSelectedOrderId(ret.orderId);
    navigate('/dashboard/return-product');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#093624] text-[#F9F295]';
      case 'Approved':
      case 'Picked Up':
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-[#F9F295] text-[#093624] border border-[#093624]/20';
    }
  };

  return (
    <DashboardLayout activeTab="return" title="Order Return Request">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
              Order Return Requests
            </h3>
            <p className="text-xs text-brand-body font-satoshi mt-0.5">
              Review your return history or submit a new return request for delivered orders.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleCreateReturn}
          >
            Create Return Request
          </Button>
        </div>

        {/* Info Notification: eligibility reminder */}
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-satoshi flex items-start gap-2.5">
          <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Return Policy:</strong> You can request a return or size exchange once an order is marked <strong>Delivered</strong>. Unreceived or in-transit orders cannot be returned.
          </p>
        </div>

        {/* Return Requests Stack */}
        {returnRequests.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs space-y-3">
            <RotateCcw size={32} className="mx-auto text-gray-300" />
            <h4 className="text-base font-bold font-satoshi-bold text-brand-black">No Return Requests Found</h4>
            <p className="text-xs text-brand-body font-satoshi max-w-sm mx-auto">
              You haven&apos;t submitted any return or replacement requests yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateReturn}
            >
              Request a Return
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {returnRequests.map((ret) => (
              <div
                key={ret.id}
                className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <h4 className="text-base font-bold font-satoshi-bold text-brand-black flex items-center gap-2">
                    <span>Return Request</span>
                    <span className="font-mono text-primary font-bold">#{ret.returnNumber}</span>
                  </h4>
                  <p className="text-xs text-brand-body font-satoshi flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>{ret.createdAt}</span>
                  </p>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-satoshi items-center">
                  <div className="flex items-center gap-2.5">
                    <Package size={16} className="text-primary shrink-0" />
                    <p className="text-brand-body">
                      Original Order: <strong className="text-brand-black font-satoshi-med">#{ret.orderId}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <RotateCcw size={16} className="text-primary shrink-0" />
                    <p className="text-brand-body">
                      Items Count: <strong className="text-brand-black font-satoshi-med">{ret.items.length} item{ret.items.length > 1 ? 's' : ''}</strong>
                    </p>
                  </div>

                  <div className="flex items-center sm:justify-end">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider font-satoshi-bold ${getStatusBadge(ret.status)}`}>
                      {ret.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 gap-3">
                  <p className="text-xs text-brand-body font-satoshi italic">
                    Reason: <strong className="text-brand-black font-satoshi-med not-italic">{ret.reason}</strong>
                    {ret.adminNotes && <span className="ml-3 text-primary">• Note: {ret.adminNotes}</span>}
                  </p>

                  <Button
                    variant="black"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => handleViewReturnDetails(ret)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
