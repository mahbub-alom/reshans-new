'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-satoshi-bold uppercase tracking-wider text-xs font-bold transition-all duration-300 rounded-none cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-[#093624] text-[#F9F295] hover:bg-[#052216] hover:text-white shadow-xs',
        secondary: 'bg-[#F9F295] text-[#093624] hover:bg-[#fae968] hover:shadow-md shadow-xs',
        black: 'bg-[#141414] text-white hover:bg-[#093624] hover:text-[#F9F295] shadow-xs',
        outline: 'bg-transparent border border-gray-300 text-[#141414] hover:bg-[#141414] hover:text-white hover:border-[#141414]',
        'outline-white': 'bg-transparent border border-white text-white hover:bg-white hover:text-[#141414]',
        ghost: 'bg-transparent text-[#141414] hover:bg-gray-100 hover:text-[#093624]',
        destructive: 'bg-[#093624] text-[#F9F295] hover:bg-[#052216] shadow-xs',
      },
      size: {
        default: 'h-12 px-7 text-xs',
        sm: 'h-9 px-4 text-[11px]',
        lg: 'h-14 px-10 text-xs sm:text-sm tracking-widest',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
