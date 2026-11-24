"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Customer,
  CategoryDetail,
  BrandItem,
  Coupon,
  ReviewItem,
  ReturnRequestItem,
  WebsiteBanner,
  WebsiteSettings,
  AdminProfile,
  AuthUser,
} from '../types';
import { PRODUCTS } from '../data/products';
import {
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_ADMIN_PROFILE,
} from '../data/adminInitialData';

interface ShopContextType {
  // Store products (dynamic state that can be added, updated, deleted by admin)
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, inStock: boolean, stockCount?: number) => void;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedSize?: string,
    options?: { openDrawer?: boolean }
  ) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  moveToCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  clearWishlist: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isOffcanvasOpen: boolean;
  openOffcanvas: () => void;
  closeOffcanvas: () => void;
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  cartTotal: number;
  cartCount: number;
  wishlistCount: number;
  toastMessage: string | null;
  toastType: 'success' | 'error';
  clearToast: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  formatPrice: (amount: number) => string;
  currentPath: string;
  navigate: (path: string) => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;
  navigateToCategory: (category: string) => void;

  // Checkout, Coupons & Order Tracking
  checkoutMode: 'cart' | 'buy-now';
  buyNowItem: CartItem | null;
  startBuyNow: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearBuyNow: () => void;
  proceedToCartCheckout: () => void;
  appliedCouponCode: string | null;
  applyCouponCode: (code: string, subtotal: number) => { success: boolean; message: string; discountAmount: number };
  removeCouponCode: () => void;
  calculateDiscount: (subtotal: number, code?: string | null) => number;
  orderNote: string;
  setOrderNote: (note: string) => void;
  lastConfirmedOrder: Order | null;
  trackedCodeQuery: string;
  setTrackedCodeQuery: (code: string) => void;
  placeOrder: (payload: {
    mode: 'cart' | 'buy-now';
    items: CartItem[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    city: string;
    area: string;
    postalCode?: string;
    shippingZone: 'inside_dhaka' | 'outside_dhaka';
    paymentMethod: 'bKash' | 'Cash on Delivery';
    bkashNumber?: string;
    bkashTransactionId?: string;
    subtotal: number;
    shippingCost: number;
    discount: number;
    couponCode?: string;
    total: number;
    note?: string;
  }) => Order;
  findOrderByTrackingCode: (query: string) => Order | undefined;

  // Selected Order for Dashboard Order Details & Invoice Details
  selectedOrderId: string | null;
  setSelectedOrderId: (orderId: string | null) => void;
  selectedOrder: Order | null;

  // Admin Management State & Handlers
  orders: Order[];
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  refundOrder: (orderId: string) => void;

  customers: Customer[];
  updateCustomerStatus: (id: string, status: 'Active' | 'Blocked') => void;

  categories: CategoryDetail[];
  addCategory: (cat: Omit<CategoryDetail, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, cat: Partial<CategoryDetail>) => void;
  deleteCategory: (id: string) => void;

  brands: BrandItem[];
  addBrand: (brand: Omit<BrandItem, 'id' | 'itemCount'>) => void;
  deleteBrand: (id: string) => void;

  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;

  reviews: ReviewItem[];
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  deleteReview: (id: string) => void;

  // Return Requests Management
  returnRequests: ReturnRequestItem[];
  refreshReturnRequests: () => Promise<void>;
  submitReturnRequest: (payload: {
    orderId: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    pickupAddress?: string;
    items: Array<{
      productId?: string;
      productName: string;
      productImage?: string;
      quantity: number;
      price: number;
      selectedColor?: string;
      selectedSize?: string;
    }>;
    refundAmount: number;
    reason: string;
    notes?: string;
    details?: string;
  }) => Promise<{ success: boolean; returnRequest?: ReturnRequestItem; error?: string }>;
  updateReturnRequestStatus: (
    id: string,
    status: 'Pending' | 'Approved' | 'Processing' | 'Picked Up' | 'Completed' | 'Rejected',
    adminNotes?: string
  ) => Promise<{ success: boolean; error?: string }>;

  banners: WebsiteBanner[];
  updateBanner: (id: string, updated: Partial<WebsiteBanner>) => void;
  toggleBanner: (id: string) => void;

  settings: WebsiteSettings;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;

  // Authentication & Session
  currentUser: AuthUser | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithSocial: (provider: string, email: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;

  adminProfile: AdminProfile;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live Products State (initialized with cached state or default products catalog)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('reshans_products_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return PRODUCTS.map((p, idx) => ({
      ...p,
      stockCount: p.inStock ? 25 + idx * 5 : 0,
      sku: `RSH-FSH-${1000 + idx}`,
      brand: p.category.includes('Casual')
        ? 'Reshans Casuals'
        : p.category.includes('Men')
        ? 'Reshans Atelier'
        : 'Reshans Studio',
    }));
  });

  // Admin orders, customers, categories, brands, coupons, reviews, banners, settings, admin profile
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('reshans_orders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback to initial orders
    }
    return INITIAL_ORDERS;
  });
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [categories, setCategories] = useState<CategoryDetail[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [returnRequests, setReturnRequests] = useState<ReturnRequestItem[]>([]);
  const [banners, setBanners] = useState<WebsiteBanner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(INITIAL_ADMIN_PROFILE);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Fetch global store settings, coupons, banners, and products dynamically from database on load
  useEffect(() => {
    const fetchStoreSettingsCouponsAndBanners = async () => {
      try {
        const [settingsRes, couponsRes, bannersRes, productsRes, categoriesRes, brandsRes, reviewsRes, ordersRes, returnsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/coupons'),
          fetch('/api/banners'),
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/brands'),
          fetch('/api/reviews'),
          fetch('/api/orders'),
          fetch('/api/returns'),
        ]);

        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setSettings((prev) => ({ ...prev, ...settingsData.settings }));
        }

        const couponsData = await couponsRes.json();
        if (couponsData.success && couponsData.coupons) {
          setCoupons(couponsData.coupons);
        }

        const bannersData = await bannersRes.json();
        if (bannersData.success && bannersData.banners) {
          setBanners(bannersData.banners);
        }

        const categoriesData = await categoriesRes.json();
        if (categoriesData.success && Array.isArray(categoriesData.categories) && categoriesData.categories.length > 0) {
          setCategories(categoriesData.categories);
        }

        const brandsData = await brandsRes.json();
        if (brandsData.success && Array.isArray(brandsData.brands) && brandsData.brands.length > 0) {
          setBrands(brandsData.brands);
        }

        const reviewsData = await reviewsRes.json();
        if (reviewsData.success && Array.isArray(reviewsData.reviews) && reviewsData.reviews.length > 0) {
          setReviews(reviewsData.reviews);
        }

        const ordersData = await ordersRes.json();
        if (ordersData.success && Array.isArray(ordersData.orders) && ordersData.orders.length > 0) {
          setOrders(ordersData.orders);
          try {
            localStorage.setItem('reshans_orders_v1', JSON.stringify(ordersData.orders));
          } catch {}
        }

        const returnsData = await returnsRes.json();
        if (returnsData.success && Array.isArray(returnsData.returnRequests)) {
          setReturnRequests(returnsData.returnRequests);
        }

        const productsData = await productsRes.json();
        if (productsData.success && Array.isArray(productsData.products) && productsData.products.length > 0) {
          setProducts((prev) => {
            const dbMap = new Map(productsData.products.map((p: Product) => [p.id, p]));
            // Merge existing and new
            const merged = productsData.products.map((p: Product) => {
              const local = prev.find((item) => item.id === p.id);
              return {
                ...local,
                ...p,
              };
            });
            // Also append any strictly local ones if any
            for (const p of prev) {
              if (!dbMap.has(p.id)) {
                merged.push(p);
              }
            }
            try {
              localStorage.setItem('reshans_products_v1', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not fetch settings/coupons/banners/products from API, using defaults:', err);
      }
    };
    fetchStoreSettingsCouponsAndBanners();
  }, []);

  // Validate session on mount
  useEffect(() => {
    const checkCurrentSession = async () => {
      try {
        const storedToken = localStorage.getItem('reshans_auth_token');
        const res = await fetch('/api/auth/me', {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
          credentials: 'include',
        });
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          if (storedToken) setAuthToken(storedToken);
        } else {
          setCurrentUser(null);
          setAuthToken(null);
          localStorage.removeItem('reshans_auth_token');
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    checkCurrentSession();
  }, []);

  // Real-time synchronization interval for return requests and orders (no manual page reload needed)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      // Sync return requests
      fetch('/api/returns')
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.returnRequests)) {
            setReturnRequests(data.returnRequests);
          }
        })
        .catch(() => {});

      // Sync orders
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        })
        .catch(() => {});
    }, 4000);

    return () => clearInterval(syncInterval);
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem('reshans_auth_token', data.token);
      showToast(data.message || 'Logged in successfully!');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const loginWithSocial = async (provider: string, email: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email, name }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Social login failed' };
      }
      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem('reshans_auth_token', data.token);
      showToast(data.message || 'Signed in via social account!');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const registerUser = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem('reshans_auth_token', data.token);
      showToast(data.message || 'Registration successful!');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setCurrentUser(null);
      setAuthToken(null);
      localStorage.removeItem('reshans_auth_token');
      showToast('You have been logged out.');
      navigate('/login');
    }
  };

  // Pre-seed cart with 2 default items in BDT (or restore from localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('reshans_cart_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback to seeded items
    }
    return [
      {
        product: PRODUCTS[0], // Slim-fit crew ৳ 3,850
        quantity: 1,
        selectedColor: PRODUCTS[0].colors[0]?.name || 'Forest Green',
        selectedSize: 'M',
      },
      {
        product: PRODUCTS[8], // Ribbed Tank Top ৳ 950
        quantity: 1,
        selectedColor: 'Tangerine',
        selectedSize: 'M',
      },
    ];
  });

  // Checkout, Buy Now, Coupon & Order Confirmation state
  const [checkoutMode, setCheckoutMode] = useState<'cart' | 'buy-now'>('cart');
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState<string>('');
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [trackedCodeQuery, setTrackedCodeQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('reshans_selected_order_id') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleSetSelectedOrderId = (orderId: string | null) => {
    setSelectedOrderId(orderId);
    if (typeof window !== 'undefined') {
      try {
        if (orderId) {
          localStorage.setItem('reshans_selected_order_id', orderId);
        } else {
          localStorage.removeItem('reshans_selected_order_id');
        }
      } catch {}
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('reshans_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('reshans_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore storage quota errors
    }
  }, [orders]);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('reshans_wishlist_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('reshans_wishlist_v1', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Routing state based on real browser pathname (HTML5 History API)
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/') return pathname;
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const navigate = (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    setCurrentPath(normalized);
    if (typeof window !== 'undefined') {
      // Use standard pushState so URL bar shows real pathname without '#'
      if (window.location.pathname !== normalized) {
        window.history.pushState({}, '', normalized);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToCategory = (category: string) => {
    setActiveCategoryFilter(category);
    navigate('/shop');
  };

  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname;
      const target = pathname && pathname !== '/' ? pathname : '/';
      setCurrentPath(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const clearToast = () => setToastMessage(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    // If msg indicates error/failed/cannot/restriction/warning, automatically treat as error
    const isError =
      type === 'error' ||
      /cannot|can't|error|fail|invalid|restricted|violation|blocked|wrong|not allowed|warning|required/i.test(msg);

    setToastType(isError ? 'error' : 'success');
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // 1/ Prevent background scrolling whenever ANY modal/drawer is open
  useEffect(() => {
    const isAnyModalOpen = isAuthOpen || isCartOpen || isWishlistOpen || isSearchOpen || isOffcanvasOpen || !!quickViewProduct;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isAuthOpen, isCartOpen, isWishlistOpen, isSearchOpen, isOffcanvasOpen, quickViewProduct]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string,
    options?: { openDrawer?: boolean }
  ) => {
    const resolvedColor = selectedColor || product.colors[0]?.name || 'Default';
    const resolvedSize = selectedSize || product.sizes[0] || 'M';
    const shouldOpenDrawer = options?.openDrawer !== undefined ? options.openDrawer : true;

    setCart((prev) => {
      // Find item with same product ID regardless of minor case differences
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        // Same product is already in cart -> only increment quantity
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          // Update selected color/size if provided
          selectedColor: selectedColor || next[existingIndex].selectedColor || resolvedColor,
          selectedSize: selectedSize || next[existingIndex].selectedSize || resolvedSize,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor: resolvedColor,
            selectedSize: resolvedSize,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to shopping bag!`);
    if (shouldOpenDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true;
        if (selectedColor !== undefined && item.selectedColor !== selectedColor) return true;
        if (selectedSize !== undefined && item.selectedSize !== selectedSize) return true;
        return false;
      })
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const matchesId = item.product.id === productId;
        const matchesColor = selectedColor === undefined || item.selectedColor === selectedColor;
        const matchesSize = selectedSize === undefined || item.selectedSize === selectedSize;
        return matchesId && matchesColor && matchesSize ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCouponCode(null);
  };

  const startBuyNow = (
    product: Product,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const resolvedColor = selectedColor || product.colors[0]?.name || 'Default';
    const resolvedSize = selectedSize || product.sizes[0] || 'M';
    setBuyNowItem({
      product,
      quantity: Math.max(1, quantity),
      selectedColor: resolvedColor,
      selectedSize: resolvedSize,
    });
    setCheckoutMode('buy-now');
    closeCart();
    closeQuickView();
    navigate('/checkout');
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
    setCheckoutMode('cart');
  };

  const proceedToCartCheckout = () => {
    setBuyNowItem(null);
    setCheckoutMode('cart');
    closeCart();
    navigate('/checkout');
  };

  const calculateDiscount = (subtotal: number, code: string | null = appliedCouponCode): number => {
    if (!code || subtotal <= 0) return 0;
    const normalized = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === normalized && c.isActive);
    if (!found || subtotal < found.minSpend) return 0;
    // Check if usage limit is reached
    if (found.usageLimit && found.usageCount >= found.usageLimit) return 0;
    if (found.discountType === 'percentage') {
      return Math.round((subtotal * found.discountValue) / 100);
    }
    return Math.min(subtotal, found.discountValue);
  };

  const applyCouponCode = (
    rawCode: string,
    subtotal: number
  ): { success: boolean; message: string; discountAmount: number } => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'Please enter a promo code.', discountAmount: 0 };
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      return { success: false, message: `Promo code "${code}" is invalid or expired.`, discountAmount: 0 };
    }
    // Check if usage limit is reached / expired
    if ((found.usageLimit && found.usageCount >= found.usageLimit) || !found.isActive) {
      return { success: false, message: 'coupon use limit over', discountAmount: 0 };
    }
    if (subtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum spend of ৳ ${found.minSpend.toLocaleString('en-US')} required for ${found.code}.`,
        discountAmount: 0,
      };
    }
    const discountAmount =
      found.discountType === 'percentage'
        ? Math.round((subtotal * found.discountValue) / 100)
        : Math.min(subtotal, found.discountValue);
    setAppliedCouponCode(found.code);
    showToast(`Promo code ${found.code} applied!`);
    return {
      success: true,
      message: `${found.code} applied (${
        found.discountType === 'percentage' ? `${found.discountValue}% off` : `৳ ${found.discountValue} off`
      })`,
      discountAmount,
    };
  };

  const removeCouponCode = () => {
    setAppliedCouponCode(null);
  };

  const placeOrder: ShopContextType['placeOrder'] = (payload) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;
    const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
    const randomTrackSuffix = `${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ORD-${randomOrderNum}`;
    const trackingCode = `RSH-${now.getFullYear()}-${randomTrackSuffix}`;

    const fullAddress = [payload.customerAddress, payload.area, payload.city, payload.postalCode]
      .filter(Boolean)
      .join(', ');

    const newOrder: Order = {
      id: orderId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      customerAddress: payload.customerAddress,
      city: payload.city,
      area: payload.area,
      postalCode: payload.postalCode,
      shippingZone: payload.shippingZone,
      date: dateStr,
      items: payload.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })),
      subtotal: payload.subtotal,
      shippingCost: payload.shippingCost,
      discount: payload.discount,
      couponCode: payload.couponCode,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'bKash' ? 'Paid' : 'Pending',
      orderStatus: payload.paymentMethod === 'bKash' ? 'Processing' : 'Pending',
      trackingNumber: trackingCode,
      bkashNumber: payload.bkashNumber,
      bkashTransactionId: payload.bkashTransactionId,
      note: payload.note,
    };

    const isCurrentUserAdmin = currentUser?.role === 'ADMIN' || adminProfile?.role === 'ADMIN';
    if (isCurrentUserAdmin) {
      showToast("Admin can't make Order", 'error');
      return null as any;
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);
    setTrackedCodeQuery(trackingCode);

    // Save order in backend API with identical orderId & trackingNumber
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        ...payload,
        customerAddress: payload.customerAddress,
        city: payload.city,
        area: payload.area,
        postalCode: payload.postalCode,
        shippingZone: payload.shippingZone,
        orderId: newOrder.id,
        trackingNumber: trackingCode,
        userId: currentUser?.id,
        role: currentUser?.role,
        isAdmin: isCurrentUserAdmin,
      }),
    }).catch((err) => console.warn('Could not post order to backend:', err));

    // If a coupon was applied, increment its usage count and deactivate if usage limit reached
    if (payload.couponCode) {
      const cpnCode = payload.couponCode;
      setCoupons((prev) =>
        prev.map((c) => {
          if (c.code.toUpperCase() === cpnCode.toUpperCase()) {
            const nextUsage = c.usageCount + 1;
            const isNowActive = nextUsage < c.usageLimit ? c.isActive : false;
            return { ...c, usageCount: nextUsage, isActive: isNowActive };
          }
          return c;
        })
      );
      // Also update in backend DB
      fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cpnCode, incrementUsage: true }),
      }).catch((err) => console.warn('Could not increment coupon usage in DB:', err));
    }

    if (payload.mode === 'buy-now') {
      setBuyNowItem(null);
      setCheckoutMode('cart');
    } else {
      setCart([]);
      setAppliedCouponCode(null);
      setOrderNote('');
    }

    showToast(`Order ${orderId} confirmed! Tracking Code: ${trackingCode}`);
    navigate('/order-confirmation');
    return newOrder;
  };

  const findOrderByTrackingCode = (query: string): Order | undefined => {
    const clean = query.trim().replace(/^#/, '').toLowerCase();
    if (!clean) return undefined;
    return orders.find(
      (ord) =>
        (ord.trackingNumber && ord.trackingNumber.toLowerCase() === clean) ||
        ord.id.replace(/^#/, '').toLowerCase() === clean
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);
      const name = product ? product.name : 'Item';
      if (exists) {
        showToast(`Removed "${name}" from wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${name}" to wishlist ❤️`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openOffcanvas = () => setIsOffcanvasOpen(true);
  const closeOffcanvas = () => setIsOffcanvasOpen(false);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  const moveToCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    const product = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1, selectedColor, selectedSize);
      // Remove from wishlist once added to cart
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast(`Moved "${product.name}" from wishlist to your shopping bag!`);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared');
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // BDT price formatter with ৳ symbol and comma separation
  const formatPrice = (amount: number) => {
    return `৳ ${amount.toLocaleString('en-US')}`;
  };

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
        closeWishlist();
        closeSearch();
        closeOffcanvas();
        closeQuickView();
        closeAuth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Admin Product Actions
  const addProduct = async (newProdData: Omit<Product, 'id'> & { id?: string }) => {
    const tempId = newProdData.id || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: tempId,
      page: newProdData.page || 'Shop',
      inStock: newProdData.inStock !== undefined ? newProdData.inStock : true,
      stockCount: newProdData.stockCount !== undefined ? newProdData.stockCount : 20,
      rating: newProdData.rating || 5,
      reviewsCount: newProdData.reviewsCount || 0,
      sizes: newProdData.sizes && newProdData.sizes.length ? newProdData.sizes : ['S', 'M', 'L', 'XL'],
      colors: newProdData.colors && newProdData.colors.length ? newProdData.colors : [{ name: 'Deep Forest', hex: '#093624' }],
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" created successfully!`);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, ...data.product } : p))
        );
      }
    } catch (err) {
      console.warn('Could not post product to API:', err);
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast(`Product updated successfully!`);

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ id, ...updated }),
      });
    } catch (err) {
      console.warn('Could not update product in DB:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast(`Product removed from catalog.`);

    try {
      await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
    } catch (err) {
      console.warn('Could not delete product from DB:', err);
    }
  };

  const updateStock = async (id: string, inStock: boolean, stockCount?: number) => {
    const resolvedStockCount = stockCount !== undefined ? stockCount : inStock ? 15 : 0;
    
    // Optimistically update React state and localStorage
    setProducts((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              inStock,
              stockCount: resolvedStockCount,
            }
          : item
      );
      try {
        localStorage.setItem('reshans_products_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast(`Stock updated: ${resolvedStockCount} units (${inStock ? 'In Stock' : 'Out of Stock'})`);

    // Sync with backend API & Database
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          id,
          inStock,
          stockCount: resolvedStockCount,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('Failed to update stock in DB:', data.error);
      }
    } catch (err) {
      console.warn('Network error updating product stock:', err);
    }
  };

  // Real-time Orders Synchronization via SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/orders/stream');

        eventSource.addEventListener('new_order', (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data && (data.orderId || data.orderNumber)) {
              // Refresh orders from API or update status locally
              refreshOrders();
            }
          } catch (err) {
            console.warn('SSE message parse error:', err);
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect with backoff
          retryTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.warn('SSE connection error:', err);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        try {
          localStorage.setItem('reshans_orders_v1', JSON.stringify(data.orders));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not refresh orders from API:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // 1. Optimistic React & LocalStorage update
    setOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status } : ord));
      try {
        localStorage.setItem('reshans_orders_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Order ${orderId} status changed to ${status}.`);

    // 2. Persist in MySQL Database via API
    try {
      await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ orderStatus: status }),
      });
    } catch (err) {
      console.warn('Failed to update order status in DB:', err);
    }
  };

  const cancelOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: 'Cancelled' } : ord))
    );
    showToast(`Order ${orderId} has been cancelled.`);

    try {
      await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ orderStatus: 'Cancelled' }),
      });
    } catch (err) {
      console.warn('Failed to cancel order in DB:', err);
    }
  };

  const refundOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: 'Refunded' } : ord))
    );
    showToast(`Refund recorded for order ${orderId}.`);

    try {
      await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ paymentStatus: 'Refunded' }),
      });
    } catch (err) {
      console.warn('Failed to refund order in DB:', err);
    }
  };

  // Admin Customer Actions
  const updateCustomerStatus = (id: string, status: 'Active' | 'Blocked') => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    showToast(`Customer status changed to ${status}.`);
  };

  // Admin Category & Brand Actions
  const addCategory = async (cat: Omit<CategoryDetail, 'id' | 'itemCount'>) => {
    const tempId = `CAT-${Date.now().toString().slice(-4)}`;
    const newCat: CategoryDetail = {
      ...cat,
      id: tempId,
      itemCount: 0,
    };
    setCategories((prev) => [newCat, ...prev]);
    showToast(`Category "${cat.name}" added successfully!`);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, ...data.category } : c))
        );
      }
    } catch (err) {
      console.warn('Could not post category to API:', err);
    }
  };

  const updateCategory = async (id: string, cat: Partial<CategoryDetail>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cat } : c))
    );
    showToast(`Category updated.`);

    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...cat }),
      });
    } catch (err) {
      console.warn('Could not update category in DB:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast(`Category deleted.`);

    try {
      await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete category from DB:', err);
    }
  };

  const addBrand = async (brand: Omit<BrandItem, 'id' | 'itemCount'>) => {
    const tempId = `BR-${Date.now().toString().slice(-4)}`;
    const newBrand: BrandItem = {
      ...brand,
      id: tempId,
      itemCount: 0,
    };
    setBrands((prev) => [newBrand, ...prev]);
    showToast(`Brand "${brand.name}" added.`);

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });
      const data = await res.json();
      if (data.success && data.brand) {
        setBrands((prev) =>
          prev.map((b) => (b.id === tempId ? { ...b, ...data.brand } : b))
        );
      }
    } catch (err) {
      console.warn('Could not post brand to API:', err);
    }
  };

  const deleteBrand = async (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    showToast(`Brand deleted.`);

    try {
      await fetch(`/api/brands?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete brand from DB:', err);
    }
  };

  // Admin Coupons
  const addCoupon = async (cpn: Omit<Coupon, 'id' | 'usageCount'>) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cpn),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setCoupons((prev) => [data.coupon, ...prev]);
        showToast(`Coupon "${cpn.code}" activated!`);
        return;
      }
    } catch (err) {
      console.warn('Could not post coupon to API, storing locally:', err);
    }
    const newCoupon: Coupon = {
      ...cpn,
      id: `CPN-${Date.now().toString().slice(-4)}`,
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon "${cpn.code}" activated!`);
  };

  const toggleCouponStatus = async (id: string) => {
    const target = coupons.find((c) => c.id === id);
    const newStatus = target ? !target.isActive : false;

    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newStatus } : c))
    );
    showToast(newStatus ? 'Coupon activated!' : 'Coupon deactivated!');

    try {
      await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: newStatus }),
      });
    } catch (err) {
      console.warn('Could not update coupon status in DB:', err);
    }
  };

  const deleteCoupon = async (id: string) => {
    const target = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast(`Coupon deleted.`);

    try {
      const url = target?.id
        ? `/api/coupons?id=${encodeURIComponent(target.id)}`
        : `/api/coupons?code=${encodeURIComponent(target?.code || id)}`;
      await fetch(url, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete coupon from DB:', err);
    }
  };

  // Admin Reviews with DB sync
  const approveReview = async (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
    showToast(`Review approved and published!`);

    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' }),
      });
    } catch (err) {
      console.warn('Could not approve review in DB:', err);
    }
  };

  const rejectReview = async (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
    showToast(`Review rejected.`);

    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' }),
      });
    } catch (err) {
      console.warn('Could not reject review in DB:', err);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast(`Review removed.`);

    try {
      await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete review from DB:', err);
    }
  };

  // Return Requests Management Handlers
  const refreshReturnRequests = async () => {
    try {
      const res = await fetch('/api/returns');
      const data = await res.json();
      if (data.success && Array.isArray(data.returnRequests)) {
        setReturnRequests(data.returnRequests);
      }
    } catch (err) {
      console.warn('Could not refresh return requests:', err);
    }
  };

  const submitReturnRequest = async (payload: {
    orderId: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    pickupAddress?: string;
    items: Array<{
      productId?: string;
      productName: string;
      productImage?: string;
      quantity: number;
      price: number;
      selectedColor?: string;
      selectedSize?: string;
    }>;
    refundAmount: number;
    reason: string;
    notes?: string;
    details?: string;
  }) => {
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          customerName: payload.customerName || currentUser?.name || 'Customer',
          customerEmail: payload.customerEmail || currentUser?.email || '',
          customerPhone: payload.customerPhone || currentUser?.phone || '',
          customerAddress: payload.pickupAddress || '',
          userId: currentUser?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to submit return request', 'error');
        return { success: false, error: data.error };
      }

      setReturnRequests((prev) => [data.returnRequest, ...prev]);
      showToast(`Return request #${data.returnRequest.returnNumber} submitted successfully!`);
      return { success: true, returnRequest: data.returnRequest };
    } catch (err: any) {
      showToast('Network error submitting return request', 'error');
      return { success: false, error: err.message };
    }
  };

  const updateReturnRequestStatus = async (
    id: string,
    status: 'Pending' | 'Approved' | 'Processing' | 'Picked Up' | 'Completed' | 'Rejected',
    adminNotes?: string
  ) => {
    setReturnRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, ...(adminNotes ? { adminNotes } : {}) } : r))
    );
    showToast(`Return request status updated to ${status}.`);

    try {
      await fetch('/api/returns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes }),
      });
      return { success: true };
    } catch (err: any) {
      console.warn('Could not update return request in DB:', err);
      return { success: false, error: err.message };
    }
  };

  // Admin Banners & Marquee
  const updateBanner = async (id: string, updated: Partial<WebsiteBanner>) => {
    let nextBanners: WebsiteBanner[] = [];
    setBanners((prev) => {
      nextBanners = prev.map((b) => (b.id === id ? { ...b, ...updated } : b));
      return nextBanners;
    });
    showToast(`Banner updated.`);

    try {
      await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: nextBanners }),
      });
    } catch (err) {
      console.warn('Could not sync banners to DB:', err);
    }
  };

  const toggleBanner = async (id: string) => {
    let nextBanners: WebsiteBanner[] = [];
    setBanners((prev) => {
      nextBanners = prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
      return nextBanners;
    });
    showToast(`Banner visibility toggled.`);

    try {
      await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: nextBanners }),
      });
    } catch (err) {
      console.warn('Could not sync banners to DB:', err);
    }
  };

  // Admin Settings & Profile
  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      const storedToken = authToken || (typeof window !== 'undefined' ? localStorage.getItem('reshans_auth_token') : null);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Store settings saved to database!');
      } else {
        showToast(data.error || 'Failed to save settings to database');
      }
    } catch (err: any) {
      console.error('Error saving settings to API:', err);
      showToast('Store settings saved locally!');
    }
  };

  const updateAdminProfile = (prof: Partial<AdminProfile>) => {
    setAdminProfile((prev) => ({ ...prev, ...prof }));
    showToast(`Admin profile updated.`);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isCartOpen,
        openCart,
        closeCart,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        moveToCart,
        clearWishlist,
        isSearchOpen,
        openSearch,
        closeSearch,
        isOffcanvasOpen,
        openOffcanvas,
        closeOffcanvas,
        isAuthOpen,
        openAuth,
        closeAuth,
        cartTotal,
        cartCount,
        wishlistCount,
        toastMessage,
        toastType,
        clearToast,
        showToast,
        formatPrice,
        currentPath,
        navigate,
        activeCategoryFilter,
        setActiveCategoryFilter,
        navigateToCategory,
        checkoutMode,
        buyNowItem,
        startBuyNow,
        clearBuyNow,
        proceedToCartCheckout,
        appliedCouponCode,
        applyCouponCode,
        removeCouponCode,
        calculateDiscount,
        orderNote,
        setOrderNote,
        lastConfirmedOrder,
        trackedCodeQuery,
        setTrackedCodeQuery,
        placeOrder,
        findOrderByTrackingCode,
        selectedOrderId,
        setSelectedOrderId: handleSetSelectedOrderId,
        selectedOrder: orders.find((o) => o.id === selectedOrderId || (o.trackingNumber && o.trackingNumber === selectedOrderId)) || (orders.length > 0 ? orders[0] : null),
        // Admin State & Handlers
        orders,
        refreshOrders,
        updateOrderStatus,
        cancelOrder,
        refundOrder,
        customers,
        updateCustomerStatus,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        brands,
        addBrand,
        deleteBrand,
        coupons,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        reviews,
        approveReview,
        rejectReview,
        deleteReview,
        returnRequests,
        refreshReturnRequests,
        submitReturnRequest,
        updateReturnRequestStatus,
        banners,
        updateBanner,
        toggleBanner,
        settings,
        updateSettings,
        currentUser,
        authToken,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'ADMIN',
        authLoading,
        loginUser,
        loginWithSocial,
        registerUser,
        logoutUser,
        adminProfile,
        updateAdminProfile,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
