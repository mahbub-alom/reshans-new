'use client';

import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { ProductSkeleton } from '../common/ProductSkeleton';
import { useShop } from '../../context/ShopContext';

type TabKey = 'new' | 'featured' | 'top_sellers';

export const PopularProductsSection: React.FC = () => {
  const { products } = useShop();
  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show smooth skeleton placeholder on initial load / reload
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'featured', label: 'Featured' },
    { key: 'top_sellers', label: 'Top Sellers' },
  ];

  const sourceProducts = products && products.length ? products : PRODUCTS;

  const displayedProducts = sourceProducts.filter((p) => {
    if (activeTab === 'new') return p.tabCategory === 'new' || p.isNewArrival;
    if (activeTab === 'featured') return p.tabCategory === 'featured' || p.isTrending;
    if (activeTab === 'top_sellers') return p.tabCategory === 'top_sellers' || p.isBestSeller;
    return true;
  }).slice(0, 8);

  return (
    <section id="popular" className="pt-16 pb-20 bg-white overflow-hidden">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title on Left, Line in Center, Tabs on Right */}
        <div
          data-aos="fade-up"
          data-aos-duration="700"
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9 pb-4 border-b border-gray-100"
        >
          <div className="shrink-0 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141414] font-satoshi-bold">
              Trending Products
            </h2>
          </div>

          {/* Decorative Divider in Desktop */}
          <div className="hidden xl:block flex-1 mx-8 h-[1px] bg-gray-200" />

          {/* Tab buttons */}
          <div className="flex items-center justify-center md:justify-end gap-6 sm:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-2 text-sm sm:text-base font-bold transition-colors cursor-pointer font-satoshi-bold ${
                  activeTab === tab.key
                    ? 'text-[#093624]'
                    : 'text-[#888888] hover:text-[#141414]'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#093624]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid with Skeleton Loader on Reload */}
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={(index % 4) * 80}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
