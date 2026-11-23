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
  // Direct redirect to /login without showing access restriction screens or extra steps.
  if (currentPath.startsWith('/admin')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 text-center font-satoshi">
          <div className="w-10 h-10 border-4 border-[#093624] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-[#141414]">Verifying credentials...</p>
        </div>
      );
    }

    if (!isAuthenticated || !isAdmin) {
      if (typeof window !== 'undefined') {
        navigate('/login');
      }
      return null;
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
  // Direct redirect to /login if unauthenticated or wrong credentials/role without restriction UI.
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
      if (typeof window !== 'undefined') {
        navigate('/login');
      }
      return null;
    }

    // Role boundary: Administrator accounts cannot access customer dashboard -> direct redirect to admin dashboard
    if (isAdmin) {
      if (typeof window !== 'undefined') {
        navigate('/admin');
      }
      return null;
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
