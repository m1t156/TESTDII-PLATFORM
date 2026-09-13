"use client";

import { useState } from "react";
import Link from "next/link";
import { SBTIResult } from "@/api/testApi";
import { PersonalizedShareCard } from "@/components/result/PersonalizedShareCard";
import { Button } from "@/components/common/Button";
import { Share2, Copy, Check, RotateCcw } from "lucide-react";

interface ShareBarProps {
  personalityName: string;
  result?: SBTIResult;
}

export function ShareBar({ personalityName, result }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWebShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Kết quả TESTDII: ${personalityName}`,
          text: `Tôi vừa hoàn thành bài test tính cách SBTI và kết quả của tôi là ${personalityName}! Khám phá tính cách của bạn tại TESTDII:`,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Share Card section if result object is available */}
      {result && <PersonalizedShareCard result={result} />}

      {/* Retake Test & Quick Share Bar */}
      <div className="editorial-card p-6 sm:p-8 bg-white transition-colors duration-200 text-center space-y-4">
        <h3 className="text-lg font-bold text-stone-900">
          Tùy chọn bổ sung & Thử lại
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          Bạn muốn làm lại bài test để kiểm tra lại các chỉ số hoặc thử nghiệm các câu trả lời khác?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!result && (
            <>
              <Button variant="outline" onClick={handleCopyLink} className="gap-2 text-stone-700 border-stone-300">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Đã sao chép link!" : "Sao chép liên kết"}
              </Button>

              <Button variant="secondary" onClick={handleWebShare} className="gap-2 text-stone-800 bg-stone-100 border border-stone-200">
                <Share2 className="w-4 h-4" />
                Chia sẻ kết quả
              </Button>
            </>
          )}

          <Link href="/test">
            <Button variant="primary" className="gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold">
              <RotateCcw className="w-4 h-4" />
              Làm lại bài test
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
