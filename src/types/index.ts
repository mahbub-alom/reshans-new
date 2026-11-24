export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  badge?: 'new' | 'hot' | 'sale';
  rating: number;
  reviewsCount: number;
  frontImage: string;
  backImage: string;
  video?: string;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string; image?: string }[];
  fabric?: string;
  fit?: string;
  inStock: boolean;
  stockCount?: number;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tabCategory?: 'new' | 'featured' | 'top_sellers';
  department?: 'all' | 'men' | 'women' | 'kids';
  page?: 'Shop' | 'Men' | 'Women' | 'Collections' | string;
  categoryId?: string;
  brand?: string;
  brandId?: string;
  sku?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
}

export interface CategoryItem {
  id: string;
  title: string;
  itemCount?: string;
  image: string;
  link: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  city?: string;
  area?: string;
  postalCode?: string;
  shippingZone?: 'inside_dhaka' | 'outside_dhaka';
  date: string;
  items: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery' | 'Credit / Debit Card';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  bkashNumber?: string;
  bkashTransactionId?: string;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
  lastActive: string;
}

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  page?: 'Shop' | 'Men' | 'Women' | 'Collections' | string;
  itemCount: number;
  image?: string;
  description?: string;
  status: 'Active' | 'Inactive' | 'Hidden';
}

export interface BrandItem {
  id: string;
  name: string;
  itemCount: number;
  logo?: string;
  origin: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

export interface WebsiteBanner {
  id: string;
  type: 'hero' | 'dual' | 'marquee';
  title: string;
  subtitle?: string;
  buttonText?: string;
  link?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface WebsiteSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  shippingInsideDhaka: number;
  shippingOutsideDhaka: number;
  freeShippingThreshold: number;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok?: string;
  paymentCOD: boolean;
  paymentBkash: boolean;
  paymentNagad: boolean;
  paymentCards: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  avatar?: string;
  phone?: string;
  city?: string;
  authProvider?: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
  status?: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

