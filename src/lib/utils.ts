import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `৳ ${amount.toLocaleString('en-US')}`;
}

export function generateProductSlug(product: { id: string; name: string; slug?: string }): string {
  if (product.slug && product.slug.trim()) return product.slug.trim();
  const nameSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${nameSlug}-${product.id}`;
}
