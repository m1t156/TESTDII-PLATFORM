"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Share2, Copy, Check, RotateCcw } from "lucide-react";

interface ShareBarProps {
  personalityName: string;
}

export function ShareBar({ personalityName }: ShareBarProps) {
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
    <div className="editorial-card p-6 sm:p-8 bg-white text-center space-y-4">
      <h3 className="text-lg font-bold text-stone-900">
        Chia sẻ hoặc làm lại bài test
      </h3>
      <p className="text-sm text-stone-500 max-w-md mx-auto">
        Lưu giữ kết quả tính cách độc bản của bạn hoặc chia sẻ với bạn bè để so sánh sự tương thích.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button variant="outline" onClick={handleCopyLink} className="gap-2">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? "Đã sao chép link!" : "Sao chép liên kết"}
        </Button>

        <Button variant="secondary" onClick={handleWebShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          Chia sẻ kết quả
        </Button>

        <Link href="/test">
          <Button variant="primary" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Làm lại bài test
          </Button>
        </Link>
      </div>
    </div>
  );
}
