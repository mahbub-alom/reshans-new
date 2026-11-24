'use client';

import React from 'react';
import { DedicatedProductCatalog, CategoryCircleItem } from '../components/product/DedicatedProductCatalog';

const MEN_CATEGORY_CIRCLES: CategoryCircleItem[] = [
  { id: 'men-all', label: 'All Men', image: '/assets/img/fashion-1/categories/category-16.jpg', filterKey: 'all' },
  { id: 'men-shirts', label: 'Shirts & Polos', image: '/assets/img/fashion-1/categories/category-13.jpg', filterKey: 'Shirt' },
  { id: 'men-trousers', label: 'Trousers & Pants', image: '/assets/img/fashion-1/categories/category-12.jpg', filterKey: 'Trouser' },
  { id: 'men-outerwear', label: 'Overshirts & Coats', image: '/assets/img/fashion-1/categories/category-11.jpg', filterKey: 'Outerwear' },
  { id: 'men-knitwear', label: 'Knitwear & Crews', image: '/assets/img/fashion-1/categories/category-15.jpg', filterKey: 'Knitwear' },
  { id: 'men-caps', label: 'Caps & Accessories', image: '/assets/img/fashion-1/categories/category-7.jpg', filterKey: 'Caps' },
];

const MEN_SUBCATEGORIES = [
  { key: 'all', label: 'All Men Collections' },
  { key: 'Men Collection', label: 'Men Atelier' },
  { key: 'Shirt', label: 'Tailored Shirts & Polos' },
  { key: 'Trouser', label: 'Trousers & Bottoms' },
  { key: 'Outerwear', label: 'Jackets & Overshirts' },
  { key: 'Knitwear', label: 'Sweaters & Knitwear' },
  { key: 'Streetwear', label: 'Urban Streetwear' },
  { key: 'Caps', label: 'Hats & Accessories' },
];

export const MenPage: React.FC = () => {
  return (
    <DedicatedProductCatalog
      pageTitle="Men's Collection"
      pageSubtitle="Refined silhouettes, structured overshirts, tailored trousers, and everyday organic cotton crews engineered for discerning gentlemen."
      breadcrumbLabel="Men"
      pageType="Men"
      departmentFilter="men"
      categoryCircles={MEN_CATEGORY_CIRCLES}
      categoryOptions={MEN_SUBCATEGORIES}
    />
  );
};
