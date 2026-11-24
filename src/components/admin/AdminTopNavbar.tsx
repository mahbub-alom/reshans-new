'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ChevronDown,
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
  LogOut,
  X,
  Volume2,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';
import { useShop } from '../../context/ShopContext';

interface AdminTopNavbarProps {
  activeTab: AdminTab;
  onOpenMobileSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface RealtimeOrderAlert {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentMethod: string;
  timestamp: number;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'Store performance, financial summaries, and real-time sales metrics',
  },
  products: {
    title: 'Product Management',
    subtitle: 'Manage catalog, variants, pricing in BDT (৳), and product availability',
  },
  orders: {
    title: 'Order Management',
    subtitle: 'Track order fulfillment, courier shipments, and payment statuses',
  },
  customers: {
    title: 'Customer Directory',
    subtitle: 'View customer accounts, lifetime expenditure, and order histories',
  },
  'all-users': {
    title: 'All Users & Role Management',
    subtitle: 'Manage all accounts, promote/demote administrators, and security privileges',
  },
  categories: {
    title: 'Categories & Brands',
    subtitle: 'Organize catalog collections, clothing departments, and fashion labels',
  },
  inventory: {
    title: 'Inventory & Stock Control',
    subtitle: 'Real-time stock quantities, low-stock warnings, and reorder levels',
  },
  banners: {
    title: 'Banners & Homepage Content',
    subtitle: 'Customize hero slides, promotional banners, and marquee notices',
  },
  coupons: {
    title: 'Coupons & Discount Codes',
    subtitle: 'Create promotional vouchers, percentage discounts, and campaigns',
  },
  reviews: {
    title: 'Customer Reviews & Feedback',
    subtitle: 'Moderate verified reviews, customer ratings, and testimonials',
  },
  returns: {
    title: 'Return Requests & Refunds',
    subtitle: 'Review customer return submissions, track courier pickups, and authorize refunds',
  },
  settings: {
    title: 'Website & Store Settings',
    subtitle: 'Store location, delivery rates for Dhaka vs outside, and payment gateways',
  },
  profile: {
    title: 'Admin Profile & Security',
    subtitle: 'Administrator account, credential management, 2FA, and audit logs',
  },
};

