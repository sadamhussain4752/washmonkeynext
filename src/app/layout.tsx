"use client"; // only if using state/hooks
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


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Header />
       <Providers>{children}</Providers>
        <Footer />
        <MobileBottomNav/>
        <ScrollToTopOnRouteChange />
      </body>
    </html>
  );
}
