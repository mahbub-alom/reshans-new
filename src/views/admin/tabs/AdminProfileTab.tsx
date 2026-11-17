'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Key,
  Smartphone,
  Lock,
  Clock,
  Laptop,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

export const AdminProfileTab: React.FC = () => {
  const { adminProfile, updateAdminProfile, showToast } = useShop();

  const [name, setName] = useState(adminProfile.name);
  const [email, setEmail] = useState(adminProfile.email);
  const [role, setRole] = useState(adminProfile.role);
  const [twoFactor, setTwoFactor] = useState(adminProfile.twoFactorEnabled);

  // Password state
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({ name, email, role, twoFactorEnabled: twoFactor });
    showToast('Admin profile details updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      showToast('New passwords do not match. Please verify.');
      return;
    }
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Administrator password updated successfully!');
  };

  return (
    <div className="space-y-8 font-satoshi text-xs">
      {/* 1. Profile Account Card */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
          <User size={18} className="text-[#093624]" />
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Administrator Account
            </h3>
            <p className="text-xs text-brand-body">
              Manage your administrator credentials and console access
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 pb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#093624] bg-gray-100 shrink-0">
              <img
                src={adminProfile.avatar || '/assets/img/others/dashboard-avater.jpg'}
                alt={adminProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                {adminProfile.name}
              </h4>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#093624] text-[#F9F295] font-satoshi-bold text-[10px] rounded-xs uppercase tracking-wider">
                {adminProfile.role}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">{adminProfile.lastLogin}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              />
            </div>

            <div>
              <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              />
            </div>

            <div>
              <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                Console Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              >
                <option value="Super Administrator">Super Administrator</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Catalog Editor">Catalog Editor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs font-satoshi-bold uppercase tracking-wider transition-opacity cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security & Password Change */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
          <Key size={18} className="text-[#093624]" />
          <div>
            <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
              Change Password
            </h3>
            <p className="text-xs text-brand-body">
              Ensure your store administrator account is secured with a complex password
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passForm.currentPassword}
              onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              />
            </div>

            <div>
              <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs font-satoshi-bold uppercase tracking-wider transition-opacity cursor-pointer"
            >
              Save New Password
            </button>
          </div>
        </form>
      </div>

      {/* 3. Two-Factor Authentication & Audit Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA */}
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
            <Smartphone size={18} className="text-[#093624]" />
            <div>
              <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                Two-Factor Authentication (2FA)
              </h4>
              <p className="text-xs text-brand-body">
                Requires OTP confirmation upon each login
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs">
            <div>
              <span className="font-satoshi-bold text-[#141414] block">Authenticator App & SMS</span>
              <span className="text-[11px] text-gray-500">Currently active on +880 1700 000 000</span>
            </div>
            <button
              onClick={() => {
                setTwoFactor(!twoFactor);
                updateAdminProfile({ twoFactorEnabled: !twoFactor });
                showToast(`Two-factor authentication ${!twoFactor ? 'enabled' : 'disabled'}`);
              }}
              className={`px-3 py-1 rounded-xs font-satoshi-bold text-xs cursor-pointer transition-colors ${
                twoFactor ? 'bg-[#093624] text-[#F9F295]' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {twoFactor ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Audit Sessions */}
        <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EBEBEB]">
            <Laptop size={18} className="text-[#093624]" />
            <div>
              <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                Active Console Sessions
              </h4>
              <p className="text-xs text-brand-body">
                Devices authorized to access this administration panel
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-[#F9F295]/40 border border-[#093624]/30 rounded-xs flex items-center justify-between">
              <div>
                <div className="font-satoshi-bold text-[#093624]">
                  <span>Chrome on macOS (Current)</span>
                </div>
                <div className="text-[10px] text-gray-500">Dhaka, Bangladesh • IP: 103.230.104.12</div>
              </div>
              <span className="text-[10px] font-satoshi-bold text-[#093624] bg-[#F9F295] px-2 py-0.5 rounded-xs">
                Current Session
              </span>
            </div>

            <div className="p-3 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs flex items-center justify-between">
              <div>
                <div className="font-satoshi-bold text-[#141414]">Safari on iPhone 15 Pro</div>
                <div className="text-[10px] text-gray-500">Gulshan, Dhaka • Yesterday at 10:14 PM</div>
              </div>
              <button
                onClick={() => showToast('Session revoked.')}
                className="text-[10px] text-[#6D6868] hover:text-[#093624] hover:underline font-satoshi-bold cursor-pointer"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
