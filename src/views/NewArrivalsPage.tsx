'use client';

import React from 'react';
import { DedicatedProductCatalog, CategoryCircleItem } from '../components/product/DedicatedProductCatalog';

const NEW_ARRIVALS_CIRCLES: CategoryCircleItem[] = [
  { id: 'new-all', label: 'All New', image: '/assets/img/fashion-1/categories/category-5.jpg', filterKey: 'all' },
  { id: 'new-knitwear', label: 'Alpaca & Knits', image: '/assets/img/fashion-1/categories/category-15.jpg', filterKey: 'Knit' },
  { id: 'new-polo', label: 'Merino Polos', image: '/assets/img/fashion-1/categories/category-13.jpg', filterKey: 'Polo' },
  { id: 'new-organic', label: 'Organic Crews', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'Organic' },
  { id: 'new-leather', label: 'Leather Totes', image: '/assets/img/bag-collection/bag-1.jpg', filterKey: 'Leather' },
];

const NEW_ARRIVALS_SUBCATEGORIES = [
  { key: 'all', label: 'All Fresh Drops' },
  { key: 'Luxury Knitwear', label: 'Cocoon Alpaca Knits' },
  { key: 'Smart Casual', label: 'Merino Wool Polo Sweaters' },
  { key: 'T-Shirts', label: 'Organic Jersey Basics' },
  { key: 'Essentials', label: 'Micro Waffle Thermal Tops' },
  { key: 'Bags & Accessories', label: 'Classic Minimalist Leather Tote' },
];

export const NewArrivalsPage: React.FC = () => {
  return (
    <DedicatedProductCatalog
      pageTitle="New Arrivals"
      pageSubtitle="Explore our freshly dropped seasonal releases. Contemporary tailoring, premium fabrics, and limited production runs crafted for modern lifestyles."
      breadcrumbLabel="New Arrivals"
      isNewArrivalsOnly={true}
      categoryCircles={NEW_ARRIVALS_CIRCLES}
      categoryOptions={NEW_ARRIVALS_SUBCATEGORIES}
    />
  );
};
