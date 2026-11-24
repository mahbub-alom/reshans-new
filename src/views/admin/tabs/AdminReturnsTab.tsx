'use client';

import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Eye,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { ReturnRequestItem } from '../../../types';

export const AdminReturnsTab: React.FC = () => {
  const { returnRequests, updateReturnRequestStatus, formatPrice, refreshReturnRequests } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequestItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const statusOptions = ['All', 'Pending', 'Approved', 'Processing', 'Picked Up', 'Completed', 'Rejected'];

  const filteredReturns = useMemo(() => {
    return returnRequests.filter((r) => {
      const matchesSearch =
        r.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ? true : r.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [returnRequests, searchQuery, statusFilter]);

  // Counts
  const pendingCount = returnRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = returnRequests.filter((r) => r.status === 'Approved' || r.status === 'Processing').length;
  const completedCount = returnRequests.filter((r) => r.status === 'Completed').length;

  const handleOpenDetailModal = (ret: ReturnRequestItem) => {
    setSelectedReturn(ret);
    setNewStatus(ret.status);
    setAdminNotes(ret.adminNotes || '');
    setActionMessage(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReturn) return;
    setIsUpdating(true);
    setActionMessage(null);

    const res = await updateReturnRequestStatus(
      selectedReturn.id,
      newStatus as 'Pending' | 'Approved' | 'Processing' | 'Picked Up' | 'Completed' | 'Rejected',
      adminNotes
    );
    setIsUpdating(false);

    if (res.success) {
      setActionMessage({ type: 'success', text: `Return status updated to ${newStatus} successfully.` });
      await refreshReturnRequests();
      // Requirement 5: modal turns off upon saving status successfully
      setTimeout(() => {
        setSelectedReturn(null);
      }, 700);
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Failed to update return status.' });
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EBEBEB] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-brand-body uppercase tracking-wider font-satoshi-bold">
            <span>Total Return Requests</span>
            <RotateCcw size={16} className="text-primary" />
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-brand-black mt-2">
            {returnRequests.length}
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-700 uppercase tracking-wider font-satoshi-bold">
            <span>Pending Review</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-amber-700 mt-2">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-blue-700 uppercase tracking-wider font-satoshi-bold">
            <span>Approved / Processing</span>
            <Truck size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-blue-700 mt-2">
            {approvedCount}
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 uppercase tracking-wider font-satoshi-bold">
            <span>Completed Refunds</span>
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-emerald-700 mt-2">
            {completedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-[#EBEBEB] p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search return #, order #, customer..."
            className="w-full bg-[#FAF9F8] border border-[#E0DCD9] pl-10 pr-4 py-2 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-satoshi font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-primary text-white font-bold'
                  : 'bg-[#FAF9F8] text-brand-body hover:bg-gray-100 border border-[#EBEBEB]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white border border-[#EBEBEB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-satoshi">
            <thead>
              <tr className="bg-[#FAF9F8] border-b border-[#F0EDED] text-[11px] font-bold uppercase tracking-wider text-brand-body font-satoshi-bold">
                <th className="py-3 px-4">Return #</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items / Total</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Requested On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-body">
                    No return requests matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret) => {
                  const totalAmount = ret.items.reduce(
                    (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
                    0
                  );
                  return (
                    <tr key={ret.id} className="hover:bg-[#FAF9F8]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-satoshi-bold text-brand-black">
                        {ret.returnNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-brand-body">
                        #{ret.orderId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-brand-black font-satoshi-bold">
                          {ret.customerName}
                        </div>
                        <div className="text-[11px] text-brand-body">{ret.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-black">
                          {ret.items.length} item{ret.items.length > 1 ? 's' : ''}
                        </span>{' '}
                        <span className="text-primary font-satoshi-bold">({formatPrice(totalAmount)})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[11px] font-medium">
                          {ret.reason}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-body text-[11px]">
                        {new Date(ret.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-satoshi-bold border ${getStatusBadge(
                            ret.status
                          )}`}
                        >
                          {ret.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetailModal(ret)}
                          className="px-3 py-1 bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Return Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EBEBEB] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="bg-[#093624] text-[#F9F295] px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold font-satoshi-bold text-base">
                  Manage Return Request: {selectedReturn.returnNumber}
                </h4>
                <p className="text-xs text-white/80">Order Ref: #{selectedReturn.orderId}</p>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-white hover:text-[#F9F295] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs font-satoshi">
              {actionMessage && (
                <div
                  className={`p-3 border text-xs font-satoshi flex items-center gap-2 ${
                    actionMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {actionMessage.type === 'success' ? (
                    <CheckCircle size={16} className="text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-700 shrink-0" />
                  )}
                  <span>{actionMessage.text}</span>
                </div>
              )}

              {/* Customer Contact & Pickup Details */}
              <div className="bg-[#FAF9F8] p-4 border border-[#EBEBEB] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] text-brand-body uppercase font-bold mb-1">
                    Customer Info
                  </span>
                  <div className="font-bold text-brand-black">{selectedReturn.customerName}</div>
                  <div className="text-brand-body flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} /> {selectedReturn.customerEmail}
                  </div>
                  {selectedReturn.customerPhone && (
                    <div className="text-brand-body flex items-center gap-1.5 mt-0.5">
                      <Phone size={12} /> {selectedReturn.customerPhone}
                    </div>
                  )}
                </div>

                <div>
                  <span className="block text-[11px] text-brand-body uppercase font-bold mb-1">
                    Pickup Address
                  </span>
                  <div className="text-brand-black flex items-start gap-1.5">
                    <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>{selectedReturn.pickupAddress || selectedReturn.customerAddress || 'No pickup address specified'}</span>
                  </div>
                </div>
              </div>

              {/* Return Reason & Customer Notes */}
              <div className="space-y-2">
                <span className="block text-[11px] text-brand-body uppercase font-bold">
                  Return Reason & Customer Notes
                </span>
                <div className="p-3 bg-[#FAF9F8] border border-[#EBEBEB]">
                  <strong className="text-brand-black block">Reason: {selectedReturn.reason}</strong>
                  {(selectedReturn.notes || selectedReturn.details) ? (
                    <div className="mt-1.5 p-2 bg-white border border-[#E8E5E3] text-[11px] text-brand-black">
                      <span className="font-bold block text-gray-500 text-[10px] uppercase">Customer Message / Note:</span>
                      <p className="mt-0.5 font-medium">{selectedReturn.notes || selectedReturn.details}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 mt-1 text-[11px] italic">No extra customer note provided</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="block text-[11px] text-brand-body uppercase font-bold">
                  Items to Return ({selectedReturn.items.length})
                </span>
                <div className="divide-y divide-gray-200 border border-[#EBEBEB]">
                  {selectedReturn.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                          {it.productImage ? (
                            <img
                              src={it.productImage}
                              alt={it.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-brand-black">{it.productName}</h5>
                          <span className="text-[11px] text-brand-body">
                            Size: {it.selectedSize || 'Standard'} | Qty: {it.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-black">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Form */}
              <div className="space-y-4 pt-2 border-t border-gray-200">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                    Change Request Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-10 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending (Under Initial Review)</option>
                    <option value="Approved">Approved (Awaiting Courier Pickup)</option>
                    <option value="Processing">Processing (Under Quality Inspection)</option>
                    <option value="Picked Up">Picked Up (In Transit to Atelier)</option>
                    <option value="Completed">Completed (Refund Issued / Exchanged)</option>
                    <option value="Rejected">Rejected (Declined per Atelier Policy)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                    Admin Note to Customer
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Provide inspection feedback, courier tracking code, or refund instructions..."
                    className="w-full bg-white border border-[#E0DCD9] p-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setSelectedReturn(null)}
                  className="px-4 py-2 border border-gray-300 text-xs font-medium text-brand-black hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase tracking-wider font-satoshi-bold hover:bg-[#07291b] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Status & Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
