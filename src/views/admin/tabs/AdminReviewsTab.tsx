'use client';

import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Check,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { ReviewItem } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminReviewsTab: React.FC = () => {
  const { reviews, approveReview, rejectReview, deleteReview } = useShop();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 font-satoshi">
      {/* 1. Header & Filter Tabs */}
      <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
            <Star size={18} className="text-[#093624]" />
            <span>Customer Reviews Moderation</span>
          </h3>
          
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xs text-xs font-satoshi-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === status
                  ? 'bg-[#093624] text-[#F9F295] shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{status}</span>
              {status === 'pending' && pendingCount > 0 && (
                <span className="w-4 h-4 bg-[#F9F295] text-[#093624] rounded-full text-[9px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Reviews List */}
      <div className="space-y-3.5">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs hover:border-[#093624] transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            {/* Left: Product & Customer & Review text */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-14 h-16 bg-gray-100 rounded-xs overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={rev.productImage}
                  alt={rev.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                    {rev.productName}
                  </h4>
                  <span
                    className={`text-[9px] font-satoshi-bold uppercase px-2 py-0.5 rounded-xs ${
                      rev.status === 'approved'
                        ? 'bg-[#093624] text-[#F9F295]'
                        : rev.status === 'rejected'
                        ? 'bg-[#F1EFEE] text-[#6D6868]'
                        : 'bg-[#F9F295] text-[#093624]'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs mb-2">
                  <div className="flex text-[#093624]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                    ))}
                  </div>

                  <span className="text-gray-400">•</span>

                  <span className="font-satoshi-bold text-gray-700">{rev.customerName}</span>

                  {/* {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#093624] bg-[#F9F295]/50 px-1.5 py-0.2 rounded-xs font-satoshi-bold">
                      <ShieldCheck size={11} />
                      Verified In-Hand Delivery
                    </span>
                  )} */}

                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-[11px]">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-700 font-satoshi bg-[#F9F9F9] p-3 rounded-xs border border-[#EBEBEB]">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            {/* Right: Moderation Actions */}
            <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
              {rev.status !== 'approved' && (
                <button
                  onClick={() => approveReview(rev.id)}
                  className="w-full px-3 py-1.5 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check size={13} />
                  <span>Approve</span>
                </button>
              )}

              {rev.status !== 'rejected' && (
                <button
                  onClick={() => rejectReview(rev.id)}
                  className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xs text-xs font-satoshi-bold transition-colors cursor-pointer"
                >
                  Reject
                </button>
              )}

              <button
                onClick={() => deleteReview(rev.id)}
                className="p-1.5 text-gray-400 hover:text-[#093624] rounded-xs transition-colors cursor-pointer"
                title="Delete review"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="bg-white border border-[#EBEBEB] p-12 text-center rounded-xs shadow-2xs">
            <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
            <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">No reviews found</h4>
            <p className="text-xs text-gray-500 font-satoshi mt-1">
              There are no reviews matching this filter state.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
