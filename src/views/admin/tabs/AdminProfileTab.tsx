'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Key,
  Laptop,
  CheckCircle2,
  Save,
  Upload,
  Camera,
  Trash2,
  LogOut,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

interface SessionItem {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  isCurrent: boolean;
}

export const AdminProfileTab: React.FC = () => {
  const { adminProfile, updateAdminProfile, showToast, authToken, currentUser } = useShop();

  const [name, setName] = useState(adminProfile.name || '');
  const [email, setEmail] = useState(adminProfile.email || '');
  const [avatar, setAvatar] = useState(adminProfile.avatar || '');
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  // Password state
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password requirements regex: min 8 chars, 1 uppercase, 1 lowercase, 1 special character
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {};
    const token = authToken || (typeof window !== 'undefined' ? localStorage.getItem('reshans_auth_token') : null);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch Admin's own profile and active device sessions from backend API
  const fetchProfileAndSessions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/profile', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setName(data.admin.name || '');
        setEmail(data.admin.email || '');
        if (data.admin.avatar) {
          setAvatar(data.admin.avatar);
          updateAdminProfile({ avatar: data.admin.avatar, name: data.admin.name, email: data.admin.email });
        }
        if (data.sessions) {
          setSessions(data.sessions);
        }
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSessions();
  }, []);

  // Update name / avatar
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Admin display name cannot be blank.');
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update_profile',
          name: name.trim(),
          avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to update profile');
        return;
      }

      updateAdminProfile({ name: data.admin.name, avatar: data.admin.avatar });
      showToast('Admin profile details updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Error updating profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Photo upload to Cloudinary (max 2048 KB)
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size: 2048 KB max (2048 * 1024 bytes)
    const MAX_SIZE = 2048 * 1024;
    if (file.size > MAX_SIZE) {
      showToast(`Image exceeds 2048 KB limit (${(file.size / 1024).toFixed(1)} KB). Please choose a smaller photo.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate image mime
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/profile/avatar', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to upload photo to Cloudinary');
        return;
      }

      const newAvatarUrl = data.url;
      setAvatar(newAvatarUrl);

      // Auto update DB with the Cloudinary image link
      const updateRes = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update_profile',
          name,
          avatar: newAvatarUrl,
        }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        updateAdminProfile({ avatar: newAvatarUrl });
        showToast('Profile photo uploaded and updated successfully!');
      } else {
        showToast('Photo uploaded to Cloudinary, please click Update Profile to save.');
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Change password with regex enforcement and bcrypt hashing
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    // Check regex: min 8 chars, 1 uppercase, 1 lowercase, 1 special character
    if (!PASSWORD_REGEX.test(passForm.newPassword)) {
      setPasswordError(
        'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 special character.'
      );
      return;
    }

    try {
      setIsSavingPass(true);
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'change_password',
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
          confirmPassword: passForm.confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordError(data.error || 'Failed to change password');
        showToast(data.error || 'Failed to change password');
        return;
      }

      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Administrator password updated successfully!');
    } catch (err: any) {
      setPasswordError(err.message || 'Error updating password');
    } finally {
      setIsSavingPass(false);
    }
  };

  // Revoke a specific device session
  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to log out this device?')) return;

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'revoke_session',
          sessionId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        showToast('Device session logged out successfully.');
      } else {
        showToast(data.error || 'Could not revoke session');
      }
    } catch (err: any) {
      showToast('Error revoking device session');
    }
  };

  // Revoke ALL OTHER device sessions (keep current device logged in)
  const handleRevokeOtherSessions = async () => {
    if (!confirm('Log out of all other devices except this current session?')) return;

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'revoke_other_sessions',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.isCurrent));
        showToast('All other devices have been logged out.');
      } else {
        showToast(data.error || 'Failed to revoke other sessions');
      }
    } catch (err: any) {
      showToast('Error revoking other sessions');
    }
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
              Manage your administrator details, profile picture, and credentials
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-4 border-b border-gray-100">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#093624] bg-gray-100 shrink-0 shadow-xs">
                <img
                  src={avatar || adminProfile.avatar || '/assets/img/others/dashboard-avater.jpg'}
                  alt={name || 'Admin'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Upload photo"
                className="absolute inset-0 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer text-[10px] font-bold"
              >
                {isUploading ? (
                  <Loader2 size={18} className="animate-spin text-[#F9F295]" />
                ) : (
                  <>
                    <Camera size={16} />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                  {name || 'Administrator'}
                </h4>
            
              </div>
              <p className="text-xs text-gray-500">
                Upload a profile image.
              </p>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-[#093624] hover:bg-[#052216] text-[#F9F295] rounded-xs font-satoshi-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={13} />
                      <span>Change Photo</span>
                    </>
                  )}
                </button>

                {avatar && avatar !== '/assets/img/others/dashboard-avater.jpg' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar('/assets/img/others/dashboard-avater.jpg');
                      showToast('Photo reset. Click Update Profile to save.');
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 hover:underline cursor-pointer font-satoshi-med"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Name */}
            <div>
              <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Full Name"
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              />
            </div>

            {/* Admin Email (Read-Only per Requirement 2) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-satoshi-bold uppercase tracking-wider text-brand-body">
                  Admin Email
                </label>
              
              </div>
              <input
                type="email"
                value={email}
                disabled
                readOnly
                title="Admin email cannot be changed"
                className="w-full px-3 py-2 bg-gray-100 border border-[#EBEBEB] text-gray-500 rounded-xs cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-5 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs font-satoshi-bold uppercase tracking-wider transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Update Profile</span>
                </>
              )}
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
              Password requirements: minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 special character
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-600" />
            <span>{passwordError}</span>
          </div>
        )}

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
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                placeholder="Min 8 chars, 1 uppercase, 1 special"
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
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#EBEBEB] rounded-xs focus:outline-none focus:border-[#093624]"
              />
            </div>
          </div>

          {/* Password Validation Hints */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs text-[11px] space-y-1 text-gray-600">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${passForm.newPassword.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`} />
              <span>At least 8 characters long</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passForm.newPassword) ? 'bg-green-600' : 'bg-gray-400'}`} />
              <span>At least 1 uppercase letter (A-Z)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passForm.newPassword) ? 'bg-green-600' : 'bg-gray-400'}`} />
              <span>At least 1 lowercase letter (a-z)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passForm.newPassword) ? 'bg-green-600' : 'bg-gray-400'}`} />
              <span>At least 1 special character (!@#$%^&*...)</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPass}
              className="px-5 py-2 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs font-satoshi-bold uppercase tracking-wider transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSavingPass ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save New Password</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Active Devices & Multi-Device Logout Management (2FA Removed) */}
      <div className="bg-white border border-[#EBEBEB] p-5 sm:p-6 rounded-xs shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2">
            <Laptop size={18} className="text-[#093624]" />
            <div>
              <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                Active Devices & Sessions
              </h3>
              <p className="text-xs text-brand-body">
                Manage signed-in devices authorized to access your Administrator Console
              </p>
            </div>
          </div>

          {sessions.filter((s) => !s.isCurrent).length > 0 && (
            <button
              type="button"
              onClick={handleRevokeOtherSessions}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xs font-satoshi-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <LogOut size={13} />
              <span>Log Out All Other Devices</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 size={24} className="animate-spin text-[#093624]" />
            <span className="text-xs">Loading active device sessions...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-xs">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const formattedDate = new Date(s.createdAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              // Parse user-agent briefly for nicer display
              let deviceTitle = 'Web Browser Session';
              if (s.userAgent.includes('Windows')) deviceTitle = 'Windows PC';
              else if (s.userAgent.includes('Macintosh') || s.userAgent.includes('Mac OS')) deviceTitle = 'macOS Desktop';
              else if (s.userAgent.includes('iPhone')) deviceTitle = 'Apple iPhone';
              else if (s.userAgent.includes('Android')) deviceTitle = 'Android Device';
              else if (s.userAgent.includes('Linux')) deviceTitle = 'Linux System';

              let browser = 'Browser';
              if (s.userAgent.includes('Edg/')) browser = 'Microsoft Edge';
              else if (s.userAgent.includes('Chrome/')) browser = 'Google Chrome';
              else if (s.userAgent.includes('Safari/') && !s.userAgent.includes('Chrome')) browser = 'Apple Safari';
              else if (s.userAgent.includes('Firefox/')) browser = 'Mozilla Firefox';

              return (
                <div
                  key={s.id}
                  className={`p-3.5 border rounded-xs flex items-center justify-between gap-3 ${
                    s.isCurrent
                      ? 'bg-[#F9F295]/20 border-[#093624]/40 ring-1 ring-[#093624]/20'
                      : 'bg-[#F9F9F9] border-[#EBEBEB]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        s.isCurrent ? 'bg-[#093624] text-[#F9F295]' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Laptop size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-satoshi-bold text-[#141414] text-xs">
                          {deviceTitle} • {browser}
                        </span>
                        {s.isCurrent && (
                          <span className="text-[9px] font-satoshi-bold text-[#093624] bg-[#F9F295] px-2 py-0.5 rounded-xs uppercase tracking-wider">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>IP: {s.ipAddress}</span>
                        <span>•</span>
                        <span>Signed in: {formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s.id)}
                      className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 rounded-xs text-[10px] font-satoshi-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Trash2 size={11} />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
