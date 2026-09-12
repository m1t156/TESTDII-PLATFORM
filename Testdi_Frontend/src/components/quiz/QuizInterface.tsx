"use client";

import React, { useState } from "react";
import { Question } from "@/lib/api";
import { sound } from "@/lib/sound";
import { Sparkles, ChevronRight, CheckCircle2, Wine } from "lucide-react";

interface QuizInterfaceProps {
  questions: Question[];
  onSubmit: (answers: { questionId: string; selectedOptionId: string; score: number }[]) => void;
  onAnswerSelect?: (currentIndex: number, total: number) => void;
  isLoadingResult?: boolean;
}

export default function QuizInterface({
  questions,
  onSubmit,
  onAnswerSelect,
  isLoadingResult = false,
}: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selectedOptionId: string; score: number }>>({});

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const selectedOption = userAnswers[currentQ?.id]?.selectedOptionId;
  const isDrunkQuestion = currentQ?.id === "Q31";

  const handleSelectOption = (optionId: string, score: number) => {
    sound.playOptionSelect();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { selectedOptionId: optionId, score },
    }));

    if (onAnswerSelect) {
      onAnswerSelect(currentIndex + 1, questions.length);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      sound.playEnergyCharge(currentIndex / questions.length);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(userAnswers).map(([qId, val]) => ({
      questionId: qId,
      selectedOptionId: val.selectedOptionId,
      score: val.score,
    }));
    onSubmit(formattedAnswers);
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 z-10 relative">
      {/* Progress Header */}
      <div className="mb-6 rounded-2xl bg-white/85 p-4 border border-black/5 shadow-md">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Prompt {currentIndex + 1} of {questions.length}
          </span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full rounded-full bg-emerald-800 transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xl bg-white/90 transition-all duration-200 ${
          isDrunkQuestion
            ? "border-amber-400/60 bg-gradient-to-b from-amber-50/50 to-white"
            : "border-black/5"
        }`}
      >
        {/* Special Badge for Q31 */}
        {isDrunkQuestion && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-4">
            <Wine className="w-4 h-4 text-amber-700" />
            SECRET PROMPT: DRUNK OVERRIDE
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mb-6 leading-relaxed">
          {currentQ.text}
        </h2>

        {/* Options List */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id, opt.score)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? "bg-emerald-50/80 border-emerald-700 text-emerald-950 font-semibold shadow-sm"
                    : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <span className="flex-1 text-base pr-3 leading-relaxed">{opt.text}</span>
                <CheckCircle2
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isSelected ? "text-emerald-700 scale-110 opacity-100" : "opacity-0 group-hover:opacity-40 text-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || isLoadingResult}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!selectedOption || isLoadingResult}
              className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isLoadingResult}
              className="px-8 py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              {isLoadingResult ? "Calculating 15-Dimension Vector..." : "Reveal SBTI Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
