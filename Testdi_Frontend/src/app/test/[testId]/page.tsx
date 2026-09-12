"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testApi, Question, QuestionOption, SubmitAnswerPayload } from "@/api/testApi";
import { QuestionCard } from "@/components/test/QuestionCard";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";

export default function QuizExecutionPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, SubmitAnswerPayload>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await testApi.getQuestions();
      setQuestions(res.questions);

      // Load draft answers from localStorage if available
      try {
        const savedDraft = localStorage.getItem("testdii_answers_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === "object") {
            setAnswers(parsed);
          }
        }
      } catch {
        // ignore draft parse error
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSelectOption = (option: QuestionOption) => {
    if (!questions[currentIndex]) return;
    const currentQ = questions[currentIndex];

    const updated = {
      ...answers,
      [currentQ._id]: {
        questionId: currentQ._id,
        selectedOptionId: option.optionId,
        score: option.points,
      },
    };

    setAnswers(updated);

    // Save draft locally
    try {
      localStorage.setItem("testdii_answers_draft", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit test
      setSubmitting(true);
      try {
        const answerList: SubmitAnswerPayload[] = Object.values(answers);
        const result = await testApi.submitTest(answerList);
        
        // Clear local draft
        localStorage.removeItem("testdii_answers_draft");

        // Redirect to result page
        const resultId = result.sbtiResultId || result._id;
        if (resultId) {
          router.push(`/test/sbti/result?id=${resultId}`);
        } else {
          router.push(`/test/sbti/result`);
        }
      } catch (err: any) {
        alert(err.message || "Có lỗi xảy ra khi nộp bài test. Vui lòng thử lại.");
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return <Loading message="Đang chuẩn bị danh sách câu hỏi..." fullScreen />;
  }

  if (error || questions.length === 0) {
    return (
      <ErrorState
        title="Không thể tải câu hỏi"
        message={error || "Hiện tại không tìm thấy câu hỏi nào."}
        onRetry={loadQuestions}
      />
    );
  }

  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ._id];

  return (
    <div className="py-6 sm:py-12 bg-[#fafaf8]">
      <QuestionCard
        question={currentQ}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selectedOptionId={selectedAnswer?.selectedOptionId}
        onSelectOption={handleSelectOption}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirst={currentIndex === 0}
        isLast={currentIndex === questions.length - 1}
        isSubmitting={submitting}
      />
    </div>
  );
}
