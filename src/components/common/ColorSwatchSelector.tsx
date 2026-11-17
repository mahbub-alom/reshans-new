'use client';

import React from 'react';

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

interface ColorSwatchSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelect: (colorName: string) => void;
  size?: 'sm' | 'md';
  showCheck?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const ColorSwatchSelector: React.FC<ColorSwatchSelectorProps> = ({
  colors,
  selectedColor,
  onSelect,
  size = 'md',
  ariaLabel = 'Select color',
  className = '',
}) => {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`flex items-center flex-wrap ${size === 'sm' ? 'gap-1.5' : 'gap-2'} ${className}`}
    >
      {colors.map((color) => {
        const isSelected = selectedColor === color.name;

        return (
          <button
            key={color.name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(color.name);
            }}
            className={`${
              size === 'sm' ? 'px-2 py-1 text-[11px]' : 'min-w-16 h-10 px-3.5 text-xs'
            } rounded-xs border font-bold font-satoshi-bold transition-all cursor-pointer ${
              isSelected
                ? 'border-[#093624] bg-[#093624] text-[#F9F295]'
                : 'border-[#E8E5E3] bg-white text-[#141414] hover:border-[#093624]'
            }`}
          >
            {color.name}
          </button>
        );
      })}
    </div>
  );
};
