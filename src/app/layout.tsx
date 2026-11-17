import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import { AosInitializer } from '@/components/common/AosInitializer';

export const metadata: Metadata = {
  title: 'Reshans - Modern Fashion & Apparel Store',
  description:
    'Reshans luxury fashion and apparel ecommerce storefront with trending products, exclusive collections, and new arrivals.',
  openGraph: {
    title: 'Reshans - Modern Fashion & Apparel Store',
    description:
      'Reshans luxury fashion and apparel ecommerce storefront with trending products, exclusive collections, and new arrivals.',
    url: 'https://reshans.com',
    siteName: 'Reshans',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-[#141414] font-satoshi selection:bg-[#093624] selection:text-[#F9F295]">
        <ShopProvider>
          <AosInitializer />
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
