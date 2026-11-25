'use client';

import React, { useState } from 'react';
import {
  Star,
  Check,
  X,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { ReviewItem } from '../../../types';
import { useShop } from '../../../context/ShopContext';

export const AdminReviewsTab: React.FC = () => {
  const { reviews, approveReview, rejectReview, toggleHideReview, deleteReview } = useShop();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'hidden'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const hiddenCount = reviews.filter((r) => r.status === 'hidden').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-6 font-satoshi">
      {/* 1. Header & Filter Tabs */}
      <div className="bg-white border border-[#EBEBEB] p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-satoshi-bold text-[#141414] flex items-center gap-2">
            <Star size={18} className="text-[#093624]" />
            <span>Customer Reviews Moderation</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time control: Approve to publish on display, reject, toggle hide/off display, or delete permanently.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'pending', 'approved', 'hidden', 'rejected'] as const).map((status) => {
            const count =
              status === 'pending'
                ? pendingCount
                : status === 'approved'
                ? approvedCount
                : status === 'hidden'
                ? hiddenCount
                : status === 'rejected'
                ? rejectedCount
                : reviews.length;

            return (
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
                {count > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                      filter === status ? 'bg-[#F9F295] text-[#093624]' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
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
                  src={rev.productImage || '/assets/img/fashion-1/product/product-1/front-img-1.jpg'}
                  alt={rev.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                    {rev.productName}
                  </h4>
                  {rev.orderId && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      Order #{rev.orderId}
                    </span>
                  )}
                  <span
                    className={`text-[9px] font-satoshi-bold uppercase px-2 py-0.5 rounded-xs ${
                      rev.status === 'approved'
                        ? 'bg-[#093624] text-[#F9F295]'
                        : rev.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : rev.status === 'hidden'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-[#F9F295] text-[#093624]'
                    }`}
                  >
                    {rev.status === 'approved'
                      ? 'Live on Display'
                      : rev.status === 'hidden'
                      ? 'Display Off (Hidden)'
                      : rev.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                  <div className="flex items-center text-[#093624] gap-1">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                      const fill = Math.max(0, Math.min(1, rev.rating - (starIndex - 1)));
                      return (
                        <div key={starIndex} className="relative inline-block w-3.5 h-3.5">
                          <Star size={14} className="text-gray-300" />
                          {fill > 0 && (
                            <div
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{ width: `${fill * 100}%` }}
                            >
                              <Star size={14} className="fill-[#093624] text-[#093624]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <span className="text-[11px] font-bold text-[#093624] ml-1">
                      {rev.rating.toFixed(1)}
                    </span>
                  </div>

                  <span className="text-gray-400">•</span>

                  <span className="font-satoshi-bold text-gray-700">{rev.customerName}</span>
                  {rev.customerEmail && (
                    <span className="text-gray-400 text-[11px]">({rev.customerEmail})</span>
                  )}

                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#093624] bg-[#F9F295]/50 px-1.5 py-0.2 rounded-xs font-satoshi-bold">
                      <ShieldCheck size={11} />
                      Verified In-Hand
                    </span>
                  )}

                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-[11px]">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-700 font-satoshi bg-[#F9F9F9] p-3 rounded-xs border border-[#EBEBEB]">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            {/* Right: Moderation Actions */}
            <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 min-w-36">
              {/* Approve Button */}
              {rev.status !== 'approved' && (
                <button
                  onClick={() => approveReview(rev.id)}
                  className="w-full px-3 py-1.5 bg-[#093624] hover:opacity-90 text-[#F9F295] rounded-xs text-xs font-satoshi-bold transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check size={13} />
                  <span>Approve</span>
                </button>
              )}

              {/* Display Toggle (Hide / Show) */}
              <button
                onClick={() => toggleHideReview(rev.id)}
                className={`w-full px-3 py-1.5 rounded-xs text-xs font-satoshi-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  rev.status === 'hidden'
                    ? 'bg-[#F9F295] text-[#093624] hover:bg-[#eae385]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={rev.status === 'hidden' ? 'Show on public product page' : 'Hide from public product page'}
              >
                {rev.status === 'hidden' ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>{rev.status === 'hidden' ? 'Show Display' : 'Hide Display'}</span>
              </button>

              {/* Reject Button */}
              {rev.status !== 'rejected' && (
                <button
                  onClick={() => rejectReview(rev.id)}
                  className="w-full px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-xs text-xs font-satoshi-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X size={13} />
                  <span>Reject</span>
                </button>
              )}

              {/* Permanent Delete */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to permanently delete this review?')) {
                    deleteReview(rev.id);
                  }
                }}
                className="w-full p-1.5 text-gray-400 hover:text-red-600 rounded-xs transition-colors cursor-pointer text-xs flex items-center justify-center gap-1"
                title="Delete review permanently"
              >
                <Trash2 size={13} />
                <span>Delete</span>
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
