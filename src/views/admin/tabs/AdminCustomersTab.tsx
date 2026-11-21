'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  PackageCheck,
  X,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER';
  status: 'Active' | 'Blocked';
  authProvider: string;
  phone?: string;
  city?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  orders: {
    id: string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    trackingNumber?: string;
  }[];
  addresses: {
    id: string;
    title: string;
    street: string;
    city: string;
    phone: string;
  }[];
}

export const AdminCustomersTab: React.FC = () => {
  const { formatPrice, showToast, authToken, navigate } = useShop();
  const [customers, setCustomers] = useState<CustomerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users?type=customers', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setCustomers(data.users);
      }
    } catch (err) {
      console.warn('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-satoshi-bold">
            Total Customers
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#093624] mt-1">
            {customers.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Registered ecommerce shoppers</p>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-satoshi-bold">
            Active Shoppers
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-emerald-700 mt-1">
            {customers.filter((c) => c.status === 'Active').length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Eligible for checkout & orders</p>
        </div>

        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-satoshi-bold">
            Total Lifetime GMV
          </div>
          <div className="text-2xl font-bold font-satoshi-bold text-[#141414] mt-1 tabular-nums">
            {formatPrice(customers.reduce((acc, c) => acc + c.totalSpent, 0))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Direct store sales contribution</p>
        </div>
      </div>

      {/* 2. Search & Controls */}
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
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624] cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>

          <button
            onClick={fetchCustomers}
            className="px-3 py-2 bg-[#093624] text-[#F9F295] text-xs font-bold rounded-xs flex items-center gap-1.5 hover:bg-[#052216] transition-colors cursor-pointer"
            title="Refresh customer list"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 3. Customers Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F9F9F9] border-b border-[#EBEBEB] text-brand-black uppercase tracking-wider text-[11px] font-satoshi-bold">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Email & Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading && customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-satoshi">
                    Loading customers from database...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-satoshi">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/75 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-satoshi-bold text-[#141414]">{c.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">{c.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="text-[#141414] font-medium">{c.email}</div>
                      <div className="text-[10px] text-gray-500">{c.phone || 'No phone'}</div>
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-4 font-satoshi-med text-gray-700">
                      {c.city || 'Dhaka'}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Orders */}
                    <td className="py-3.5 px-4 text-center font-satoshi-bold text-[#093624]">
                      {c.ordersCount}
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
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 text-gray-500 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer inline-flex items-center gap-1 font-satoshi-bold"
                        title="View complete customer profile and order history"
                      >
                        <Eye size={15} />
                        <span className="text-[11px] hidden sm:inline">Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Customer Details & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#F9F295]" />
                <h3 className="text-base font-bold font-satoshi-bold">Customer Profile & Order History</h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs font-satoshi">
              {/* Profile Card */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#093624] text-[#F9F295] flex items-center justify-center text-xl font-bold shrink-0">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-satoshi-bold text-[#141414]">
                      {selectedCustomer.name}
                    </h4>
                    <p className="text-gray-500">{selectedCustomer.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold bg-gray-100 text-gray-700">
                        Method: {selectedCustomer.authProvider}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                          selectedCustomer.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-gray-400 font-satoshi-bold">
                    Lifetime Spend
                  </div>
                  <div className="text-xl font-bold font-satoshi-bold text-[#093624] tabular-nums">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {selectedCustomer.ordersCount} total orders
                  </div>
                </div>
              </div>

              {/* Customer Contact & Meta Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#F9F9F9] border border-gray-200 rounded-xs flex items-center gap-2.5">
                  <Phone size={15} className="text-[#093624] shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Phone Number</div>
                    <div className="font-semibold text-[#141414]">{selectedCustomer.phone || 'Not provided'}</div>
                  </div>
                </div>

                <div className="p-3 bg-[#F9F9F9] border border-gray-200 rounded-xs flex items-center gap-2.5">
                  <MapPin size={15} className="text-[#093624] shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Location</div>
                    <div className="font-semibold text-[#141414]">{selectedCustomer.city || 'Dhaka'}, Bangladesh</div>
                  </div>
                </div>

                <div className="p-3 bg-[#F9F9F9] border border-gray-200 rounded-xs flex items-center gap-2.5">
                  <Calendar size={15} className="text-[#093624] shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Member Since</div>
                    <div className="font-semibold text-[#141414]">
                      {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Shipping Addresses */}
              {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                <div>
                  <h5 className="font-bold font-satoshi-bold text-sm text-[#141414] mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#093624]" />
                    <span>Saved Delivery Addresses</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCustomer.addresses.map((addr) => (
                      <div key={addr.id} className="p-3 border border-gray-200 rounded-xs bg-white text-xs">
                        <div className="font-bold text-[#093624] mb-0.5">{addr.title}</div>
                        <div className="text-gray-600">{addr.street}</div>
                        <div className="text-gray-500 font-medium">{addr.city} • {addr.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History */}
              <div>
                <h5 className="font-bold font-satoshi-bold text-sm text-[#141414] mb-3 flex items-center gap-1.5">
                  <PackageCheck size={16} className="text-[#093624]" />
                  <span>Recent Order History ({selectedCustomer.orders?.length || 0})</span>
                </h5>

                {!selectedCustomer.orders || selectedCustomer.orders.length === 0 ? (
                  <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-xs text-gray-500">
                    This customer has not placed any orders yet.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xs overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 font-satoshi-bold text-gray-700">
                          <th className="py-2.5 px-3">Order ID</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Payment</th>
                          <th className="py-2.5 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedCustomer.orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#093624]">
                              {ord.id}
                            </td>
                            <td className="py-2.5 px-3 text-gray-500">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F9F295]/60 text-[#093624]">
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-600 font-medium">
                              {ord.paymentStatus}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-[#141414] tabular-nums">
                              {formatPrice(ord.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-xs font-bold uppercase rounded-xs cursor-pointer"
              >
                Close Customer Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
