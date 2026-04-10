import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/contexts/CartContext";
import ConditionalHeaderFooter from "@/components/ConditionalHeaderFooter";
import FloatingCart from "@/components/FloatingCart";
import GlobalOverlays from "@/components/GlobalOverlays";
import ClientThemeProvider from "@/components/ClientThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://amarorganicshop.com'),
  title: "Amar Organic Shop | Best Organic Products in Bangladesh",
  description: "Buy 100% pure and organic honey, dates, ghee, seeds, and natural products from Amar Organic Shop. Safe, reliable, and premium quality food for every home.",
  keywords: "organic food bangladesh, pure honey, natural products, ghee, premium dates, amar organic shop, healthy food, sundarban honey",
  openGraph: {
    title: 'Amar Organic Shop | Buy Pure Organic Products',
    description: '100% authentic and naturally sourced organic foods for your healthy lifestyle.',
    url: 'https://amarorganicshop.com',
    siteName: 'Amar Organic Shop',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amar Organic Shop',
    description: 'Buy 100% pure and organic natural products in Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientThemeProvider />
        <CartProvider>
          <ConditionalHeaderFooter>
            <GlobalOverlays />
            <Navbar />
            <FloatingCart />
          </ConditionalHeaderFooter>
          {children}
          <ConditionalHeaderFooter>
            <Footer />
          </ConditionalHeaderFooter>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
