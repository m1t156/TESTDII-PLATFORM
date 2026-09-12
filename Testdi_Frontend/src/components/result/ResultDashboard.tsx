"use client";

import React, { useEffect } from "react";
import { SBTIResultData } from "@/lib/api";
import confetti from "canvas-confetti";
import { Sparkles, RefreshCw, Share2, ShieldCheck } from "lucide-react";
import { ResultFlipCard } from "@/components/result/ResultFlipCard";
import { ResultTopMatches } from "@/components/result/ResultTopMatches";

interface ResultDashboardProps {
  result: SBTIResultData;
  onReset: () => void;
}

export default function ResultDashboard({ result, onReset }: ResultDashboardProps) {
  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0f766e", "#c0841e", "#164e63", "#044e46"],
      });
    } catch {}
  }, []);

  const mainBear = result.mainType;
  const groups = result.dimensionAnalysis?.groups || {};

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 z-10 relative animate-fadeIn">
      {/* Header Result Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-emerald-900 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          SBTI Personality Profile Result
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 mb-2">
          {mainBear.name}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 italic max-w-md mx-auto">
          "{mainBear.title}"
        </p>
      </div>

      {/* Main Grid: Card & DNA Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        {/* Left: Interactive 3D Flip Card */}
        <ResultFlipCard mainBear={mainBear} dnaTattoo={result.dnaTattoo} />

        {/* Right: Detailed Description & 5-Dimension Bars */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 border border-black/5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Personality Profile Summary
            </h3>
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              {mainBear.description}
            </p>
            {result.method && (
              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono">
                Calculation Method: <span className="text-emerald-800 font-semibold">{result.method}</span>
              </div>
            )}
          </div>

          {/* 5-Group Dimensions Bar Progress */}
          <div className="p-6 rounded-3xl bg-white/90 border border-black/5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900 mb-4">
              5 Personality Model Dimensions
            </h3>
            <div className="space-y-3">
              {Object.entries(groups).map(([groupKey, grp]) => (
                <div key={groupKey} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{grp.groupName}</span>
                    <span className="text-emerald-800">{grp.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                      style={{ width: `${grp.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Compatible Companion Bears */}
      <ResultTopMatches topMatches={result.topMatches} />

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retake Test
        </button>
        <button
          type="button"
          onClick={() => alert("Result shared successfully!")}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" /> Share Result
        </button>
      </div>
    </div>
  );
}

