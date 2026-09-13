import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TESTDII — Trắc nghiệm & Khám phá 27 Nhóm Tính Cách",
  description: "Khám phá bản thân qua bài trắc nghiệm tính cách 15 chiều không gian và 27 linh thú độc bản.",
  keywords: ["TESTDII", "SBTI", "Trắc nghiệm tính cách", "27 tính cách", "Personality Discovery"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#fafaf8] text-stone-900 font-sans selection:bg-stone-900 selection:text-white transition-colors duration-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
