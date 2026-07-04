import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-store";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexusmart-manashjyoti.vercel.app"),
  title: { default: "NexusMart — Premium Tech Store", template: "%s — NexusMart" },
  description:
    "Full-stack e-commerce demo by Manashjyoti Bora: Next.js App Router, MongoDB, JWT auth, cart, checkout and admin panel.",
  openGraph: {
    title: "NexusMart — Premium Tech Store",
    description: "Full-stack e-commerce: Next.js + MongoDB + JWT auth.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0a0d14" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-24 sm:px-6">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
