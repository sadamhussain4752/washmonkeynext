"use client";

import Providers from '@/store/providers';
import Header from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import "@/styles/globals.css";
import "@/styles/index.css";
import "@/styles/tailwind.css";
import "@/styles/theme.css";
import "@/styles/gobles.css";
import "@/styles/fonts.css";
import { MobileBottomNav } from "@/app/components/MobileBottomNav";
import ScrollToTopOnRouteChange from "@/app/components/ScrollToTopOnRouteChange";
import Script from "next/script";
import { Toaster } from "sonner";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<Toaster position="top-center" richColors />
      {/* ✅ HEAD SECTION */}
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png" />
      </head>

      <body suppressHydrationWarning>

        {/* ✅ Google Maps Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB8sXlogUxWfhdz7Pi3H26EF_tkdRb90z0&libraries=places`}
          strategy="beforeInteractive"
        />

        <Header />
        <Providers>{children}</Providers>
        <Footer />
        <MobileBottomNav />
        <ScrollToTopOnRouteChange />

      </body>
    </html>
  );
}