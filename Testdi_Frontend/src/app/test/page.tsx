import { TestIntroCard } from "@/components/test/TestIntroCard";

export const metadata = {
  title: "Giới thiệu bài trắc nghiệm SBTI | TESTDII",
  description: "Chuẩn bị tâm trí để khám phá 15 chiều tính cách cá nhân.",
};

export default function TestIntroPage() {
  return (
    <div className="py-8 bg-[#fafaf8]">
      <TestIntroCard />
    </div>
  );
}