export const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  searchQuery,
  setSearchQuery,
}) => {
  const { navigate, orders, products, adminProfile, currentUser, logoutUser, formatPrice, showToast, refreshOrders } = useShop();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [liveOrderToast, setLiveOrderToast] = useState<RealtimeOrderAlert | null>(null);

  // Real-time 0-second Server-Sent Events (SSE) listener for instant new orders
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/orders/stream');

      eventSource.addEventListener('new_order', (e: MessageEvent) => {
        try {
          const newOrderData = JSON.parse(e.data);
          // Play audio notification chime
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
          } catch {}

          // Instantly refresh orders in React ShopContext and DB state!
          refreshOrders();

          // Show floating instant alert & toast
          setLiveOrderToast(newOrderData);
          showToast(`🔔 New Order Received: ${newOrderData.orderNumber} by ${newOrderData.customerName}!`);
        } catch (parseErr) {
          console.warn('Failed to parse SSE order event:', parseErr);
        }
      });

      eventSource.onerror = (err) => {
        console.warn('SSE order stream reconnecting...', err);
      };
    } catch (err) {
      console.warn('SSE connection failed:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const pendingOrders = orders.filter((o) => {
    const status = (o.orderStatus || '').toLowerCase();
    return status === 'pending' || status === 'processing';
  });
  const lowStockProducts = products.filter((p) => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 5));
  const totalNotifications = pendingOrders.length + lowStockProducts.length;

  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Admin Console',
    subtitle: 'Manage your eCommerce store',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#EBEBEB] px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-[#141414] hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-brand-body uppercase font-satoshi-bold tracking-wider">
              <span>Admin</span>
              <span>/</span>
              <span className="text-[#093624]">{activeTab}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-satoshi-bold text-[#141414] truncate">
              {currentTabInfo.title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, customers..."
              className="w-full pl-9 pr-4 py-2 bg-[#F9F9F9] border border-[#EBEBEB] text-xs font-satoshi rounded-xs text-[#141414] focus:outline-none focus:border-[#093624] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions, Currency, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      

       
          {/* Notification Center Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 text-gray-600 hover:text-[#093624] hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={18} />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#093624] text-[#F9F295] text-[9px] font-bold rounded-full flex items-center justify-center font-satoshi-bold">
                  {totalNotifications}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#EBEBEB] rounded-xs shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-satoshi-bold text-[#141414] uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] text-gray-400 font-satoshi">
                    {totalNotifications} new alerts
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {/* Real-time incoming unread order banner inside notification dropdown */}
                  {liveOrderToast && (
                    <div
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/admin/orders');
                      }}
                      className="p-3 bg-[#F9F295]/20 hover:bg-[#F9F295]/30 transition-colors flex items-start gap-2.5 text-left cursor-pointer border-b border-[#F9F295]/40"
                    >
                      <div className="w-7 h-7 bg-[#093624] text-[#F9F295] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <ShoppingBag size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase bg-[#093624] text-[#F9F295] px-1 py-0.2 rounded font-satoshi-bold">
                            Live 0s
                          </span>
                          <p className="text-xs font-satoshi-bold text-[#141414]">
                            New Order #{liveOrderToast.orderNumber}
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-700 font-satoshi truncate mt-0.5">
                          {liveOrderToast.customerName} • ৳ {liveOrderToast.total.toLocaleString()} ({liveOrderToast.paymentMethod})
                        </p>
                        <span className="text-[10px] text-emerald-700 font-satoshi-bold">
                          Just placed • Click to open
                        </span>
                      </div>
                    </div>
                  )}

                  {pendingOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/admin/orders');
                      }}
                      className="p-3 hover:bg-gray-50 transition-colors flex items-start gap-2.5 text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 bg-[#F9F295]/60 rounded-full flex items-center justify-center text-[#093624] shrink-0 mt-0.5">
                        <ShoppingBag size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-satoshi-bold text-[#141414]">
                          Order {ord.id}
                        </p>
                        <p className="text-[11px] text-gray-500 font-satoshi truncate">
                          {ord.customerName} • ৳ {ord.total.toLocaleString()} ({ord.paymentMethod})
                        </p>
                        <span className="text-[10px] text-[#093624] font-satoshi-bold">
                          Status: {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}

                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 hover:bg-gray-50 transition-colors flex items-start gap-2.5 text-left"
                    >
                      <div className="w-7 h-7 bg-[#F1EFEE] rounded-full flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
                        <AlertTriangle size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-satoshi-bold text-[#141414]">
                          Low Stock Alert
                        </p>
                        <p className="text-[11px] text-gray-500 font-satoshi truncate">
                          {p.name}
                        </p>
                        <span className="text-[10px] text-[#141414] font-satoshi-bold">
                          Remaining: {p.stockCount || 0} units
                        </span>
                      </div>
                    </div>
                  ))}

                  {totalNotifications === 0 && (
                    <div className="p-6 text-center text-xs text-gray-400 font-satoshi">
                      <CheckCircle size={20} className="mx-auto text-[#093624] mb-1" />
                      All clear! No pending notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#093624]/20 bg-gray-100">
                <img
                  src={adminProfile.avatar || '/assets/img/others/dashboard-avater.jpg'}
                  alt={adminProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:inline text-xs font-satoshi-bold text-[#141414]">
                {adminProfile.name}
              </span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EBEBEB] rounded-xs shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-satoshi-bold text-[#141414]">
                    {adminProfile.name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-satoshi truncate">
                    {adminProfile.email}
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#093624]/10 text-[#093624] text-[10px] font-bold rounded-xs font-satoshi-bold">
                    {adminProfile.role}
                  </span>
                </div>

              

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-satoshi text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100 flex items-center justify-between"
                >
                  <span>Sign Out</span>
                  <LogOut size={12} className="text-red-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating 0-second Real-time Order Popup Banner */}
      {liveOrderToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#093624] text-white p-4 rounded-xs shadow-2xl border-2 border-[#F9F295] animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F9F295] text-[#093624] flex items-center justify-center shrink-0 font-bold shadow-xs">
              <ShoppingBag size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-[#F9F295] text-[#093624] px-1.5 py-0.2 rounded font-satoshi-bold">
                  Just Now (0s)
                </span>
                <span className="text-xs font-bold text-white/90">New Order Placed!</span>
              </div>
              <div className="text-sm font-bold text-[#F9F295] mt-0.5 truncate">
                {liveOrderToast.orderNumber}
              </div>
              <div className="text-xs text-white/80 mt-0.5">
                {liveOrderToast.customerName} • ৳ {liveOrderToast.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/60">
                Payment: {liveOrderToast.paymentMethod}
              </div>
            </div>
            <button
              onClick={() => setLiveOrderToast(null)}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-xs cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
            <button
              onClick={() => {
                setLiveOrderToast(null);
                navigate('/admin/orders');
              }}
              className="text-xs font-bold text-[#F9F295] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View in Orders Tab</span>
              <ExternalLink size={12} />
            </button>
            <button
              onClick={() => setLiveOrderToast(null)}
              className="text-[11px] text-white/70 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
