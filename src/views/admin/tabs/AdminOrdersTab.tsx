'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  RotateCcw,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  X,
  CreditCard,
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminOrdersTab: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    formatPrice,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetails = (ord: Order) => {
    setSelectedOrder(ord);
    setTrackingInput(ord.trackingNumber || '');
  };

  const statusPills: Array<{ label: 'All' | OrderStatus; count: number }> = [
    { label: 'All', count: orders.length },
    { label: 'Pending', count: orders.filter((o) => o.orderStatus === 'Pending').length },
    { label: 'Processing', count: orders.filter((o) => o.orderStatus === 'Processing').length },
    { label: 'Shipped', count: orders.filter((o) => o.orderStatus === 'Shipped').length },
    { label: 'Delivered', count: orders.filter((o) => o.orderStatus === 'Delivered').length },
    { label: 'Cancelled', count: orders.filter((o) => o.orderStatus === 'Cancelled').length },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header with Status Tabs & Search */}
      <div className="bg-white border border-[#EBEBEB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
          {statusPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => setStatusFilter(pill.label)}
              className={`px-3 py-1.5 rounded-xs text-xs font-satoshi-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                statusFilter === pill.label
                  ? 'bg-[#093624] text-[#F9F295] shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === pill.label
                    ? 'bg-[#F9F295] text-[#093624]'
                    : 'bg-white text-gray-600'
                }`}
              >
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, customer, phone, or tracking..."
              className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div className="text-xs text-gray-500 font-satoshi">
            Showing <span className="font-satoshi-bold text-[#141414]">{filteredOrders.length}</span> orders
          </div>
        </div>
      </div>

      {/* 2. Orders Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-satoshi">
            <thead className="bg-[#F9F9F9] text-brand-body uppercase font-satoshi-bold text-[10px] tracking-wider border-b border-[#EBEBEB]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Order ID & Date */}
                  <td className="py-3.5 px-4">
                    <div className="font-satoshi-bold text-[#093624]">{ord.id}</div>
                    <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                      {ord.date}
                    </div>
                    {ord.trackingNumber && (
                      <span className="inline-block mt-1 text-[9px] font-mono bg-[#F9F295]/70 text-[#093624] font-bold px-1.5 py-0.5 rounded-xs">
                        {ord.trackingNumber}
                      </span>
                    )}
                  </td>

                  {/* Customer Details */}
                  <td className="py-3.5 px-4">
                    <div className="font-satoshi-bold text-[#141414]">
                      {ord.customerName}
                    </div>
                    <div className="text-[10px] text-gray-500">{ord.customerPhone}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                      {ord.customerAddress}
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="py-3.5 px-4">
                    <div className="font-satoshi-med text-[#141414]">
                      {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate max-w-[160px]">
                      {ord.items.map((i) => i.product.name).join(', ')}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4">
                    <div className="font-satoshi-med text-[#141414]">{ord.paymentMethod}</div>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded-xs text-[9px] font-satoshi-bold uppercase ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-[#093624] text-[#F9F295]'
                          : ord.paymentStatus === 'Refunded'
                          ? 'bg-[#F1EFEE] text-[#6D6868]'
                          : 'bg-[#F9F295] text-[#093624]'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>

                  {/* Order Status with Quick Selector */}
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-satoshi-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-[#093624] text-[#F9F295] border-[#093624]'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-[#093624]/15 text-[#093624] border-[#093624]/30'
                          : ord.orderStatus === 'Processing'
                          ? 'bg-[#F9F295] text-[#093624] border-[#093624]/30'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-[#F1EFEE] text-[#6D6868] border-[#E8E5E3]'
                          : 'bg-gray-100 text-[#141414] border-gray-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-satoshi-bold tabular-nums text-[#141414]">
                    {formatPrice(ord.total)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleOpenDetails(ord)}
                      className="px-2.5 py-1 bg-[#093624]/10 hover:bg-[#093624] text-[#093624] hover:text-[#F9F295] rounded-xs font-satoshi-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <div>
                <span className="text-[10px] uppercase font-satoshi-bold tracking-widest text-[#F9F295]">
                  Order Fulfillment
                </span>
                <h3 className="text-base font-bold font-satoshi-bold flex items-center gap-2">
                  <span>Order {selectedOrder.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-satoshi">
                    {selectedOrder.orderStatus}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-satoshi">
              {/* Customer Info Card */}
              <div className="bg-[#F9F9F9] border border-[#EBEBEB] p-4 rounded-xs">
                <h4 className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-3">
                  Customer & Delivery Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Name:</span>
                    <span className="font-satoshi-bold text-[#141414]">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Phone:</span>
                    <span className="font-satoshi-bold text-[#141414]">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block text-[10px]">Shipping Address:</span>
                    <span className="text-gray-700">{selectedOrder.customerAddress}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div>
                      <span className="text-gray-400 block text-[10px]">Tracking Code:</span>
                      <span className="font-mono font-bold text-[#093624]">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                  {selectedOrder.bkashTransactionId && (
                    <div>
                      <span className="text-gray-400 block text-[10px]">bKash Payment:</span>
                      <span className="font-satoshi-bold text-[#093624]">
                        {selectedOrder.bkashNumber} · TrxID: {selectedOrder.bkashTransactionId}
                      </span>
                    </div>
                  )}
                  {selectedOrder.note && (
                    <div className="sm:col-span-2 p-2 bg-[#F9F295]/50 border border-[#093624]/30 rounded-xs text-[#093624] text-[11px]">
                      <strong>Customer Note:</strong> {selectedOrder.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body mb-2">
                  Purchased Garments ({selectedOrder.items.length})
                </h4>
                <div className="border border-[#EBEBEB] rounded-xs divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gray-100 rounded-xs overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.product.frontImage}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-satoshi-bold text-[#141414]">{item.product.name}</div>
                          <div className="text-[11px] text-gray-500">
                            Size: {item.selectedSize || 'M'} • Color: {item.selectedColor || 'Default'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-satoshi-bold tabular-nums text-[#093624]">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-satoshi-bold tabular-nums">{formatPrice(selectedOrder.total - 60)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge (Dhaka Express)</span>
                  <span className="font-satoshi-bold tabular-nums">৳ 60</span>
                </div>
                <div className="flex justify-between text-sm font-satoshi-bold text-[#141414] pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#093624] tabular-nums">{formatPrice(selectedOrder.total)}</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Payment: {selectedOrder.paymentMethod}</span>
                  <span className="font-satoshi-bold text-[#093624]">Status: {selectedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Actions & Status Workflow */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-satoshi-bold uppercase tracking-wider text-brand-body">
                  Update Order Fulfillment
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Processing');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'Processing' });
                    }}
                    className="px-3 py-1.5 bg-[#F9F295] hover:opacity-90 text-[#093624] text-xs font-satoshi-bold rounded-xs cursor-pointer"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Shipped');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'Shipped' });
                    }}
                    className="px-3 py-1.5 bg-[#093624]/15 hover:bg-[#093624]/25 text-[#093624] text-xs font-satoshi-bold rounded-xs cursor-pointer"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Delivered');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'Delivered' });
                    }}
                    className="px-3 py-1.5 bg-[#093624] hover:opacity-90 text-[#F9F295] text-xs font-satoshi-bold rounded-xs cursor-pointer"
                  >
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => {
                      cancelOrder(selectedOrder.id);
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'Cancelled' });
                    }}
                    className="px-3 py-1.5 bg-[#141414] hover:bg-black text-white text-xs font-satoshi-bold rounded-xs cursor-pointer"
                  >
                    Cancel Order
                  </button>
                  {selectedOrder.paymentStatus === 'Paid' && (
                    <button
                      onClick={() => {
                        refundOrder(selectedOrder.id);
                        setSelectedOrder({ ...selectedOrder, paymentStatus: 'Refunded' });
                      }}
                      className="px-3 py-1.5 border border-[#141414] text-[#141414] hover:bg-[#F1EFEE] text-xs font-satoshi-bold rounded-xs cursor-pointer"
                    >
                      Process Refund
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-satoshi-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
