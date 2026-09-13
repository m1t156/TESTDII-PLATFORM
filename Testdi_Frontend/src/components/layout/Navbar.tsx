"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Compass, Info, PlayCircle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#fafaf8]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition">
            TESTDII
          </span>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">
            SBTI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link
            href="/"
            className={`transition hover:text-stone-900 ${
              isActive("/") ? "text-stone-900 font-semibold" : ""
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/test"
            className={`transition hover:text-stone-900 ${
              isActive("/test") ? "text-stone-900 font-semibold" : ""
            }`}
          >
            Bài trắc nghiệm
          </Link>
          <Link
            href="/about"
            className={`transition hover:text-stone-900 ${
              isActive("/about") ? "text-stone-900 font-semibold" : ""
            }`}
          >
            Giới thiệu
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/test"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-stone-900 rounded-xl hover:bg-stone-800 active:scale-[0.98] transition shadow-xs"
          >
            Bắt đầu test
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#fafaf8] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            <Compass className="w-5 h-5 text-stone-500" />
            Trang chủ
          </Link>
          <Link
            href="/test"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            <PlayCircle className="w-5 h-5 text-stone-500" />
            Làm bài test
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
          >
            <Info className="w-5 h-5 text-stone-500" />
            Giới thiệu
          </Link>

          <div className="pt-2">
            <Link
              href="/test"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-2.5 px-4 text-center font-medium text-white bg-stone-900 rounded-xl"
            >
              Bắt đầu test
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
