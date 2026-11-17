'use client';

import React from 'react';

export type ButtonVariant =
  | 'primary'      // Global deep green (#093624) with yellow text (#F9F295)
  | 'secondary'    // Global canary yellow (#F9F295) with deep green text (#093624)
  | 'black'        // Solid rich black (#141414) with white text, hover green
  | 'outline'      // Border with transparent bg
  | 'outline-white'// White border for dark hero/banner overlays
  | 'ghost';       // Subtle hover background

export type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  fullWidth = false,
  type = 'button',
  disabled = false,
  onClick,
  ...rest
}) => {
  // Base classes with global font family and micro-interactions
  const baseClasses =
    'inline-flex items-center justify-center font-satoshi-bold uppercase tracking-wider text-xs font-bold transition-all duration-300 rounded-none cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  // Variant styles mapped directly to global design tokens
  const variantClasses: Record<ButtonVariant, string> = {
    // Primary: #093624 background, #F9F295 text, hovers to deeper forest green
    primary:
      'bg-primary text-secondary hover:bg-primary-dark hover:text-white shadow-xs',

    // Secondary: #F9F295 background, #093624 text, hovers to bright canary / deeper green
    secondary:
      'bg-secondary text-primary hover:bg-[#fae968] hover:shadow-md shadow-xs',

    // Black: Default high-contrast e-commerce CTA, hovers to primary green
    black:
      'bg-brand-black text-white hover:bg-primary hover:text-secondary shadow-xs',

    // Outline: Minimal 1px border
    outline:
      'bg-transparent border border-gray-300 text-brand-black hover:bg-brand-black hover:text-white hover:border-brand-black',

    // Outline White: For dark hero & campaign promo banner overlays
    'outline-white':
      'bg-transparent border border-white text-white hover:bg-white hover:text-brand-black',

    // Ghost: Subtle flat button
    ghost:
      'bg-transparent text-brand-black hover:bg-gray-100 hover:text-primary',
  };

  // Size styling
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-[11px]',
    md: 'h-12 px-7 text-xs',
    lg: 'h-14 px-10 text-xs sm:text-sm tracking-widest',
    full: 'w-full h-12 px-6 text-xs',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim()}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="mr-2.5 shrink-0 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2.5 shrink-0 inline-flex items-center">{icon}</span>}
    </button>
  );
};
