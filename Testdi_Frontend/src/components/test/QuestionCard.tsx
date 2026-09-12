import { Question, QuestionOption } from "@/api/testApi";
import { Button } from "@/components/common/Button";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (option: QuestionOption) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitting?: boolean;
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  isSubmitting = false,
}: QuestionCardProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold tracking-wider text-stone-500 uppercase">
          <span>CÂU HỎI {String(currentIndex + 1).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}</span>
          {question.isBonus && (
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
              CÂU HỎI ĐẶC BIỆT 🍻
            </span>
          )}
        </div>
        <ProgressBar current={currentIndex + 1} total={totalQuestions} showText={false} />
      </div>

      {/* Main Question Card */}
      <div className="editorial-card p-6 sm:p-10 space-y-8 bg-white min-h-[360px] flex flex-col justify-between">
        {/* Question Text */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
            {question.questionText}
          </h2>
          <p className="text-xs text-stone-500">
            Chọn câu trả lời gần nhất với tính cách tự nhiên của bạn.
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 my-6">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.optionId;
            return (
              <button
                key={option.optionId}
                type="button"
                onClick={() => onSelectOption(option)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                  isSelected
                    ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                    : "bg-stone-50/50 text-stone-800 border-stone-200 hover:border-stone-300 hover:bg-stone-100/60"
                }`}
              >
                <span className="text-sm sm:text-base font-medium leading-relaxed">
                  {option.text}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-white border-white text-stone-900"
                      : "border-stone-300 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={isFirst || isSubmitting}
            className="gap-2 text-stone-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Trở lại
          </Button>

          <Button
            variant="primary"
            onClick={onNext}
            disabled={!selectedOptionId || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              "Đang hoàn tất..."
            ) : isLast ? (
              "Xem kết quả"
            ) : (
              <>
                Tiếp theo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
