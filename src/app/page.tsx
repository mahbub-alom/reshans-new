'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { HeaderTop } from '@/components/layout/HeaderTop';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { MarqueeTicker } from '@/components/home/MarqueeTicker';
import { TrendingProductsSection } from '@/components/home/TrendingProductsSection';
import { DualBannerSection } from '@/components/home/DualBannerSection';
import { PopularProductsSection } from '@/components/home/PopularProductsSection';
import { CategorySlider } from '@/components/home/CategorySlider';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { ShopgramSection } from '@/components/home/ShopgramSection';
import { Footer } from '@/components/layout/Footer';
import { CartminiDrawer } from '@/components/modals/CartminiDrawer';
import { WishlistDrawer } from '@/components/modals/WishlistDrawer';
import { SearchModal } from '@/components/modals/SearchModal';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { OffcanvasMenu } from '@/components/modals/OffcanvasMenu';
import { AuthModal } from '@/components/modals/AuthModal';
import { BackToTop } from '@/components/common/BackToTop';
import { Toast } from '@/components/common/Toast';
import { ContactPage } from '@/views/ContactPage';
import { AboutPage } from '@/views/AboutPage';
import { ErrorPage } from '@/views/ErrorPage';
import { PrivacyPolicyPage } from '@/views/PrivacyPolicyPage';
import { LoginPage } from '@/views/LoginPage';
import { RegisterPage } from '@/views/RegisterPage';
import { ForgetPasswordPage } from '@/views/ForgetPasswordPage';
import { DashboardOverviewPage } from '@/views/dashboard/DashboardOverviewPage';
import { DashboardOrderPage } from '@/views/dashboard/DashboardOrderPage';
import { DashboardOrderDetailsPage } from '@/views/dashboard/DashboardOrderDetailsPage';
import { DashboardInvoicePage } from '@/views/dashboard/DashboardInvoicePage';
import { DashboardInvoiceDetailsPage } from '@/views/dashboard/DashboardInvoiceDetailsPage';
import { DashboardReturnPage } from '@/views/dashboard/DashboardReturnPage';
import { DashboardReturnRequestPage } from '@/views/dashboard/DashboardReturnRequestPage';
import { DashboardReturnProductPage } from '@/views/dashboard/DashboardReturnProductPage';
import { DashboardReviewPage } from '@/views/dashboard/DashboardReviewPage';
import { DashboardProfilePage } from '@/views/dashboard/DashboardProfilePage';
import { DashboardSecurityPage } from '@/views/dashboard/DashboardSecurityPage';
import { DashboardAddressPage } from '@/views/dashboard/DashboardAddressPage';
import { ShopPage } from '@/views/ShopPage';
import { MenPage } from '@/views/MenPage';
import { WomenPage } from '@/views/WomenPage';
// import { NewArrivalsPage } from '@/views/NewArrivalsPage';
import { CollectionsPage } from '@/views/CollectionsPage';
import { SalePage } from '@/views/SalePage';
import { ProductDetailsPage } from '@/views/ProductDetailsPage';
import { CartPage } from '@/views/CartPage';
import { CheckoutPage } from '@/views/CheckoutPage';
import { OrderConfirmationPage } from '@/views/OrderConfirmationPage';
import { TrackOrderPage } from '@/views/TrackOrderPage';
import { AdminDashboardPage } from '@/views/admin/AdminDashboardPage';

