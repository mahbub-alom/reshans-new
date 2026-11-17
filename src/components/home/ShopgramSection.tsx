'use client';

import React, { useRef, useState } from 'react';
import { SHOPGRAM_IMAGES, PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import { Instagram } from 'lucide-react';

export const ShopgramSection: React.FC = () => {
  const { openQuickView } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Pointer Events: Handles mouse click-and-drag across all browsers with pointer capture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
    setIsGrabbing(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const container = scrollRef.current;
    if (!container) return;

    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }

    container.scrollLeft = startScrollLeftRef.current - deltaX;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  return (
    <section className="py-8 bg-white border-t border-gray-100 overflow-hidden select-none">
      <div
        data-aos="fade-up"
        data-aos-duration="600"
        className="text-center mb-6"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#093624] block mb-1 font-satoshi-bold">
          Follow Along
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-[#141414] font-satoshi-bold">
          @Reshans_Fashion on Instagram
        </h3>
        <p className="text-xs text-[#7A7A7A] mt-1 font-satoshi">
          Click & drag left or right to explore customer styling across Bangladesh
        </p>
      </div>

      {/* Full-width continuous image gallery: Natural top-bottom scroll maintained, horizontal scroll via mouse drag */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        className={`w-full overflow-x-auto no-scrollbar pb-2 select-none touch-pan-y ${
          isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex w-max min-w-full">
          {SHOPGRAM_IMAGES.map((img, idx) => {
            const associatedProduct = PRODUCTS[idx % PRODUCTS.length];
            return (
              <div
                key={idx}
                onClick={() => {
                  if (!hasDraggedRef.current) {
                    openQuickView(associatedProduct);
                  }
                }}
                className="group relative w-48 sm:w-60 md:w-72 aspect-square shrink-0 overflow-hidden bg-gray-100 cursor-pointer pointer-events-auto"
              >
                <img
                  src={img}
                  alt={`Reshans Shopgram feed ${idx + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 pointer-events-none select-none"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-[#093624]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Instagram size={22} className="text-[#F9F295]" />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#F9F295] font-satoshi-bold">
                    Shop This Look
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
