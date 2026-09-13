import { PersonalityGallery } from "@/components/personality/PersonalityGallery";
import { DimensionExplorer } from "@/components/personality/DimensionExplorer";

export const metadata = {
  title: "Giới thiệu TESTDII | Khám phá 27 nhóm tính cách",
  description: "Tìm hiểu phương pháp luận trắc nghiệm tính cách SBTI và bộ sưu tập 27 linh thú độc bản.",
};

export default function AboutPage() {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-16 bg-[#fafaf8] transition-colors duration-200">
      {/* Intro section */}
      <div className="editorial-card p-8 sm:p-12 bg-white space-y-6">
        <span className="editorial-tag bg-stone-100 text-stone-800 border-stone-200">ABOUT TESTDII</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Về nền tảng TESTDII &amp; Phương pháp SBTI
        </h1>
        <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
          TESTDII được xây dựng nhằm cung cấp góc nhìn tính cách chân thật, khoa học nhưng không kém phần sinh động. Thay vì gán cho người dùng những nhãn dán cứng nhắc, hệ thống phân tích không gian tâm hồn qua 15 chỉ số độc lập (từ Tự trọng, Tự nhận thức đến Khả năng thực thi và Ranh giới cá nhân).
        </p>

        {/* Interactive 5 Dimensions Explorer Accordion */}
        <div className="pt-4 border-t border-stone-200">
          <DimensionExplorer />
        </div>
      </div>

      {/* Complete 27 personalities gallery */}
      <section>
        <PersonalityGallery
          title="Bộ sưu tập 27 linh thú tính cách"
          subtitle="Tất cả 27 loại hình tính cách được mã hóa trực quan qua nét vẽ nhân vật cá tính."
        />
      </section>
    </div>
  );
}
