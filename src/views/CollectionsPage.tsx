'use client';

import React from 'react';
import { DedicatedProductCatalog, CategoryCircleItem } from '../components/product/DedicatedProductCatalog';

const COLLECTIONS_CIRCLES: CategoryCircleItem[] = [
  { id: 'col-summer', label: 'Summer Series', image: '/assets/img/fashion-1/categories/category-15.jpg', filterKey: 'Summer' },
  { id: 'col-winter', label: 'Winter & Knits', image: '/assets/img/fashion-1/categories/category-11.jpg', filterKey: 'Knitwear' },
  { id: 'col-casual', label: 'Casual Essentials', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'Casual' },
  { id: 'col-office', label: 'Office & Workleisure', image: '/assets/img/fashion-1/categories/category-12.jpg', filterKey: 'Workleisure' },
  { id: 'col-premium', label: 'Premium Atelier', image: '/assets/img/fashion-1/categories/category-13.jpg', filterKey: 'Collection' },
];

const CURATED_PRESETS = [
  { id: 'p-summer', label: 'Summer 2026', filterKey: 'Summer' },
  { id: 'p-winter', label: 'Winter Knitwear', filterKey: 'Knitwear' },
  { id: 'p-casual', label: 'Casual Wear', filterKey: 'Casual' },
  { id: 'p-premium', label: 'Premium Atelier', filterKey: 'Collection' },
  { id: 'p-trending', label: 'Trending Drops', filterKey: 'Streetwear' },
  { id: 'p-office', label: 'Office & Workleisure', filterKey: 'Smart Casual' },
];

const COLLECTIONS_SUBCATEGORIES = [
  { key: 'all', label: 'All Curated Themes' },
  { key: 'Workleisure', label: 'Workleisure & Modern Office' },
  { key: 'Smart Casual', label: 'Smart Casual & Executive' },
  { key: 'Streetwear', label: 'Streetwear & Oversized' },
  { key: 'Luxury Knitwear', label: 'Artisanal Knits & Alpaca' },
  { key: 'Casual Wear', label: 'Weekend Relaxation Cotton' },
  { key: 'Outerwear', label: 'Heavyweight Overshirts & Jackets' },
];

export const CollectionsPage: React.FC = () => {
  return (
    <DedicatedProductCatalog
      pageTitle="Curated Collections"
      pageSubtitle="Distinct thematic capsule collections thoughtfully designed for Summer, Winter, Casual Weekends, Premium Occasions, and Modern Office Wear."
      breadcrumbLabel="Collections"
      pageType="Collections"
      isCollectionsOnly={true}
      collectionPresets={CURATED_PRESETS}
      categoryCircles={COLLECTIONS_CIRCLES}
      categoryOptions={COLLECTIONS_SUBCATEGORIES}
    />
  );
};
