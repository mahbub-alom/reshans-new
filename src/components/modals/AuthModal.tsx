import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Button } from '../common/Button';
import { X, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, closeAuth, navigate } = useShop();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      setSuccessMsg(`Welcome back to Reshans, ${email.split('@')[0]}!`);
    } else {
      setSuccessMsg(`Account created successfully for ${name}! Welcome to Reshans.`);
    }
    setTimeout(() => {
      setSuccessMsg('');
      closeAuth();
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    setSuccessMsg(`Successfully authenticated via ${provider}! Welcome to Reshans.`);
    setTimeout(() => {
      setSuccessMsg('');
      closeAuth();
    }, 1500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-[visibility] duration-300 ${
        isAuthOpen ? 'visible' : 'invisible delay-300 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={closeAuth}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isAuthOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-xs max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-gray-100 font-satoshi max-h-[95vh] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAuthOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Animated Close Button on Hover */}
        <button
          onClick={closeAuth}
          aria-label="Close modal"
          className="group absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-[#141414] transition-all duration-300 cursor-pointer shadow-xs"
        >
          <X size={18} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 mb-6 font-satoshi-bold">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors cursor-pointer ${
              tab === 'login'
                ? 'text-[#093624] border-b-2 border-[#093624]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors cursor-pointer ${
              tab === 'register'
                ? 'text-[#093624] border-b-2 border-[#093624]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {successMsg ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[#F9F295] text-[#093624] mx-auto flex items-center justify-center mb-3 text-xl font-bold">
              ✓
            </div>
            <h4 className="text-base font-bold text-[#093624] font-satoshi-bold">{successMsg}</h4>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Social Authentication Buttons */}
            <div>
              <p className="text-xs text-[#7A7A7A] text-center font-medium mb-3">
                {tab === 'login' ? 'Sign in with your social account' : 'Sign up using social account'}
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-300 hover:border-[#093624] rounded-xs bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
                  title="Sign in with Google"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17.4C3.7 21.1 7.5 24 12 24z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Facebook')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-300 hover:border-[#1877F2] rounded-xs bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
                  title="Sign in with Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Facebook</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-300 hover:border-black rounded-xs bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
                  title="Sign in with Apple"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.02-.5 2.63-1.23z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Apple</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                Or with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="text-xs font-bold text-[#141414] block mb-1 font-satoshi-bold">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mahbub Alom"
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#093624] font-satoshi"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#141414] block mb-1 font-satoshi-bold">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#093624] font-satoshi"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#141414] block mb-1 font-satoshi-bold">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-9 py-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#093624] font-satoshi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {tab === 'login' && (
                <div className="flex items-center justify-between text-xs text-[#7A7A7A] pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded-xs accent-[#093624]" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      closeAuth();
                      navigate('/forget-password');
                    }}
                    className="hover:underline text-primary font-medium font-satoshi-med cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                className="mt-3"
              >
                {tab === 'login' ? 'Sign In to Reshans' : 'Create Reshans Account'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
