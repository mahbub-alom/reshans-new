'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-[#093624] text-white py-3 px-4 rounded-xs shadow-2xl border border-[#0d4a32] animate-bounce-in">
      <CheckCircle2 size={18} className="text-[#F9F295] shrink-0" />
      <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
      <button
        onClick={clearToast}
        aria-label="Dismiss message"
        className="text-white/60 hover:text-white ml-2 p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
};
