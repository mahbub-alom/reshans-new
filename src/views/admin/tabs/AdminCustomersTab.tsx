'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  X,
} from 'lucide-react';
import { Customer } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminCustomersTab: React.FC = () => {
  const { customers, updateCustomerStatus, orders, formatPrice } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Search & Filters */}
      <div className="bg-white border border-[#EBEBEB] p-4 sm:p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, city..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          >
            <option value="All">All Customer Statuses</option>
            <option value="Active">Active Customers</option>
            <option value="Blocked">Blocked / Suspended</option>
          </select>

          <span className="text-xs text-gray-500 font-satoshi">
            Total: <strong className="text-[#141414]">{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. Customer Directory Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-satoshi">
            <thead className="bg-[#F9F9F9] text-brand-body uppercase font-satoshi-bold text-[10px] tracking-wider border-b border-[#EBEBEB]">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-satoshi-bold text-[#141414]">{c.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{c.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-3.5 px-4">
                    <div className="text-[#141414]">{c.email}</div>
                    <div className="text-[10px] text-gray-500">{c.phone}</div>
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-4 font-satoshi-med text-gray-700">
                    {c.city}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-[11px]">
                    {c.joinedDate}
                  </td>

                  {/* Orders */}
                  <td className="py-3.5 px-4 text-center font-satoshi-bold text-[#093624]">
                    {c.totalOrders}
                  </td>

                  {/* Lifetime Spend */}
                  <td className="py-3.5 px-4 text-right font-satoshi-bold tabular-nums text-[#141414]">
                    {formatPrice(c.totalSpent)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                        c.status === 'Active'
                          ? 'bg-[#093624] text-[#F9F295]'
                          : 'bg-[#F1EFEE] text-[#6D6868]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 text-gray-500 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                        title="View profile"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() =>
                          updateCustomerStatus(c.id, c.status === 'Active' ? 'Blocked' : 'Active')
                        }
                        className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                          c.status === 'Active'
                            ? 'text-gray-400 hover:text-[#141414] hover:bg-[#F1EFEE]'
                            : 'text-[#093624] hover:bg-[#F9F295]/50'
                        }`}
                        title={c.status === 'Active' ? 'Block customer' : 'Unblock customer'}
                      >
                        {c.status === 'Active' ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <h3 className="text-base font-bold font-satoshi-bold">Customer Account</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 font-satoshi text-xs">
              {/* Profile Card */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#093624]/20 bg-gray-100 shrink-0">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold font-satoshi-bold text-[#141414]">
                    {selectedCustomer.name}
                  </h4>
                  <p className="text-gray-500">{selectedCustomer.email}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                      selectedCustomer.status === 'Active'
                        ? 'bg-[#093624] text-[#F9F295]'
                        : 'bg-[#F1EFEE] text-[#6D6868]'
                    }`}
                  >
                    Status: {selectedCustomer.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-center">
                  <div className="text-[10px] uppercase font-satoshi-bold text-brand-body mb-0.5">
                    Total Purchases
                  </div>
                  <div className="text-base font-bold font-satoshi-bold text-[#093624]">
                    {selectedCustomer.totalOrders} Orders
                  </div>
                </div>
                <div className="p-3 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs text-center">
                  <div className="text-[10px] uppercase font-satoshi-bold text-brand-body mb-0.5">
                    Lifetime Spend
                  </div>
                  <div className="text-base font-bold font-satoshi-bold text-[#093624] tabular-nums">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#093624]" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#093624]" />
                  <span>{selectedCustomer.city}, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#093624]" />
                  <span>Registered Member since {selectedCustomer.joinedDate}</span>
                </div>
              </div>

              {/* Status Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500">Account Access:</span>
                <button
                  onClick={() => {
                    const next = selectedCustomer.status === 'Active' ? 'Blocked' : 'Active';
                    updateCustomerStatus(selectedCustomer.id, next);
                    setSelectedCustomer({ ...selectedCustomer, status: next });
                  }}
                  className={`px-3 py-1.5 rounded-xs font-satoshi-bold transition-colors cursor-pointer ${
                    selectedCustomer.status === 'Active'
                      ? 'bg-[#F1EFEE] text-[#141414] hover:bg-[#E8E5E3]'
                      : 'bg-[#093624] text-[#F9F295] hover:opacity-90'
                  }`}
                >
                  {selectedCustomer.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-satoshi-bold rounded-xs cursor-pointer"
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
