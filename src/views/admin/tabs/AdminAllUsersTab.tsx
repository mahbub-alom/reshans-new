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
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

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
}

export const AdminAllUsersTab: React.FC = () => {
  const { formatPrice, showToast, authToken, currentUser } = useShop();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'ADMIN' | 'CUSTOMER'>('All');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [tempPasswordModal, setTempPasswordModal] = useState<{ user: UserAccount; tempPass: string } | null>(null);
  const [customPasswordInput, setCustomPasswordInput] = useState('');
  const [isResettingWithCustom, setIsResettingWithCustom] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Backend automatically excludes the currently logged-in Admin's account
      const res = await fetch('/api/admin/users?type=all', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        // Double-check frontend filter as well to ensure currently logged-in admin never shows in All Users
        const filtered = currentUser?.id
          ? data.users.filter((u: UserAccount) => u.id !== currentUser.id && u.email !== currentUser.email)
          : data.users;
        setUsers(filtered);
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

  const handleRoleChange = async (targetUser: UserAccount, newRole: 'ADMIN' | 'CUSTOMER') => {
    // Rule 1: An Admin must never be able to demote their own account.
    if (currentUser && targetUser.id === currentUser.id) {
      showToast('Security Error: You cannot modify your own role.');
      return;
    }

    const actionName = newRole === 'ADMIN' ? 'promote to Administrator' : 'demote to Normal User';
    if (!confirm(`Are you sure you want to ${actionName} "${targetUser.name}" (${targetUser.email})?`)) {
      return;
    }

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
      } else {
        showToast(data.error || 'Failed to update role');
      }
    } catch (err) {
      showToast('Role update failed');
    }
  };

  const handleStatusChange = async (targetUser: UserAccount, newStatus: 'Active' | 'Blocked') => {
    if (currentUser && targetUser.id === currentUser.id) {
      showToast('Security Error: You cannot block your own account.');
      return;
    }

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
        showToast(data.message || `Account access updated to ${newStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
        );
        if (selectedUser && selectedUser.id === targetUser.id) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      } else {
        showToast(data.error || 'Failed to update access status');
      }
    } catch (err) {
      showToast('Status update failed');
    }
  };

  const handlePasswordReset = async (user: UserAccount, customPass?: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          action: 'RESET_PASSWORD',
          temporaryPassword: customPass || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.temporaryPassword) {
        setTempPasswordModal({
          user,
          tempPass: data.temporaryPassword,
        });
        setIsResettingWithCustom(false);
        setCustomPasswordInput('');
        showToast('Password reset successfully!');
      } else {
        showToast(data.error || 'Password reset failed');
      }
    } catch (err) {
      showToast('Password reset failed');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.city && u.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* 1. Admin Security Notice Banner */}
      <div className="bg-[#093624] text-white p-4 rounded-xs shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F9F295] text-[#093624] flex items-center justify-center font-bold">
            <Shield size={18} />
          </div>
          <div>
            <div className="font-satoshi-bold text-sm">All Registered Accounts & Role Management</div>
            <div className="text-xs text-white/70">
              Displaying all users except your active session ({currentUser?.email || 'Logged-in Admin'}). Full RBAC enforcement active.
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F9F295] text-xs font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white border border-[#EBEBEB] p-4 sm:p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter accounts by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624] cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="ADMIN">Admins Only</option>
            <option value="CUSTOMER">Normal Users (Customers)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi-med rounded-xs text-[#141414] focus:outline-none focus:border-[#093624] cursor-pointer"
          >
            <option value="All">All Account Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Blocked">Blocked / Suspended</option>
          </select>
        </div>
      </div>

      {/* 3. All Users Table */}
      <div className="bg-white border border-[#EBEBEB] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F9F9F9] border-b border-[#EBEBEB] text-brand-black uppercase tracking-wider text-[11px] font-satoshi-bold">
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Auth Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-center">Manage Role</th>
                <th className="py-3 px-4 text-center">Security & Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-satoshi">
                    Querying users from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-satoshi">
                    No other user accounts found in database.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/75 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            u.role === 'ADMIN'
                              ? 'bg-[#093624] text-[#F9F295]'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-satoshi-bold text-[#141414]">{u.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">{u.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4">
                      <div className="text-[#141414] font-medium">{u.email}</div>
                      <div className="text-[10px] text-gray-500">{u.phone || 'No phone'}</div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4 font-satoshi-bold">
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

                    {/* Auth Method */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono uppercase bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                        {u.authProvider}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Role Promotion / Demotion */}
                    <td className="py-3.5 px-4 text-center">
                      {u.role === 'CUSTOMER' ? (
                        <button
                          onClick={() => handleRoleChange(u, 'ADMIN')}
                          className="px-2.5 py-1 bg-[#093624] hover:bg-[#052216] text-[#F9F295] text-[11px] font-bold rounded-xs cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                          title="Promote Normal User to Admin"
                        >
                          <Shield size={12} />
                          <span>Promote to Admin</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(u, 'CUSTOMER')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold rounded-xs cursor-pointer transition-colors inline-flex items-center gap-1"
                          title="Demote Admin to Normal User"
                        >
                          <UserCheck size={12} />
                          <span>Demote to User</span>
                        </button>
                      )}
                    </td>

                    {/* Security Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Reset Password */}
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsResettingWithCustom(true);
                          }}
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-xs transition-colors cursor-pointer border border-amber-200"
                          title="Reset Password / Assign Password"
                        >
                          <KeyRound size={14} />
                        </button>

                        {/* Block / Unblock */}
                        <button
                          onClick={() => handleStatusChange(u, u.status === 'Active' ? 'Blocked' : 'Active')}
                          className={`p-1.5 rounded-xs transition-colors cursor-pointer border ${
                            u.status === 'Active'
                              ? 'text-red-600 hover:bg-red-50 border-red-200'
                              : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                          }`}
                          title={u.status === 'Active' ? 'Block user account' : 'Unblock user account'}
                        >
                          {u.status === 'Active' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                        </button>

                        {/* View Full Info */}
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 text-gray-600 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer border border-gray-200"
                          title="View user account details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. User Inspection & Custom Password Reset Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xs border border-[#EBEBEB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#093624] text-white">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#F9F295]" />
                <h3 className="text-base font-bold font-satoshi-bold">User Account & Security</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setIsResettingWithCustom(false);
                }}
                className="p-1 text-white/70 hover:text-white rounded-xs hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 font-satoshi text-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${
                    selectedUser.role === 'ADMIN'
                      ? 'bg-[#093624] text-[#F9F295]'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold font-satoshi-bold text-[#141414]">
                    {selectedUser.name}
                  </h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold bg-[#093624] text-[#F9F295]">
                      Role: {selectedUser.role}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-satoshi-bold bg-gray-100 text-gray-700">
                      Auth: {selectedUser.authProvider}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Security Guarantee */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs text-gray-700 text-[11px] leading-relaxed">
                <div className="font-bold text-[#141414] mb-1 flex items-center gap-1">
                  <Lock size={12} className="text-[#093624]" />
                  <span>Password Security Guarantee</span>
                </div>
                Existing passwords cannot be viewed by Administrators because they are stored using strong, one-way cryptographic hashing (bcrypt). You can assign a new temporary password below.
              </div>

              {/* Password Reset Section */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="font-bold font-satoshi-bold text-[#141414]">Password Management</div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPasswordInput}
                    onChange={(e) => setCustomPasswordInput(e.target.value)}
                    placeholder="Enter custom new password (or leave empty for random)"
                    className="flex-1 px-3 py-2 bg-[#F9F9F9] border border-gray-300 rounded-xs text-xs font-mono focus:outline-none focus:border-[#093624]"
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordReset(selectedUser, customPasswordInput.trim() || undefined)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xs cursor-pointer text-xs uppercase tracking-wider shrink-0"
                  >
                    Set Password
                  </button>
                </div>
              </div>

              {/* Role & Status Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="font-bold font-satoshi-bold text-[#141414]">Privileges & Access Control</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange(selectedUser, selectedUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')
                    }
                    className="py-2 px-3 border border-[#093624] text-[#093624] font-bold rounded-xs hover:bg-[#093624] hover:text-[#F9F295] transition-colors cursor-pointer text-center text-[11px]"
                  >
                    {selectedUser.role === 'ADMIN' ? 'Demote to Customer' : 'Promote to Admin'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedUser, selectedUser.status === 'Active' ? 'Blocked' : 'Active')
                    }
                    className={`py-2 px-3 font-bold rounded-xs transition-colors cursor-pointer text-center text-[11px] ${
                      selectedUser.status === 'Active'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {selectedUser.status === 'Active' ? 'Suspend Account' : 'Reactivate Access'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setIsResettingWithCustom(false);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-satoshi-bold rounded-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Temporary Password Confirmation Modal */}
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
              The password for <strong>{tempPasswordModal.user.email}</strong> has been updated. Provide this credential securely to the user:
            </p>
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-xs font-mono text-sm font-bold text-[#093624] select-all">
              {tempPasswordModal.tempPass}
            </div>
            <p className="text-[11px] text-gray-500">
              All previous sessions for this account were terminated. The user can now log in and change their password anytime.
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
    </div>
  );
};
