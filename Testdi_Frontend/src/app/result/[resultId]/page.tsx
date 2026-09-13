"use client";

import { useEffect, useState, use } from "react";
import { testApi, SBTIResult } from "@/api/testApi";
import { ResultHero } from "@/components/result/ResultHero";
import { DimensionBreakdown } from "@/components/result/DimensionBreakdown";
import { TopMatches } from "@/components/result/TopMatches";
import { ShareBar } from "@/components/result/ShareBar";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";

export default function ResultByIdPage({ params }: { params: Promise<{ resultId: string }> }) {
  const resolvedParams = use(params);
  const resultId = resolvedParams.resultId;

  const [result, setResult] = useState<SBTIResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testApi.getResultById(resultId);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Không thể tìm thấy kết quả tương ứng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resultId) fetchResult();
  }, [resultId]);

  if (loading) {
    return <Loading message="Đang tải kết quả bài test..." fullScreen />;
  }

  if (error || !result) {
    return (
      <ErrorState
        title="Không tìm thấy kết quả"
        message={error || "Kết quả này không tồn tại hoặc đã bị xóa."}
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
      <ShareBar personalityName={result.mainType.name} result={result} />
    </div>
  );
}
