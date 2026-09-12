"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { testApi, SBTIResult } from "@/api/testApi";
import { ResultHero } from "@/components/result/ResultHero";
import { DimensionBreakdown } from "@/components/result/DimensionBreakdown";
import { TopMatches } from "@/components/result/TopMatches";
import { ShareBar } from "@/components/result/ShareBar";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";

function ResultContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");

  const [result, setResult] = useState<SBTIResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      if (resultId) {
        const data = await testApi.getResultById(resultId);
        setResult(data);
      } else {
        const data = await testApi.getLatestResult();
        if (data) {
          setResult(data);
        } else {
          setError("Không tìm thấy kết quả bài test.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải kết quả bài test.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  if (loading) {
    return <Loading message="Đang phân tích và tổng hợp kết quả tính cách..." fullScreen />;
  }

  if (error || !result) {
    return (
      <ErrorState
        title="Không tìm thấy kết quả"
        message={error || "Vui lòng làm bài test để nhận kết quả tính cách."}
        onRetry={fetchResult}
      />
    );
  }

  const dimensionGroups = (result.dimensionAnalysis as any)?.groups || result.dimensionAnalysis || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <ResultHero result={result} />
      <DimensionBreakdown groups={dimensionGroups} />
      <TopMatches matches={result.topMatches || []} />
      <ShareBar personalityName={result.mainType.name} />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading message="Đang tải kết quả..." fullScreen />}>
      <ResultContent />
    </Suspense>
  );
}
