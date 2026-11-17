import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Shield, Lock, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';

export const DashboardSecurityPage: React.FC = () => {
  const { navigate } = useShop();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please verify.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setIsSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <DashboardLayout activeTab="security" title="Security">
      <div className="space-y-6">
        {/* Top bar with back button matching .aq-dashboard-top */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            Security
          </h3>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        {/* Change password Card matching .aq-dashboard-security-box */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-base font-bold font-satoshi-bold text-brand-black">
                Change password
              </h4>
              <p className="text-xs text-brand-body font-satoshi">
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#F1EFEE] border border-[#141414] text-[#141414] text-xs font-satoshi-bold">
              {error}
            </div>
          )}

          {isSaved && (
            <div className="p-4 bg-[#F9F295]/50 border border-[#093624] text-[#093624] text-xs font-satoshi-bold flex items-center gap-2">
              <Check size={16} />
              <span>Your account password has been updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                Current password <span className="text-[#093624]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="*********"
                  className="w-full h-12 bg-white border border-[#E0DCD9] pl-4 pr-11 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                New Password <span className="text-[#093624]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="*********"
                  className="w-full h-12 bg-white border border-[#E0DCD9] pl-4 pr-11 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                Password Confirmation <span className="text-[#093624]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="*********"
                  className="w-full h-12 bg-white border border-[#E0DCD9] pl-4 pr-11 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button
                type="submit"
                variant="primary"
                size="md"
              >
                Save Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
