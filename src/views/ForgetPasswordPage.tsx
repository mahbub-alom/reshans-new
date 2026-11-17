import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const ForgetPasswordPage: React.FC = () => {
  const { navigate } = useShop();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen text-[#141414] font-satoshi">
      {/* Forget Password Area Start matching .aq-login-ptb */}
      <div className="py-16 sm:py-24">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="max-w-[1000px] mx-auto bg-white border border-[#EBEBEB] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Left Column: Visual Thumb Image (lg:col-span-6 order-2 lg:order-1) */}
              <div className="lg:col-span-6 order-2 lg:order-1 bg-[#F9F9F9] relative flex items-center justify-center overflow-hidden min-h-[280px] lg:min-h-[520px]">
                <img
                  src="/assets/img/others/login-thumb-1.jpg"
                  alt="Reshans Fashion Password Recovery"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Right Column: Reset Form Content (lg:col-span-6 order-1 lg:order-2) */}
              <div className="lg:col-span-6 order-1 lg:order-2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                {/* Header Top Title matching .aq-login-top */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold font-satoshi-bold text-brand-black mb-2 tracking-tight">
                    Forgot password
                  </h3>
                  <p className="text-sm text-brand-body font-satoshi">
                    No worries, we’ll send you reset instructions.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center space-y-5 py-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold font-satoshi-bold text-brand-black">
                        Reset instructions sent!
                      </h4>
                      <p className="text-xs text-brand-body font-satoshi">
                        We sent a secure password reset link to <strong className="text-brand-black font-satoshi-bold">{email}</strong>. Please check your inbox.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => navigate('/login')}
                    >
                      Back to Log in
                    </Button>
                  </div>
                ) : (
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

                    {/* Reset Password Button & Back to login link */}
                    <div className="pt-2 text-center space-y-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                      >
                        Reset Password
                      </Button>

                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center justify-center gap-2 text-xs font-satoshi-bold text-brand-black hover:text-primary transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back to Log in</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
