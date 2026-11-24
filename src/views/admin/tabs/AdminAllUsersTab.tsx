'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Shield,
  X,
  RefreshCw,
  Lock,
  ShoppingBag,
  PackageCheck,
  PackageX,
  Clock,
  Truck,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserX,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

interface OrderItem {
  id?: string;
  name?: string;
  title?: string;
  quantity?: number;
  price?: number;
  image?: string;
  color?: string;
  size?: string;
}

interface UserOrder {
  id: string;
  total: number;
  orderStatus: string; // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  paymentStatus: string;
  createdAt: string;
  trackingNumber?: string;
  items?: OrderItem[];
}

interface UserAddress {
  id: string;
  title: string;
  street: string;
  city: string;
  phone: string;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  status: 'Active' | 'Blocked';
  authProvider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
  phone?: string;
  city?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  orders?: UserOrder[];
  addresses?: UserAddress[];
}

export const AdminAllUsersTab: React.FC = () => {
  const { formatPrice, showToast, authToken, currentUser, navigate } = useShop();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'ADMIN' | 'CUSTOMER'>('All');

  // Modals & Drawers
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<UserAccount | null>(null);
  const [customPasswordInput, setCustomPasswordInput] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [tempPasswordModal, setTempPasswordModal] = useState<{ user: UserAccount; tempPass: string } | null>(null);

  // Custom Confirmation Modals (Replacing browser default alerts)
  const [roleConfirmModal, setRoleConfirmModal] = useState<{ user: UserAccount; newRole: 'ADMIN' | 'CUSTOMER' } | null>(null);
  const [statusConfirmModal, setStatusConfirmModal] = useState<{ user: UserAccount; newStatus: 'Active' | 'Blocked' } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users?type=all', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        // Exclude currently logged-in Admin's own account so they don't accidentally modify themselves
        const filtered = currentUser?.id
          ? data.users.filter((u: UserAccount) => u.id !== currentUser.id && u.email !== currentUser.email)
          : data.users;
        setUsers(filtered);

        // If a modal user is selected, refresh their reference
        if (selectedUser) {
          const updatedSelected = filtered.find((u: UserAccount) => u.id === selectedUser.id);
          if (updatedSelected) setSelectedUser(updatedSelected);
        }
      } else if (data.error) {
        showToast(data.error);
      }
    } catch (err) {
      console.warn('Failed to fetch all users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser?.id]);

  // 1. Promote to Admin or Demote to Customer execution
  const executeRoleChange = async () => {
    if (!roleConfirmModal) return;
    const { user: targetUser, newRole } = roleConfirmModal;

    if (currentUser && targetUser.id === currentUser.id) {
      showToast('Security Error: You cannot modify your own role.');
      setRoleConfirmModal(null);
      return;
    }

    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: targetUser.id,
          action: 'CHANGE_ROLE',
          role: newRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `User role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
        );
        if (selectedUser && selectedUser.id === targetUser.id) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
        setRoleConfirmModal(null);
      } else {
        showToast(data.error || 'Failed to update role');
      }
    } catch (err) {
      showToast('Role update failed');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 2. Block or Reactivate Account execution
  const executeStatusChange = async () => {
    if (!statusConfirmModal) return;
    const { user: targetUser, newStatus } = statusConfirmModal;

    if (currentUser && targetUser.id === currentUser.id) {
      showToast('Security Error: You cannot block your own account.');
      setStatusConfirmModal(null);
      return;
    }

    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: targetUser.id,
          action: 'CHANGE_STATUS',
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `User status changed to ${newStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
        );
        if (selectedUser && selectedUser.id === targetUser.id) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
        setStatusConfirmModal(null);
      } else {
        showToast(data.error || 'Failed to update account status');
      }
    } catch (err) {
      showToast('Status update failed');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 3. Admin Change/Reset User Password (Mandatory: password cannot be blank)
  const handlePasswordReset = async (targetUser: UserAccount, newPass: string) => {
    const trimmed = newPass.trim();
    if (!trimmed) {
      showToast('Please enter a new password. It cannot be left blank.');
      return;
    }

    if (trimmed.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }

    setIsSettingPassword(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: targetUser.id,
          action: 'RESET_PASSWORD',
          temporaryPassword: trimmed,
        }),
      });
      const data = await res.json();
      if (data.success && data.temporaryPassword) {
        setTempPasswordModal({
          user: targetUser,
          tempPass: data.temporaryPassword,
        });
        setPasswordModalUser(null);
        setCustomPasswordInput('');
        showToast('Password updated successfully!');
      } else {
        showToast(data.error || 'Password update failed');
      }
    } catch (err) {
      showToast('Password update failed');
    } finally {
      setIsSettingPassword(false);
    }
  };

  // Search & Filtered list
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate Order Statistics for a User
  const getOrderStats = (userOrders?: UserOrder[]) => {
    if (!userOrders || userOrders.length === 0) {
      return {
        total: 0,
        delivered: 0,
        cancelled: 0,
        inTransit: 0,
        pending: 0,
        deliveredRate: 0,
        cancelledRate: 0,
      };
    }
    const total = userOrders.length;
    const delivered = userOrders.filter(
      (o) => o.orderStatus?.toUpperCase() === 'DELIVERED'
    ).length;
    const cancelled = userOrders.filter(
      (o) => o.orderStatus?.toUpperCase() === 'CANCELLED'
    ).length;
    const inTransit = userOrders.filter(
      (o) => o.orderStatus?.toUpperCase() === 'SHIPPED' || o.orderStatus?.toUpperCase() === 'PROCESSING'
    ).length;
    const pending = userOrders.filter(
      (o) => o.orderStatus?.toUpperCase() === 'PENDING'
    ).length;

    const deliveredRate = Math.round((delivered / total) * 100);
    const cancelledRate = Math.round((cancelled / total) * 100);

    return { total, delivered, cancelled, inTransit, pending, deliveredRate, cancelledRate };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-[#093624] text-white p-5 rounded-xs shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F9F295] text-[#093624] flex items-center justify-center font-bold shadow-xs">
            <Shield size={20} />
          </div>
          <div>
            <div className="font-satoshi-bold text-base">Users & Access Control Management</div>
            <div className="text-xs text-white/70">
              Manage all registered accounts, promote users to Admin, change passwords, block/unblock, and inspect full order performance history.
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#F9F295] text-xs font-bold rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white border border-[#EBEBEB] p-4 sm:p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, phone, city..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-bold rounded-xs text-[#141414] focus:outline-none focus:border-[#093624] cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="ADMIN">Admins Only</option>
            <option value="CUSTOMER">Customers (Normal Users)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-bold rounded-xs text-[#141414] focus:outline-none focus:border-[#093624] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Blocked">Blocked Accounts</option>
          </select>
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F9F9F9] border-b border-[#EBEBEB] text-brand-black uppercase tracking-wider text-[11px] font-satoshi-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Orders (Received / Cancelled)</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4 text-center">Admin Promotion</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-satoshi">
                    Loading users from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-satoshi">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const stats = getOrderStats(u.orders);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/75 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              u.role === 'ADMIN'
                                ? 'bg-[#093624] text-[#F9F295]'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-satoshi-bold text-[#141414] text-sm flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {u.status === 'Blocked' && (
                                <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                  Blocked
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500">{u.email}</div>
                            {u.phone && <div className="text-[10px] text-gray-400">{u.phone}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-satoshi-bold uppercase tracking-wider ${
                            u.role === 'ADMIN'
                              ? 'bg-[#093624] text-[#F9F295] border border-[#0d4a32]'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                            u.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'Active' ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Order Performance (Received / Delivered vs Cancelled) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-bold text-[#141414]">{stats.total} Orders</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-emerald-700 font-medium inline-flex items-center gap-0.5" title="Delivered / Received">
                              <PackageCheck size={12} /> {stats.delivered} Received
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-red-600 font-medium inline-flex items-center gap-0.5" title="Cancelled">
                              <PackageX size={12} /> {stats.cancelled} Cancelled
                            </span>
                          </div>
                          {stats.total > 0 && (
                            <div className="w-36 bg-gray-200 h-1.5 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${stats.deliveredRate}%` }}
                                className="bg-emerald-600 h-full"
                                title={`Delivered: ${stats.deliveredRate}%`}
                              />
                              <div
                                style={{ width: `${stats.cancelledRate}%` }}
                                className="bg-red-500 h-full"
                                title={`Cancelled: ${stats.cancelledRate}%`}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 font-satoshi-bold text-[#093624]">
                        {formatPrice(u.totalSpent || 0)}
                      </td>

                      {/* Role Promotion Button (Opens Custom Modal) */}
                      <td className="py-3.5 px-4 text-center">
                        {u.role === 'CUSTOMER' ? (
                          <button
                            onClick={() => setRoleConfirmModal({ user: u, newRole: 'ADMIN' })}
                            className="px-3 py-1 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-[11px] font-bold rounded-xs cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                            title="Promote user to Admin"
                          >
                            <Shield size={12} />
                            <span>Make Admin</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setRoleConfirmModal({ user: u, newRole: 'CUSTOMER' })}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold rounded-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                            title="Demote to Customer"
                          >
                            <UserCheck size={12} />
                            <span>Demote to User</span>
                          </button>
                        )}
                      </td>

                      {/* Action Buttons: Password, Block/Unblock, View Profile */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Change Password */}
                          <button
                            onClick={() => {
                              setPasswordModalUser(u);
                              setCustomPasswordInput('');
                            }}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-xs transition-colors cursor-pointer border border-amber-200"
                            title="Change User Password"
                          >
                            <KeyRound size={14} />
                          </button>

                          {/* Block / Unblock Account (Opens Custom Modal) */}
                          <button
                            onClick={() =>
                              setStatusConfirmModal({
                                user: u,
                                newStatus: u.status === 'Active' ? 'Blocked' : 'Active',
                              })
                            }
                            className={`p-1.5 rounded-xs transition-colors cursor-pointer border ${
                              u.status === 'Active'
                                ? 'text-red-600 hover:bg-red-50 border-red-200'
                                : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                            }`}
                            title={u.status === 'Active' ? 'Block this account' : 'Unblock this account'}
                          >
                            {u.status === 'Active' ? <UserX size={14} /> : <ShieldCheck size={14} />}
                          </button>

                          {/* View Full Profile & Order Performance */}
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 text-[#093624] bg-emerald-50 hover:bg-emerald-100 rounded-xs transition-colors cursor-pointer border border-emerald-200 font-bold inline-flex items-center gap-1 text-[11px]"
                            title="View Full Profile Details & Orders"
                          >
                            <Eye size={14} />
                            <span className="hidden xl:inline">Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. FULL USER DETAILS MODAL (Detailed Profile, Order Receive vs Cancel Stats, Order History) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F9F295] text-[#093624] flex items-center justify-center font-bold text-base">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold font-satoshi-bold leading-tight">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-white/70">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-satoshi text-xs">
              {/* Profile Overview Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F9F9F9] p-3 rounded-xs border border-[#EBEBEB]">
                  <div className="text-[10px] text-gray-500 uppercase font-satoshi-bold">Account Role</div>
                  <div className="text-xs font-bold text-[#093624] mt-0.5">{selectedUser.role}</div>
                </div>
                <div className="bg-[#F9F9F9] p-3 rounded-xs border border-[#EBEBEB]">
                  <div className="text-[10px] text-gray-500 uppercase font-satoshi-bold">Account Status</div>
                  <div className={`text-xs font-bold mt-0.5 ${selectedUser.status === 'Active' ? 'text-emerald-700' : 'text-red-600'}`}>
                    {selectedUser.status}
                  </div>
                </div>
                <div className="bg-[#F9F9F9] p-3 rounded-xs border border-[#EBEBEB]">
                  <div className="text-[10px] text-gray-500 uppercase font-satoshi-bold">Total Spent</div>
                  <div className="text-xs font-bold text-[#093624] mt-0.5">{formatPrice(selectedUser.totalSpent || 0)}</div>
                </div>
                <div className="bg-[#F9F9F9] p-3 rounded-xs border border-[#EBEBEB]">
                  <div className="text-[10px] text-gray-500 uppercase font-satoshi-bold">Joined On</div>
                  <div className="text-xs font-bold text-gray-700 mt-0.5">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Order Performance & Behavior (Receive vs Cancel) */}
              {(() => {
                const stats = getOrderStats(selectedUser.orders);
                return (
                  <div className="border border-[#EBEBEB] rounded-xs p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold font-satoshi-bold text-sm text-[#141414] flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#093624]" />
                        <span>Order Performance & Reliability</span>
                      </div>
                      <span className="text-[11px] text-gray-500">
                        Total {stats.total} lifetime orders
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <PackageCheck size={14} />
                          <span>Delivered / Received</span>
                        </div>
                        <div className="text-lg font-bold text-emerald-900 mt-1">
                          {stats.delivered}{' '}
                          <span className="text-[11px] font-normal text-emerald-700">
                            ({stats.total > 0 ? stats.deliveredRate : 0}%)
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-700 mt-0.5">Successfully received orders</p>
                      </div>

                      <div className="bg-red-50/70 border border-red-200 p-3 rounded-xs">
                        <div className="flex items-center gap-1.5 text-red-800 font-bold text-xs">
                          <PackageX size={14} />
                          <span>Cancelled</span>
                        </div>
                        <div className="text-lg font-bold text-red-900 mt-1">
                          {stats.cancelled}{' '}
                          <span className="text-[11px] font-normal text-red-700">
                            ({stats.total > 0 ? stats.cancelledRate : 0}%)
                          </span>
                        </div>
                        <p className="text-[10px] text-red-700 mt-0.5">Customer / store cancelled</p>
                      </div>

                      <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xs">
                        <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                          <Truck size={14} />
                          <span>In Progress</span>
                        </div>
                        <div className="text-lg font-bold text-blue-900 mt-1">{stats.inTransit}</div>
                        <p className="text-[10px] text-blue-700 mt-0.5">Shipped or processing</p>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xs">
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                          <Clock size={14} />
                          <span>Pending</span>
                        </div>
                        <div className="text-lg font-bold text-amber-900 mt-1">{stats.pending}</div>
                        <p className="text-[10px] text-amber-700 mt-0.5">Awaiting fulfillment</p>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    {stats.total > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>Delivery Success Rate: {stats.deliveredRate}%</span>
                          <span>Cancellation Rate: {stats.cancelledRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${stats.deliveredRate}%` }}
                            className="bg-emerald-600 h-full"
                          />
                          <div
                            style={{ width: `${stats.cancelledRate}%` }}
                            className="bg-red-500 h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Contact & Address Information */}
              <div className="border border-[#EBEBEB] rounded-xs p-4 bg-white space-y-3">
                <div className="font-bold font-satoshi-bold text-sm text-[#141414] flex items-center gap-2">
                  <MapPin size={16} className="text-[#093624]" />
                  <span>Contact & Saved Addresses</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-gray-500 text-[11px]">Primary Phone:</div>
                    <div className="font-medium text-[#141414]">{selectedUser.phone || 'No phone registered'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500 text-[11px]">City / Region:</div>
                    <div className="font-medium text-[#141414]">{selectedUser.city || 'Dhaka'}</div>
                  </div>
                </div>

                {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="text-[11px] font-bold text-gray-700">Saved Shipping Addresses:</div>
                    <div className="space-y-2">
                      {selectedUser.addresses.map((addr) => (
                        <div key={addr.id} className="p-2.5 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs">
                          <div className="font-bold text-[#141414]">{addr.title}</div>
                          <div className="text-gray-600 text-[11px] mt-0.5">{addr.street}, {addr.city}</div>
                          <div className="text-gray-500 text-[10px] mt-0.5">Phone: {addr.phone}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Orders List */}
              <div className="border border-[#EBEBEB] rounded-xs p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold font-satoshi-bold text-sm text-[#141414] flex items-center gap-2">
                    <PackageCheck size={16} className="text-[#093624]" />
                    <span>Order History</span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {selectedUser.orders?.length || 0} total
                  </span>
                </div>

                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                    {selectedUser.orders.map((ord) => (
                      <div key={ord.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-[#141414] flex items-center gap-2">
                            <span>Order #{ord.id.substring(0, 8)}</span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                ord.orderStatus?.toUpperCase() === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus?.toUpperCase() === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString()} • Payment: {ord.paymentStatus}
                          </div>
                        </div>
                        <div className="font-bold text-[#093624] text-xs">
                          {formatPrice(ord.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    This user has not placed any orders yet.
                  </div>
                )}
              </div>

              {/* Quick Actions in Details Modal */}
              <div className="border-t border-[#EBEBEB] pt-4 space-y-3">
                <div className="font-bold font-satoshi-bold text-xs text-[#141414]">Administrative Actions</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      setRoleConfirmModal({
                        user: selectedUser,
                        newRole: selectedUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN',
                      })
                    }
                    className="py-2 px-3 border border-[#093624] text-[#093624] hover:bg-[#093624] hover:text-[#F9F295] font-bold rounded-xs transition-colors cursor-pointer text-center text-xs"
                  >
                    {selectedUser.role === 'ADMIN' ? 'Demote to Customer' : 'Make Admin'}
                  </button>

                  <button
                    onClick={() => {
                      setPasswordModalUser(selectedUser);
                      setCustomPasswordInput('');
                    }}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xs transition-colors cursor-pointer text-center text-xs"
                  >
                    Change Password
                  </button>

                  <button
                    onClick={() =>
                      setStatusConfirmModal({
                        user: selectedUser,
                        newStatus: selectedUser.status === 'Active' ? 'Blocked' : 'Active',
                      })
                    }
                    className={`py-2 px-3 font-bold rounded-xs transition-colors cursor-pointer text-center text-xs ${
                      selectedUser.status === 'Active'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {selectedUser.status === 'Active' ? 'Block Account' : 'Unblock Account'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-satoshi-bold rounded-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CHANGE PASSWORD MODAL (Blank not allowed; Cancel keeps existing password intact) */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-[#F9F295]" />
                <h3 className="text-base font-bold font-satoshi-bold">Change User Password</h3>
              </div>
              <button
                onClick={() => {
                  setPasswordModalUser(null);
                  setCustomPasswordInput('');
                }}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 font-satoshi text-xs">
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-xs text-gray-700">
                Setting new password for: <strong>{passwordModalUser.name}</strong> ({passwordModalUser.email})
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase font-satoshi-bold flex items-center gap-1">
                  <span>New Password</span>
                  <span className="text-red-500">* (Required)</span>
                </label>
                <input
                  type="text"
                  value={customPasswordInput}
                  onChange={(e) => setCustomPasswordInput(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-gray-300 rounded-xs text-xs font-mono text-[#141414] focus:outline-none focus:border-[#093624]"
                />
                <p className="text-[11px] text-gray-500">
                  Password field cannot be blank. If you click <strong>Cancel</strong>, the user&apos;s current password will remain completely unchanged.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalUser(null);
                    setCustomPasswordInput('');
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xs cursor-pointer"
                >
                  Cancel (Keep Old Password)
                </button>
                <button
                  type="button"
                  disabled={isSettingPassword || !customPasswordInput.trim()}
                  onClick={() => handlePasswordReset(passwordModalUser, customPasswordInput)}
                  className="px-4 py-2 bg-[#093624] hover:bg-[#052216] disabled:opacity-50 disabled:cursor-not-allowed text-[#F9F295] text-xs font-bold rounded-xs cursor-pointer transition-colors"
                >
                  {isSettingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PASSWORD CONFIRMATION MODAL */}
      {tempPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Password Updated Successfully
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The password for <strong>{tempPasswordModal.user.email}</strong> has been updated. Provide this password to the user:
            </p>
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-xs font-mono text-sm font-bold text-[#093624] select-all">
              {tempPasswordModal.tempPass}
            </div>
            <p className="text-[11px] text-gray-500">
              All active sessions for this account were invalidated. The user can now log in with this new password.
            </p>
            <button
              onClick={() => setTempPasswordModal(null)}
              className="w-full py-2 bg-[#093624] text-[#F9F295] text-xs font-bold uppercase rounded-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 7. CUSTOM PERMISSION MODAL: ROLE CHANGE (Make Admin / Demote to User) */}
      {roleConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#093624] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#F9F295]" />
                <h3 className="text-sm font-bold font-satoshi-bold">
                  {roleConfirmModal.newRole === 'ADMIN' ? 'Promote User to Admin' : 'Demote Admin to Customer'}
                </h3>
              </div>
              <button
                onClick={() => setRoleConfirmModal(null)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 font-satoshi text-xs">
              <div className="p-3 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs space-y-1">
                <div className="font-bold text-[#141414] text-sm">{roleConfirmModal.user.name}</div>
                <div className="text-gray-500">{roleConfirmModal.user.email}</div>
                <div className="text-[11px] text-gray-600 pt-1">
                  Current Role: <span className="font-bold">{roleConfirmModal.user.role}</span> → Target Role:{' '}
                  <span className="font-bold text-[#093624]">{roleConfirmModal.newRole}</span>
                </div>
              </div>

              <div className="text-gray-600 leading-relaxed text-xs">
                {roleConfirmModal.newRole === 'ADMIN' ? (
                  <p>
                    Are you sure you want to grant <strong>Administrator Privileges</strong> to this account? This user will have full access to manage products, categories, orders, customers, and site settings.
                  </p>
                ) : (
                  <p>
                    Are you sure you want to demote this Administrator to a <strong>Normal Customer</strong>? Their admin panel access will be revoked immediately.
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={() => setRoleConfirmModal(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={executeRoleChange}
                  className="px-4 py-2 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-xs font-bold rounded-xs cursor-pointer transition-colors"
                >
                  {isProcessingAction
                    ? 'Processing...'
                    : roleConfirmModal.newRole === 'ADMIN'
                    ? 'Yes, Make Admin'
                    : 'Yes, Demote to User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CUSTOM PERMISSION MODAL: BLOCK / UNBLOCK ACCOUNT */}
      {statusConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                statusConfirmModal.newStatus === 'Blocked' ? 'bg-red-700' : 'bg-[#093624]'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusConfirmModal.newStatus === 'Blocked' ? (
                  <UserX size={18} className="text-white" />
                ) : (
                  <ShieldCheck size={18} className="text-[#F9F295]" />
                )}
                <h3 className="text-sm font-bold font-satoshi-bold">
                  {statusConfirmModal.newStatus === 'Blocked' ? 'Confirm Block User Account' : 'Confirm Unblock User Account'}
                </h3>
              </div>
              <button
                onClick={() => setStatusConfirmModal(null)}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 font-satoshi text-xs">
              <div className="p-3 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs space-y-1">
                <div className="font-bold text-[#141414] text-sm">{statusConfirmModal.user.name}</div>
                <div className="text-gray-500">{statusConfirmModal.user.email}</div>
                <div className="text-[11px] text-gray-600 pt-1">
                  Current Status: <span className="font-bold">{statusConfirmModal.user.status}</span> → New Status:{' '}
                  <span
                    className={`font-bold ${
                      statusConfirmModal.newStatus === 'Blocked' ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {statusConfirmModal.newStatus}
                  </span>
                </div>
              </div>

              <div className="text-gray-600 leading-relaxed text-xs">
                {statusConfirmModal.newStatus === 'Blocked' ? (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      <span>Security & Access Warning</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Blocking this account will immediately revoke all active sessions for <strong>{statusConfirmModal.user.email}</strong>. The user will not be able to log in, browse orders, or make purchases until unblocked.
                    </p>
                  </div>
                ) : (
                  <p>
                    Reactivating will restore normal store and account access for <strong>{statusConfirmModal.user.name}</strong>. They will be able to log in again with their existing credentials.
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={() => setStatusConfirmModal(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={executeStatusChange}
                  className={`px-4 py-2 font-bold rounded-xs cursor-pointer transition-colors text-xs ${
                    statusConfirmModal.newStatus === 'Blocked'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#093624] hover:bg-[#052216] text-[#F9F295]'
                  }`}
                >
                  {isProcessingAction
                    ? 'Processing...'
                    : statusConfirmModal.newStatus === 'Blocked'
                    ? 'Yes, Block Account'
                    : 'Yes, Unblock Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