export default function HomePage() {
  const { currentPath, isAuthenticated, isAdmin, authLoading, navigate } = useShop();

  // If in admin mode, enforce dynamic authorization:
  // Admin dashboard requires valid authentication token AND ADMIN role.
  if (currentPath.startsWith('/admin')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 text-center font-satoshi">
          <div className="w-10 h-10 border-4 border-[#093624] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-[#141414]">Verifying administrator credentials...</p>
        </div>
      );
    }

    if (!isAuthenticated || !isAdmin) {
      return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 text-center font-satoshi">
          <div className="bg-white p-8 max-w-md w-full rounded-xs shadow-md border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-2xl font-bold font-satoshi-bold text-[#141414]">Access Restricted</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isAuthenticated
                ? 'Your account has Normal User privileges and is not authorized to access the Administrator Dashboard.'
                : 'Administrator credentials required. Please sign in with an authorized Administrator account.'}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#093624] hover:bg-[#052216] text-[#F9F295] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                {isAuthenticated ? 'Sign In with Admin Account' : 'Sign In as Admin'}
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  Return to Customer Dashboard
                </button>
              )}
            </div>
          </div>
          <Toast />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F9F9F9] antialiased selection:bg-[#093624] selection:text-[#F9F295]">
        <AdminDashboardPage />
        <QuickViewModal />
        <Toast />
      </div>
    );
  }

  // Enforce customer dashboard authorization:
  // Strictly for customers/normal users.
  // Admins have their dedicated management console and cannot access customer dashboard.
  if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/dashboard-')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-satoshi">
          <div className="w-10 h-10 border-4 border-[#093624] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-[#141414]">Verifying your session...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 text-center font-satoshi">
          <div className="bg-white p-8 max-w-md w-full rounded-xs shadow-md border border-gray-200 text-center space-y-4">
            <h2 className="text-2xl font-bold font-satoshi-bold text-[#141414]">Sign In Required</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Please sign in to your Reshans customer account to access your personal dashboard, track orders, and view invoices.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#093624] hover:bg-[#052216] text-[#F9F295] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Go to Sign In
              </button>
            </div>
          </div>
          <Toast />
        </div>
      );
    }

    // Role boundary: Administrator accounts cannot access customer dashboard
    if (isAdmin) {
      return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 text-center font-satoshi">
          <div className="bg-white p-8 max-w-md w-full rounded-xs shadow-md border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-[#093624] flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-2xl font-bold font-satoshi-bold text-[#141414]">Role Boundary Restricted</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              You are signed in as an <strong>Administrator</strong>. Administrator accounts are restricted to the Admin Console and cannot access personal customer dashboards.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/admin')}
                className="w-full py-3 bg-[#093624] hover:bg-[#052216] text-[#F9F295] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Go to Admin Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
          <Toast />
        </div>
      );
    }
  }

  const renderContent = () => {
    // Dynamic product details route (/product/:id)
    if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '').replace('.html', '');
      return <ProductDetailsPage productId={productId} />;
    }

    switch (currentPath) {
      case '/shop':
      case '/shop.html':
      case '/product-filter-top':
      case '/product-filter-top.html':
      case '/products':
        return <ShopPage />;
      case '/men':
      case '/men.html':
      case '/men-collection':
        return <MenPage />;
      case '/women':
      case '/women.html':
      case '/women-collection':
        return <WomenPage />;
      // case '/new-arrivals':
      // case '/new-arrivals.html':
      // case '/new':
      //   return <NewArrivalsPage />;
      case '/collections':
      case '/collections.html':
        return <CollectionsPage />;
      case '/sale':
      case '/sale.html':
        return <SalePage />;
      case '/product-details':
      case '/product-details.html':
      case '/product-details-default':
      case '/product-details-default.html':
        return <ProductDetailsPage />;
      case '/cart':
      case '/cart.html':
        return <CartPage />;
      case '/checkout':
      case '/checkout.html':
        return <CheckoutPage />;
      case '/order-confirmation':
      case '/order-confirmation.html':
        return <OrderConfirmationPage />;
      case '/track-order':
      case '/track-order.html':
        return <TrackOrderPage />;
      case '/dashboard':
      case '/dashboard.html':
        return <DashboardOverviewPage />;
      case '/dashboard/orders':
      case '/dashboard-order':
      case '/dashboard-order.html':
        return <DashboardOrderPage />;
      case '/dashboard/order-details':
      case '/dashboard-order-details':
      case '/dashboard-order-details.html':
        return <DashboardOrderDetailsPage />;
      case '/dashboard/invoices':
      case '/dashboard-invoice':
      case '/dashboard-invoice.html':
        return <DashboardInvoicePage />;
      case '/dashboard/invoice-details':
      case '/dashboard-invoice-details':
      case '/dashboard-invoice-details.html':
        return <DashboardInvoiceDetailsPage />;
      case '/dashboard/return':
      case '/dashboard-return':
      case '/dashboard-return.html':
        return <DashboardReturnPage />;
      case '/dashboard/return-request':
      case '/dashboard-return-request':
      case '/dashboard-return-request.html':
        return <DashboardReturnRequestPage />;
      case '/dashboard/return-product':
      case '/dashboard-return-product':
      case '/dashboard-return-product.html':
        return <DashboardReturnProductPage />;
      case '/dashboard/reviews':
      case '/dashboard-review':
      case '/dashboard-review.html':
        return <DashboardReviewPage />;
      case '/dashboard/profile':
      case '/dashboard-profile':
      case '/dashboard-profile.html':
        return <DashboardProfilePage />;
      case '/dashboard/security':
      case '/dashboard-security':
      case '/dashboard-security.html':
        return <DashboardSecurityPage />;
      case '/dashboard/address':
      case '/dashboard-address':
      case '/dashboard-address.html':
        return <DashboardAddressPage />;
      case '/login':
      case '/login.html':
        return <LoginPage />;
      case '/register':
      case '/register.html':
        return <RegisterPage />;
      case '/forget-password':
      case '/forget-password.html':
      case '/forgot-password':
        return <ForgetPasswordPage />;
      case '/contact':
      case '/contact.html':
        return <ContactPage />;
      case '/about':
      case '/about.html':
        return <AboutPage />;
      case '/privacy-policy':
      case '/privacy-policy.html':
        return <PrivacyPolicyPage />;
      case '/error':
      case '/404':
        return <ErrorPage />;
      case '/':
      case '':
        return (
          <>
            {/* 1. Hero Campaign Banner */}
            <HeroSection />

            {/* 2. Text Slide Marquee Ticker */}
            <MarqueeTicker />

            {/* 3. Trending Product (Saller Area with Filters & 4-column Grid) */}
            <TrendingProductsSection />

            {/* 4. Dual Campaign Promo Banners */}
            <DualBannerSection />

            {/* 5. Trending Products (New / Featured / Top Sellers Tabs & Grid) */}
            <PopularProductsSection />

            {/* 6. Top Categories Carousel */}
            <CategorySlider />

            {/* 7. New Arrivals Split Showcase ('Shop this look' with interactive look selector) */}
            <NewArrivalsSection />

            {/* 8. Trust Features Bar (Free Shipping, Returns, Security, Support) */}
            {/* <FeaturesSection /> */}

            {/* 9. Customer Testimonials & Reviews Carousel */}
            <TestimonialSection />

            {/* 10. Shopgram Instagram Showcase */}
            <ShopgramSection />
          </>
        );
      default:
        return <ErrorPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#141414] antialiased selection:bg-[#093624] selection:text-[#F9F295]">
      {/* Header Top Announcement & Currency/Language Bar */}
      <HeaderTop />

      {/* Main Navigation Header with Reshans BrandLogo */}
      <Header />

      {/* Main Content Sections or Routed Page */}
      <main className="flex-1">{renderContent()}</main>

      {/* Footer Area with Newsletter & Contacts */}
      <Footer />

      {/* Modals & Slideouts */}
      <CartminiDrawer />
      <WishlistDrawer />
      <SearchModal />
      <QuickViewModal />
      <OffcanvasMenu />
      <AuthModal />

      {/* Floating Utilities */}
      <BackToTop />
      <Toast />
    </div>
  );
}
