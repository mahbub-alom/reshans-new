'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';
import {
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export const ForgetPasswordPage: React.FC = () => {
  const { navigate, showToast } = useShop();

  // Step 1: 'request' (enter email)
  // Step 2: 'verify_otp' (strictly enter OTP to validate first)
  // Step 3: 'new_password' (only accessible AFTER OTP is validated)
  // Step 4: 'success'
  const [step, setStep] = useState<'request' | 'verify_otp' | 'new_password' | 'success'>('request');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Request Password Reset OTP via Nodemailer strictly to email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.error || 'Failed to dispatch verification code.';
        setError(msg);
        showToast(msg, 'error');
        return;
      }

      showToast('A 6-digit verification code has been sent strictly to your email!', 'success');
      setStep('verify_otp');
    } catch (err: any) {
      console.error('Request OTP error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate OTP First (Strict requirement: must validate before opening password step)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('The verification code must be exactly 6 digits.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.error || 'Invalid or expired verification code.';
        setError(msg);
        showToast(msg, 'error');
        return;
      }

      showToast('Verification code confirmed! Now enter your new password.', 'success');
      // Transition to password reset step only upon successful validation
      setStep('new_password');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError('Network error validating code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in your new password and confirmation.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.error || 'Password reset failed.';
        setError(msg);
        showToast(msg, 'error');
        return;
      }

      showToast('Password reset successful! You may now sign in.', 'success');
      setStep('success');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError('Network error resetting password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      <div className="py-16 sm:py-24">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="max-w-[1000px] mx-auto bg-white border border-[#EBEBEB] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Left Column: Visual Thumb Image */}
              <div className="lg:col-span-6 order-2 lg:order-1 bg-[#F9F9F9] relative flex items-center justify-center overflow-hidden min-h-[280px] lg:min-h-[560px]">
                <img
                  src="/assets/img/others/login-thumb-1.jpg"
                  alt="Reshans Fashion Password Recovery"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Right Column: Dynamic Step-by-Step Reset Form */}
              <div className="lg:col-span-6 order-1 lg:order-2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                {/* Header Top Title */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-brand-black mb-1.5 tracking-tight">
                    {step === 'success'
                      ? 'Password Reset Complete'
                      : step === 'new_password'
                      ? 'Create New Password'
                      : step === 'verify_otp'
                      ? 'Enter Verification Code'
                      : 'Forgot Password'}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-body font-satoshi">
                    {step === 'success'
                      ? 'Your account credentials have been securely updated.'
                      : step === 'new_password'
                      ? 'Verification confirmed! Please set a new strong password.'
                      : step === 'verify_otp'
                      ? `We have sent a 6-digit code to ${email}`
                      : 'Enter your registered email to receive an OTP.'}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-satoshi-bold rounded-xs">
                    {error}
                  </div>
                )}

                {/* STEP 1: Enter Email */}
                {step === 'request' && (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5 font-satoshi-bold">
                        Your Registered Email <span className="text-[#093624]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="email@address.com"
                          className="w-full h-12 bg-white border border-[#E0DCD9] pl-10 pr-4 text-xs text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors rounded-none font-satoshi"
                        />
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 text-center space-y-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Sending to Email...
                          </span>
                        ) : (
                          'Send Verification Code'
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back to Log in</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: Strict OTP Verification First */}
                {step === 'verify_otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                          6-Digit Code  <span className="text-[#093624]">*</span>
                        </label>
                      
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value.replace(/[^0-9]/g, ''));
                            if (error) setError(null);
                          }}
                          placeholder="••••••"
                          autoFocus
                          className="w-full h-12 bg-white border border-[#E0DCD9] pl-10 pr-4 text-base font-mono tracking-widest text-center text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-primary rounded-none"
                        />
                        <KeyRound
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                     
                    </div>

                    <div className="pt-2 text-center space-y-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Verifying Code...
                          </span>
                        ) : (
                          'Verify Code'
                        )}
                      </Button>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setStep('request');
                            setError(null);
                          }}
                          className="text-gray-500 hover:text-black cursor-pointer font-satoshi"
                        >
                          Change Email
                        </button>
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          disabled={isLoading}
                          className="text-[#093624] font-bold font-satoshi-bold hover:underline cursor-pointer"
                        >
                          Resend Code to Email
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* STEP 3: Set New Password (Only shown after OTP is validated) */}
                {step === 'new_password' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-2.5 bg-green-50 border border-green-200 text-[#093624] text-xs font-satoshi-bold rounded-xs flex items-center gap-2">
                      <ShieldCheck size={16} />
                      <span>OTP verified! Set your new password below:</span>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5 font-satoshi-bold">
                        New Password <span className="text-[#093624]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="At least 6 characters"
                          className="w-full h-12 bg-white border border-[#E0DCD9] pl-10 pr-10 text-xs text-brand-black focus:outline-none focus:border-primary rounded-none"
                        />
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5 font-satoshi-bold">
                        Confirm New Password <span className="text-[#093624]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="Re-enter new password"
                          className="w-full h-12 bg-white border border-[#E0DCD9] pl-10 pr-10 text-xs text-brand-black focus:outline-none focus:border-primary rounded-none"
                        />
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 text-center space-y-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Updating Password...
                          </span>
                        ) : (
                          'Save New Password'
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* STEP 4: Success Screen */}
                {step === 'success' && (
                  <div className="text-center space-y-5 py-4">
                    <div className="w-14 h-14 bg-[#093624]/10 text-[#093624] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold font-satoshi-bold text-brand-black">
                        Password Updated Successfully!
                      </h4>
                      <p className="text-xs text-brand-body font-satoshi">
                        You can now sign in to your Reshans account using your new password.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => navigate('/login')}
                    >
                      Proceed to Log in
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
