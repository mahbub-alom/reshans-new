import React from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Eye, MapPin, PackageCheck, RotateCcw } from 'lucide-react';

export const DashboardOrderPage: React.FC = () => {
  const { navigate, formatPrice, orders, cancelOrder, setTrackedCodeQuery, setSelectedOrderId } = useShop();

  const handleTrack = (trackingCode: string) => {
    setTrackedCodeQuery(trackingCode);
    navigate('/track-order');
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    navigate('/dashboard/order-details');
  };

  return (
    <DashboardLayout activeTab="orders" title="My Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            My Orders
          </h3>
          <span className="text-xs text-brand-body font-satoshi">
            Showing <strong className="text-brand-black font-satoshi-bold">{orders.length}</strong> orders
          </span>
        </div>

        {/* Orders Card Stack */}
        {orders.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] p-12 text-center shadow-2xs">
            <p className="text-brand-body text-sm font-satoshi mb-4">You have no orders yet.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/shop')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
          {orders.map((order) => {
            const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const isDone = order.orderStatus === 'Delivered';
            const isCancelled = order.orderStatus === 'Cancelled';
            const isPending = order.orderStatus === 'Pending';

            return (
              <div
                key={order.id}
                className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold font-satoshi-bold text-brand-black text-sm">
                      Order ID: <span className="text-[#093624]">#{order.id}</span>
                    </span>
                    {order.trackingNumber && (
                      <span className="px-2 py-0.5 bg-[#F9F295] text-[#093624] font-mono text-[11px] font-bold">
                        {order.trackingNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-brand-body font-satoshi">
                    Date: <strong className="text-brand-black font-satoshi-med">{order.date}</strong>
                  </span>
                </div>

                {/* Order Card Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Customer & Shipping info (7 cols) */}
                  <div className="md:col-span-7 flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-[#093624]/10 text-[#093624] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={18} />
                    </div>
                    <div className="text-xs space-y-1 font-satoshi">
                      <p className="font-bold text-sm font-satoshi-bold text-brand-black">
                        {order.customerName}
                      </p>
                      <p className="text-brand-body">{order.customerPhone}</p>
                      <p className="text-brand-body">{order.customerAddress}</p>
                    </div>
                  </div>

                  {/* Stats info (5 cols) */}
                  <div className="md:col-span-5 bg-[#FAF9F8] p-4 border border-[#F0EDED] space-y-2 text-xs font-satoshi">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-body">Amount:</span>
                      <span className="font-bold font-satoshi-bold text-brand-black tabular-nums">
                        {formatPrice(order.total)}{' '}
                        {order.paymentStatus === 'Paid' && (
                          <span className="text-[#093624] text-[11px] font-medium">(Paid)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-body">Items:</span>
                      <span className="font-medium text-brand-black tabular-nums">{itemsCount} Items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-body">Payment:</span>
                      <span className="font-medium text-brand-black">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Order Card Footer */}
                <div className="bg-white px-6 py-4 border-t border-[#F0EDED] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-satoshi">
                    <span className="text-brand-body">Status:</span>
                    <span
                      className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider font-satoshi-bold rounded-none ${
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

                  <div className="flex flex-wrap items-center gap-3">
                    {isPending && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:border-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider font-satoshi-bold transition-colors cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    )}

                    {order.trackingNumber && (
                      <button
                        onClick={() => handleTrack(order.trackingNumber || order.id)}
                        className="px-4 py-2 border border-[#093624] text-[#093624] hover:bg-[#093624] hover:text-[#F9F295] text-xs font-bold uppercase tracking-wider font-satoshi-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <PackageCheck size={14} />
                        <span>Track Order</span>
                      </button>
                    )}

                    {isDone && (
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          navigate('/dashboard/return-request');
                        }}
                        className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold uppercase tracking-wider font-satoshi-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw size={14} />
                        <span>Return Product</span>
                      </button>
                    )}

                    <Button
                      variant="black"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};
