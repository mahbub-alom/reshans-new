import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Package, RotateCcw, ArrowLeft, CheckCircle2, Clock, MapPin, Truck } from 'lucide-react';

export const DashboardReturnProductPage: React.FC = () => {
  const { navigate, formatPrice, selectedOrder, returnRequests, orders } = useShop();

  // Find corresponding return request: match by selectedOrder id or get latest return request
  const matchedReturn = returnRequests.find((r) => r.orderId === selectedOrder?.id) ||
    (returnRequests.length > 0 ? returnRequests[0] : null);

  const matchedOrder = orders.find((o) => o.id === matchedReturn?.orderId) || selectedOrder;

  if (!matchedReturn && !matchedOrder) {
    return (
      <DashboardLayout activeTab="return-product" title="Return Product Status">
        <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs space-y-4">
          <p className="text-brand-body text-sm font-satoshi">No return request data found.</p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/return')}>
              View All Returns
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/orders')}>
              My Orders
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const items = matchedReturn?.items || (matchedOrder?.items?.map((it) => ({
    productId: it.product.id,
    productName: it.product.name,
    productImage: it.product.frontImage,
    selectedSize: it.selectedSize || '',
    quantity: it.quantity,
    price: it.product.price,
  })) ?? []);

  const totalRefund = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Approved':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Processing':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Picked Up':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Rejected':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const returnStatus = matchedReturn?.status || 'Pending';

  return (
    <DashboardLayout activeTab="return-product" title="Return Product Status">
      <div className="space-y-6 max-w-5xl">
        {/* Header Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
              Return Request Inspection
            </h3>
            {matchedReturn && (
              <p className="text-xs text-brand-body mt-0.5">
                Reference ID: <span className="font-bold text-brand-black">{matchedReturn.returnNumber}</span>
              </p>
            )}
          </div>

          <button
            onClick={() => navigate('/dashboard/return')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Return List</span>
          </button>
        </div>

        {/* 1. Order & Return Summary Box */}
        <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold font-satoshi-bold text-brand-black">
              <Package size={18} className="text-primary" />
              <span>Original Order & Return Info</span>
            </div>
            <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider font-satoshi-bold border ${getStatusBadge(returnStatus)}`}>
              {returnStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-satoshi">
            <div>
              <span className="block text-brand-body text-[11px] mb-1"># Order Number</span>
              <span className="font-bold font-satoshi-bold text-brand-black">#{matchedReturn?.orderId || matchedOrder?.id}</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Return Requested</span>
              <span className="font-medium text-brand-black">
                {matchedReturn?.createdAt ? new Date(matchedReturn.createdAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Return Reason</span>
              <span className="font-bold font-satoshi-bold text-[#141414]">
                {matchedReturn?.reason || 'Product Flaw / Return'}
              </span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Customer</span>
              <span className="font-medium text-brand-black">{matchedReturn?.customerName || matchedOrder?.customerName}</span>
            </div>

            <div>
              <span className="block text-brand-body text-[11px] mb-1">Estimated Refund</span>
              <span className="font-bold font-satoshi-bold text-primary">
                {formatPrice(totalRefund)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Items List */}
        <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
          <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold font-satoshi-bold text-brand-black">
              <RotateCcw size={16} className="text-primary" />
              <span>Items Included in Return ({items.length})</span>
            </div>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {items.map((it, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F9F9F9] border border-[#EBEBEB] shrink-0 overflow-hidden flex items-center justify-center">
                    {it.productImage ? (
                      <img
                        src={it.productImage}
                        alt={it.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-brand-body">No image</span>
                    )}
                  </div>
                  <div className="text-xs space-y-1 font-satoshi">
                    <h4 className="font-bold text-sm font-satoshi-bold text-brand-black">
                      {it.productName}
                    </h4>
                    <p className="text-brand-body">
                      Size: <strong className="text-brand-black">{it.selectedSize || 'Standard'}</strong> | Unit Price: <strong className="text-primary">{formatPrice(it.price)}</strong> | Qty: {it.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-satoshi">
                  <span className="block text-brand-body text-[10px]">Item Refund</span>
                  <span className="font-bold text-brand-black font-satoshi-bold text-sm">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Status Guidance / Address Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-[#EBEBEB] shadow-2xs space-y-2 text-xs font-satoshi">
            <div className="flex items-center gap-2 font-bold font-satoshi-bold text-brand-black text-sm">
              <Truck size={16} className="text-primary" />
              <span>Pickup & Inspection Process</span>
            </div>
            <p className="text-brand-body leading-relaxed">
              Once approved by our atelier team, our courier partner will contact you to collect the parcel. Please keep the garment in its original Reshans Atelier packaging with tags intact.
            </p>
            {matchedReturn?.adminNotes && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-satoshi">
                <span className="font-bold font-satoshi-bold block mb-0.5">Admin Note:</span>
                {matchedReturn.adminNotes}
              </div>
            )}
          </div>

          <div className="p-5 bg-white border border-[#EBEBEB] shadow-2xs space-y-2 text-xs font-satoshi">
            <div className="flex items-center gap-2 font-bold font-satoshi-bold text-brand-black text-sm">
              <MapPin size={16} className="text-primary" />
              <span>Pickup Address</span>
            </div>
            <p className="text-brand-black font-medium">
              {matchedReturn?.pickupAddress || matchedOrder?.customerAddress || 'Customer registered address'}
            </p>
            <p className="text-brand-body">
              Contact Phone: <span className="font-bold text-brand-black">{matchedReturn?.customerPhone || matchedOrder?.customerPhone || 'On file'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/return')}>
            Back to Return List
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
