'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full bg-[#F9F9F9] border border-[#EBEBEB] px-3.5 py-2 text-xs font-satoshi text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-[#093624] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors rounded-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
