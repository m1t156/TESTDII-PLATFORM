import Link from "next/link";
import { Button } from "@/components/common/Button";
import { PersonalityGallery } from "@/components/personality/PersonalityGallery";
import { PopularScoreboard } from "@/components/personality/PopularScoreboard";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "TESTDII — Khám phá bản ngã tính cách của bạn",
  description: "Bản tính cách của bạn rộng lớn hơn một nhãn dán. Khám phá 15 chiều tâm hồn và 27 loại hình tính cách cùng TESTDII.",
};

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#fafaf8] transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 max-w-4xl mx-auto text-center space-y-6">
        <span className="editorial-tag inline-flex items-center gap-1.5 bg-stone-100 text-stone-800 border-stone-200">
          <Sparkles className="w-3.5 h-3.5 text-stone-700" /> Nền tảng khám phá tính cách SBTI
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
          Khám phá bản ngã của bạn.
        </h1>

        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Tính cách của bạn rộng lớn hơn một tên gọi. TESTDII giúp bạn hiểu sâu sắc cách bạn tư duy, cảm nhận, hành động và kết nối với thế giới.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/test" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-stone-900 text-white hover:bg-stone-800 font-bold">
              Bắt đầu bài test
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/about" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-stone-800 bg-stone-100 border-stone-200 hover:bg-stone-200">
              Tìm hiểu thêm
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. INTRODUCTION CONCEPT */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="editorial-card p-8 sm:p-12 bg-white text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
            TRIẾT LÝ TESTDII
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Thấu hiểu bản thân là bước đầu tiên để sống đúng với giá trị của mình.
          </h2>
          <p className="text-stone-600 leading-relaxed text-base max-w-2xl mx-auto">
            Dựa trên hệ thống phân tích 15 chiều không gian (từ Tự trọng, Chiều sâu cảm xúc, Động lực hành động đến Ranh giới xã hội), TESTDII mang lại cái nhìn bao quát nhưng vô cùng tinh tế về chính bạn.
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Cách thức hoạt động
          </h2>
          <p className="text-stone-500 text-sm">3 bước đơn giản để tìm thấy bản thể linh thú của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="editorial-card p-6 bg-white space-y-4">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-mono font-bold flex items-center justify-center text-base">
              01
            </div>
            <h3 className="text-lg font-bold text-stone-900">Trả lời chân thật</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Hoàn thành chuỗi 31 câu hỏi được thiết kế kỹ lưỡng mà không cần lo lắng về đúng hay sai.
            </p>
          </div>

          {/* Step 2 */}
          <div className="editorial-card p-6 bg-white space-y-4">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-mono font-bold flex items-center justify-center text-base">
              02
            </div>
            <h3 className="text-lg font-bold text-stone-900">Khám phá mẫu hình</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Hệ thống thuật toán phân tích vectơ 15 chiều sẽ định vị chính xác archetype phù hợp nhất.
            </p>
          </div>

          {/* Step 3 */}
          <div className="editorial-card p-6 bg-white space-y-4">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-mono font-bold flex items-center justify-center text-base">
              03
            </div>
            <h3 className="text-lg font-bold text-stone-900">Thấu hiểu chiều sâu</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Nhận báo cáo kết quả chi tiết kèm hình ảnh linh thú độc bản và danh sách tính cách tương đồng.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PERSONALITY PREVIEW GALLERY */}
      <section className="max-w-5xl mx-auto px-4">
        <PersonalityGallery
          limit={5}
          title="Xem trước một số nhóm tính cách"
          subtitle="Khám phá 5 trong số 27 linh thú đại diện cho các trường năng lượng tâm hồn khác nhau."
        />
        <div className="text-center pt-6">
          <Link href="/about" className="text-sm font-semibold text-stone-700 hover:text-stone-900 underline underline-offset-4">
            Xem tất cả 27 loại hình tính cách →
          </Link>
        </div>
      </section>

      {/* 5. POPULAR PERSONALITIES SCOREBOARD */}
      <section className="max-w-5xl mx-auto px-4">
        <PopularScoreboard />
      </section>
    </div>
  );
}
