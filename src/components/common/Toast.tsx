'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, toastType, clearToast } = useShop();

  if (!toastMessage) return null;

  const isError = toastType === 'error';

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 py-3.5 px-4.5 rounded-xs shadow-2xl transition-all duration-300 animate-bounce-in ${
        isError
          ? 'bg-red-600 text-white border-2 border-red-400 ring-4 ring-red-500/20 shadow-red-950/30'
          : 'bg-[#093624] text-white border border-[#0d4a32]'
      }`}
    >
      {isError ? (
        <div className="w-5 h-5 rounded-full bg-white text-red-600 flex items-center justify-center shrink-0">
          <AlertTriangle size={13} className="stroke-[2.5]" />
        </div>
      ) : (
        <CheckCircle2 size={18} className="text-[#F9F295] shrink-0" />
      )}
      <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
      <button
        onClick={clearToast}
        aria-label="Dismiss message"
        className="text-white/70 hover:text-white ml-2 p-0.5 cursor-pointer"
      >
        <X size={15} />
      </button>
    </div>
  );
};
