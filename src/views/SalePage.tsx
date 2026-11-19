'use client';

import React from 'react';
import { DedicatedProductCatalog, CategoryCircleItem } from '../components/product/DedicatedProductCatalog';

const SALE_CIRCLES: CategoryCircleItem[] = [
  { id: 'sale-all', label: 'All Sale', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'all' },
  { id: 'sale-clearance', label: 'Clearance (30%+)', image: '/assets/img/fashion-1/categories/category-15.jpg', filterKey: '30%' },
  { id: 'sale-special', label: 'Special Offers', image: '/assets/img/fashion-1/categories/category-11.jpg', filterKey: 'Waffle' },
  { id: 'sale-tanks', label: 'Summer Deals', image: '/assets/img/fashion-1/categories/category-14.jpg', filterKey: 'Tank' },
  { id: 'sale-trousers', label: 'Pants on Sale', image: '/assets/img/fashion-1/categories/category-12.jpg', filterKey: 'Trouser' },
];

const SALE_PRESETS = [
  { id: 'sp-clearance', label: 'Clearance Sale', filterKey: '30%' },
  { id: 'sp-bestdeals', label: 'Best Deals', filterKey: 'Waffle' },
  { id: 'sp-special', label: 'Special Offers', filterKey: 'Crew' },
  { id: 'sp-summer', label: 'Summer Markdowns', filterKey: 'Tank' },
  { id: 'sp-tailored', label: 'Tailored Deals', filterKey: 'Trouser' },
];

const SALE_SUBCATEGORIES = [
  { key: 'all', label: 'All Promotional Deals' },
  { key: 'Waffle', label: 'Textured Waffle Crews (-20% to -28%)' },
  { key: 'Alpaca', label: 'Peruvian Alpaca Knits (-30% Off)' },
  { key: 'Tank', label: 'Ribbed Cotton Tanks (-32% Off)' },
  { key: 'Trouser', label: 'Tailored Pleated Trousers (-19% Off)' },
  { key: 'Outerwear', label: 'Limited Seasonal Markdowns' },
];

export const SalePage: React.FC = () => {
  return (
    <DedicatedProductCatalog
      pageTitle="Sale & Clearance"
      pageSubtitle="Shop our limited-time promotions, end-of-season clearance items, and exclusive discounts on premium apparel while stocks last."
      breadcrumbLabel="Sale"
      isOnSaleOnly={true}
      collectionPresets={SALE_PRESETS}
      categoryCircles={SALE_CIRCLES}
      categoryOptions={SALE_SUBCATEGORIES}
    />
  );
};
