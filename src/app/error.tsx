'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/common/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-24 sm:py-32 font-satoshi text-[#141414]">
      <div className="max-w-[1330px] mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold font-satoshi-bold text-[#141414] mb-8 tracking-tight">
          Error
        </h1>

        <div className="max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl uppercase tracking-wider font-bold font-satoshi-med text-[#141414] mb-3">
            An unexpected error occurred
          </h2>
          <p className="text-base sm:text-lg text-[#57575A] font-satoshi mb-8">
            {error.message || 'Something went wrong while rendering this page.'}
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => reset()} variant="primary" size="lg">
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="black" size="lg">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
