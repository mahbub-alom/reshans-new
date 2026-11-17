'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-none border px-2 py-0.5 text-[10px] font-satoshi-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#093624] text-[#F9F295]',
        secondary:
          'border-transparent bg-[#F9F295] text-[#093624]',
        outline:
          'text-[#141414] border-[#EBEBEB]',
        destructive:
          'border-transparent bg-[#093624] text-[#F9F295]',
        success:
          'border-transparent bg-[#093624]/10 text-[#093624]',
        warning:
          'border-transparent bg-[#F9F295] text-[#093624]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
