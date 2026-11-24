import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, loginUser, loginWithSocial } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await loginUser(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        const returnUrl = typeof window !== 'undefined' ? localStorage.getItem('reshans_return_url') : null;
        if (returnUrl) {
          localStorage.removeItem('reshans_return_url');
          navigate(returnUrl);
        } else if (email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 800);
    } else {
      setErrorMessage(result.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const handleSocialClick = async (provider: string, mockEmail: string, mockName: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await loginWithSocial(provider, mockEmail, mockName);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/dashboard');
      }, 800);
    } else {
      setErrorMessage(result.error || `${provider} authentication failed.`);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* Login Area Start matching .aq-login-ptb */}
      <div className="py-16 sm:py-24">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="max-w-[1000px] mx-auto bg-white border border-[#EBEBEB] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Visual Thumb Image (lg:col-span-6 order-2 lg:order-1) */}
              <div className="lg:col-span-6 order-2 lg:order-1 bg-[#F9F9F9] relative flex items-center justify-center overflow-hidden min-h-[300px] lg:min-h-[620px]">
                <img
                  src="/assets/img/others/login-thumb-1.jpg"
                  alt="Reshans Fashion Login"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Right Column: Login Form Content (lg:col-span-6 order-1 lg:order-2) */}
              <div className="lg:col-span-6 order-1 lg:order-2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                {/* Header Top Title matching .aq-login-top */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-brand-black mb-2 tracking-tight">
                    Sign in to Reshans.
                  </h3>
                  <p className="text-sm text-brand-body font-satoshi">
                    Please enter your details below to sign in.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-satoshi-bold text-center">
                    {errorMessage}
                  </div>
                )}

                {isSuccess && (
                  <div className="mb-6 p-3.5 bg-primary/10 border border-primary text-primary text-xs font-satoshi-bold text-center">
                    Welcome back! Signing you into your Reshans account...
                  </div>
                )}

                {/* Form Options */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                      Your Email <span className="text-[#093624]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@address.com"
                      className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors rounded-none font-satoshi"
                    />
                  </div>

                  {/* Password Input with show/hide toggle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                      Password <span className="text-[#093624]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6+ characters required"
                        className="w-full h-12 bg-white border border-[#E0DCD9] pl-4 pr-11 text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors rounded-none font-satoshi"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Suggestions: Remember me & Forgot password */}
                  <div className="flex items-center justify-between text-xs font-satoshi pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-brand-body hover:text-brand-black">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => navigate('/forget-password')}
                      className="text-brand-body hover:text-primary transition-colors cursor-pointer underline underline-offset-2"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button & Secondary CTA using global Button component */}
                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                    >
                      Login
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => navigate('/register')}
                    >
                      Create Account
                    </Button>
                  </div>
                </form>

                {/* Social Login Separator */}
                <div className="relative my-7 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#EAE6E4]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-brand-body font-satoshi">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Options matching reference */}
                <div className="flex items-center justify-center gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => {
                      const guestGoogleEmail = prompt('Enter Google Account Email for Social Login:', 'customer.google@gmail.com');
                      if (guestGoogleEmail) {
                        handleSocialClick('GOOGLE', guestGoogleEmail, guestGoogleEmail.split('@')[0]);
                      }
                    }}
                    title="Sign in with Google"
                    className="w-11 h-11 border border-[#E0DCD9] hover:border-primary flex items-center justify-center bg-white hover:bg-gray-50 transition-all rounded-none cursor-pointer"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                        fill="#34A853"
                      />
                      <path
                        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                        fill="#EA4335"
                      />
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => {
                      const guestFbEmail = prompt('Enter Facebook Account Email for Social Login:', 'customer.fb@facebook.com');
                      if (guestFbEmail) {
                        handleSocialClick('FACEBOOK', guestFbEmail, guestFbEmail.split('@')[0]);
                      }
                    }}
                    title="Sign in with Facebook"
                    className="w-11 h-11 border border-[#E0DCD9] hover:border-primary flex items-center justify-center bg-white hover:bg-gray-50 transition-all rounded-none cursor-pointer text-[#1877F2]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('apple.id@icloud.com');
                      setPassword('demo123456');
                    }}
                    title="Sign in with Apple"
                    className="w-11 h-11 border border-[#E0DCD9] hover:border-primary flex items-center justify-center bg-white hover:bg-gray-50 transition-all rounded-none cursor-pointer text-[#141414]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.04.62-2.7 1.39-.58.67-1.09 1.74-.95 2.78 1.03.08 2.02-.57 2.64-1.32z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
