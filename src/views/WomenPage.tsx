'use client';

import React from 'react';
import { DedicatedProductCatalog, CategoryCircleItem } from '../components/product/DedicatedProductCatalog';

const WOMEN_CATEGORY_CIRCLES: CategoryCircleItem[] = [
  { id: 'women-all', label: 'All Women', image: '/assets/img/fashion-1/categories/category-14.jpg', filterKey: 'all' },
  { id: 'women-dresses', label: 'Dresses & Gowns', image: '/assets/img/fashion-1/categories/category-14.jpg', filterKey: 'Dress' },
  { id: 'women-tops', label: 'Tops & Knits', image: '/assets/img/fashion-1/categories/category-13.jpg', filterKey: 'Top' },
  { id: 'women-casual', label: 'Casual Wear', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'Casual' },
  { id: 'women-sweaters', label: 'Alpaca & Sweaters', image: '/assets/img/fashion-1/categories/category-15.jpg', filterKey: 'Sweater' },
  { id: 'women-bags', label: 'Leather Bags & Totes', image: '/assets/img/bag-collection/bag-1.jpg', filterKey: 'Bag' },
];

const WOMEN_SUBCATEGORIES = [
  { key: 'all', label: 'All Women Collections' },
  { key: 'Women Collection', label: 'Women Atelier' },
  { key: 'Casual Wear', label: 'Everyday Casuals' },
  { key: 'Luxury Knitwear', label: 'Luxury Peruvian Alpaca' },
  { key: 'Essentials', label: 'Fitted Thermal Tops' },
  { key: 'Summer Tops', label: 'Ribbed Tanks & Sleeveless' },
  { key: 'Dress', label: 'Dresses & Outfits' },
  { key: 'Bags & Accessories', label: 'Italian Leather Bags' },
];

export const WomenPage: React.FC = () => {
  return (
    <DedicatedProductCatalog
      pageTitle="Women's Collection"
      pageSubtitle="Elevated everyday luxury, artisanal knitwear, flowing silhouettes, and handcrafted leather accessories tailored for effortless elegance."
      breadcrumbLabel="Women"
      departmentFilter="women"
      categoryCircles={WOMEN_CATEGORY_CIRCLES}
      categoryOptions={WOMEN_SUBCATEGORIES}
    />
  );
};
