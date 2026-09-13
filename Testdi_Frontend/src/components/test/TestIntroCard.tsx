import Link from "next/link";
import { Button } from "@/components/common/Button";
import { DimensionExplorer } from "@/components/personality/DimensionExplorer";
import { Clock, HelpCircle, Layers, ArrowRight } from "lucide-react";

export function TestIntroCard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="editorial-card p-6 sm:p-10 space-y-8 bg-white transition-colors duration-200">
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="editorial-tag">SBTI TEST</span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Khám phá 15 chiều không gian tính cách
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Trả lời thật lòng theo phản ứng tự nhiên của bạn. Không có câu trả lời đúng hay sai, chỉ có sự chân thật giúp bạn tìm thấy đúng bản thể của mình.
          </p>
        </div>

        {/* Quick info metrics */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-800">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Clock className="w-4 h-4 text-stone-600" /> Thời gian
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-900 mt-1">~5 - 7 phút</span>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-x border-stone-200 px-2">
            <span className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <HelpCircle className="w-4 h-4 text-stone-600" /> Số câu hỏi
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-900 mt-1">31 câu hỏi</span>
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Layers className="w-4 h-4 text-stone-600" /> Linh thú
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-900 mt-1">27 loại hình</span>
          </div>
        </div>

        {/* Interactive 5 Dimensions Explorer */}
        <div className="pt-2">
          <DimensionExplorer />
        </div>

        {/* Action button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
          <p className="text-xs text-stone-500">
            Kết quả của bạn sẽ được lưu giữ bảo mật.
          </p>
          <Link href="/test/sbti" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold">
              Bắt đầu bài test
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
