'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-[#141414] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-4">Application Error</h1>
          <p className="text-gray-600 mb-6">
            {error.message || 'A critical error occurred while loading Reshans.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#093624] text-[#F9F295] font-semibold rounded-lg hover:bg-[#072a1c] transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
