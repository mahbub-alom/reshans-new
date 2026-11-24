import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Package, RotateCcw, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const DashboardReturnRequestPage: React.FC = () => {
  const { navigate, formatPrice, selectedOrder, orders, currentUser, submitReturnRequest } = useShop();

  // Find delivered orders eligible for return
  const deliveredOrders = useMemo(() => {
    // If selectedOrder is delivered, always ensure it is eligible
    const userEmail = currentUser?.email?.toLowerCase().trim();
    
    // First, try to filter orders belonging to current user that are Delivered
    const userDelivered = orders.filter((o) => {
      const isDelivered = o.orderStatus?.toLowerCase() === 'delivered';
      if (!isDelivered) return false;
      if (!userEmail) return true; // if not logged in or no email, allow all delivered
      return !o.customerEmail || o.customerEmail.toLowerCase().trim() === userEmail;
    });

    // If userDelivered has orders, use them
    if (userDelivered.length > 0) {
      return userDelivered;
    }

    // Fallback: If no order matched the email strictly, but orders in state have Delivered status (e.g. guest order, demo orders)
    return orders.filter((o) => o.orderStatus?.toLowerCase() === 'delivered');
  }, [orders, currentUser]);

  // Preferred order: if selectedOrder is delivered, use that; otherwise first delivered order
  const initialOrderId = useMemo(() => {
    if (selectedOrder && selectedOrder.orderStatus?.toLowerCase() === 'delivered') {
      return selectedOrder.id;
    }
    return deliveredOrders.length > 0 ? deliveredOrders[0].id : '';
  }, [selectedOrder, deliveredOrders]);

  const [chosenOrderId, setChosenOrderId] = useState<string>(initialOrderId);

  // Sync chosenOrderId if initialOrderId or selectedOrder changes
  React.useEffect(() => {
    if (selectedOrder && selectedOrder.orderStatus?.toLowerCase() === 'delivered') {
      setChosenOrderId(selectedOrder.id);
    } else if (deliveredOrders.length > 0 && (!chosenOrderId || !deliveredOrders.some(o => o.id === chosenOrderId))) {
      setChosenOrderId(deliveredOrders[0].id);
    }
  }, [selectedOrder, deliveredOrders]);
  const [returnReason, setReturnReason] = useState('Damaged product');
  const [selectedProductIndices, setSelectedProductIndices] = useState<number[]>([]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === chosenOrderId) || (deliveredOrders.length > 0 ? deliveredOrders[0] : null);
  }, [chosenOrderId, orders, deliveredOrders]);

  const toggleSelect = (index: number) => {
    setSelectedProductIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOrderChange = (newId: string) => {
    setChosenOrderId(newId);
    setSelectedProductIndices([]);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    if (selectedProductIndices.length === 0) {
      setSubmitError('Please select at least one item to return.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const itemsToReturn = selectedProductIndices.map((idx) => {
      const it = activeOrder.items[idx];
      return {
        productId: it.product.id,
        productName: it.product.name,
        productImage: it.product.frontImage,
        selectedSize: it.selectedSize || '',
        quantity: it.quantity,
        price: it.product.price,
      };
    });

    const refundAmount = itemsToReturn.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const result = await submitReturnRequest({
      orderId: activeOrder.id,
      customerEmail: currentUser?.email || activeOrder.customerEmail,
      customerName: currentUser?.name || activeOrder.customerName,
      customerPhone: currentUser?.phone || activeOrder.customerPhone || '',
      reason: returnReason,
      notes: customerNotes,
      pickupAddress: currentUser?.city || activeOrder.customerAddress || '',
      refundAmount,
      items: itemsToReturn,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/return');
      }, 1500);
    } else {
      setSubmitError(result.error || 'Failed to submit return request. Please try again.');
    }
  };

  // If no delivered orders exist
  if (deliveredOrders.length === 0) {
    return (
      <DashboardLayout activeTab="return-request" title="Request Return">
        <div className="bg-white border border-[#EBEBEB] p-8 sm:p-12 text-center shadow-2xs space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-satoshi-bold text-brand-black">
              No Delivered Orders Eligible for Return
            </h3>
            <p className="text-brand-body text-sm font-satoshi max-w-md mx-auto">
              Per our policy, return requests can only be initiated for orders that have been successfully <span className="font-bold text-brand-black">Delivered</span> to your address.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/orders')}>
              View My Orders
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/return')}>
              Previous Returns Status
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="return-request" title="Request Return">
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
              Request Return Products
            </h3>
            <p className="text-xs text-brand-body mt-1">
              Select your delivered order and products you wish to return or exchange.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/return')}>
            View All Returns
          </Button>
        </div>

        {/* Order Selector (if customer has multiple delivered orders) */}
        {deliveredOrders.length > 1 && (
          <div className="bg-white border border-[#EBEBEB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
              Select Delivered Order:
            </label>
            <select
              value={activeOrder?.id || ''}
              onChange={(e) => handleOrderChange(e.target.value)}
              className="bg-white border border-[#E0DCD9] px-3 py-2 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary"
            >
              {deliveredOrders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  Order #{ord.id} — {ord.date} — {formatPrice(ord.total)} ({ord.items.length} items)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 1. Order Information Box */}
        {activeOrder && (
          <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-sm font-bold font-satoshi-bold text-brand-black">
              <Package size={18} className="text-primary" />
              <span>Order Information</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-satoshi">
              <div>
                <span className="block text-brand-body text-[11px] mb-1"># Order number</span>
                <span className="font-bold font-satoshi-bold text-brand-black">#{activeOrder.id}</span>
              </div>

              <div>
                <span className="block text-brand-body text-[11px] mb-1">Order Date</span>
                <span className="font-medium text-brand-black">{activeOrder.date}</span>
              </div>

              <div>
                <span className="block text-brand-body text-[11px] mb-1">Customer</span>
                <span className="font-medium text-brand-black">{activeOrder.customerName}</span>
              </div>

              <div>
                <span className="block text-brand-body text-[11px] mb-1">Shipment Status</span>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-satoshi-bold">
                  {activeOrder.orderStatus}
                </span>
              </div>

              <div>
                <span className="block text-brand-body text-[11px] mb-1">Payment Status</span>
                <span className="inline-block px-2 py-0.5 bg-[#093624] text-[#F9F295] text-[10px] font-bold uppercase tracking-wider font-satoshi-bold">
                  {activeOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Return Request Form */}
        {activeOrder && (
          <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
            <div className="bg-[#FAF9F8] px-6 py-4 border-b border-[#F0EDED] flex items-center gap-2 text-sm font-bold font-satoshi-bold text-brand-black">
              <RotateCcw size={16} className="text-primary" />
              <span>Return Request Form</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {isSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-satoshi flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>Return request submitted successfully! Redirecting to return tracking...</span>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs font-satoshi flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{submitError}</span>
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
                  <option value="Defective / Stitch flaw">Defective / Stitch flaw</option>
                  <option value="Incorrect product">Incorrect product received</option>
                  <option value="Size does not fit">Size does not fit</option>
                  <option value="Arrived late">Arrived late</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Select products to return */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                  Select products to return * ({selectedProductIndices.length} selected)
                </label>

                {/* Product Card Rows */}
                <div className="space-y-3">
                  {activeOrder.items.map((it, idx) => {
                    const isSelected = selectedProductIndices.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleSelect(idx)}
                        className={`p-4 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-[#EBEBEB] bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(idx)}
                            className="w-4 h-4 rounded-none accent-primary cursor-pointer shrink-0"
                          />
                          <div className="w-16 h-16 bg-[#F9F9F9] border border-[#EBEBEB] shrink-0 overflow-hidden flex items-center justify-center">
                            {it.product.frontImage ? (
                              <img
                                src={it.product.frontImage}
                                alt={it.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-brand-body">No image</span>
                            )}
                          </div>
                          <div className="text-xs space-y-1 font-satoshi">
                            <span className="text-[10px] text-gray-400">SKU: {it.product.sku || it.product.id}</span>
                            <h4 className="font-bold text-sm font-satoshi-bold text-brand-black">
                              {it.product.name}
                            </h4>
                            <p className="text-brand-body text-[11px]">
                              Size: <strong className="text-brand-black">{it.selectedSize || 'Standard'}</strong> | Price: <strong className="text-primary">{formatPrice(it.product.price)}</strong> | Qty: {it.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs font-satoshi w-full md:w-auto">
                          <span className="block text-brand-body text-[10px]">Total Refund Value</span>
                          <span className="font-bold text-brand-black font-satoshi-bold text-sm">
                            {formatPrice(it.product.price * it.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional notes / comments */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                  Additional Details / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Explain why you are requesting a return or exchange in detail..."
                  className="w-full bg-white border border-[#E0DCD9] p-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || selectedProductIndices.length === 0}
                  className="gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Return Request'}</span>
                  <ArrowRight size={16} />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/dashboard/return')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
