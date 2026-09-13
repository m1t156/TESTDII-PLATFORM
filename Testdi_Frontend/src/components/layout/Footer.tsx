import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#fafaf8] py-12 text-stone-600 text-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-stone-200">
          <div>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              TESTDII
            </span>
            <p className="mt-1 text-stone-500 max-w-md">
              Nền tảng khám phá 27 nhóm tính cách độc bản qua hệ thống phân tích 15 chiều chuyên sâu.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-stone-600 font-medium">
            <Link href="/" className="hover:text-stone-900 transition">
              Trang chủ
            </Link>
            <Link href="/test" className="hover:text-stone-900 transition">
              Làm bài test
            </Link>
            <Link href="/about" className="hover:text-stone-900 transition">
              Giới thiệu
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} TESTDII — Khám phá bản ngã. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
