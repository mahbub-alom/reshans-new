'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-24 sm:py-32 font-satoshi text-[#141414]">
      <div className="max-w-[1330px] mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold font-satoshi-bold text-[#141414] mb-8 tracking-tight">
          Oops!
        </h1>

        <div className="max-w-md sm:max-w-lg mx-auto mb-10 sm:mb-14">
          <img
            src="/assets/img/others/error.webp"
            alt="404 Page Not Found"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        <div className="max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl uppercase tracking-wider font-bold font-satoshi-med text-[#141414] mb-3">
            Something went Wrong...
          </h2>
          <p className="text-base sm:text-lg text-[#57575A] font-satoshi mb-8">
            Sorry, we couldn't find your page. It may have been moved or doesn't exist.
          </p>

          <Link href="/">
            <Button variant="black" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
