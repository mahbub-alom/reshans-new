'use client';

import React from 'react';

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 4, className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8' }) => {
  return (
    <div className={className}>
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col h-full bg-white rounded-xs overflow-hidden border border-gray-100 p-2 sm:p-3 animate-pulse"
        >
          {/* Skeleton Thumbnail */}
          <div className="relative aspect-[3/4] w-full bg-gray-200/80 rounded-xs mb-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
          </div>

          {/* Skeleton Rating / Tags */}
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            ))}
          </div>

          {/* Skeleton Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />

          {/* Skeleton Price */}
          <div className="h-3.5 bg-gray-200 rounded w-1/3 mx-auto" />
        </div>
      ))}
    </div>
  );
};
