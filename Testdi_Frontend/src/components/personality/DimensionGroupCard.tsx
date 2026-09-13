"use client";

import Image from "next/image";
import Link from "next/link";
import { DimensionGroup } from "@/lib/dimensionData";
import { getCharacterImageUrl } from "@/api/personalityApi";
import { getWittyProfile } from "@/lib/personalityDescriptions";
import {
  User,
  Heart,
  Compass,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MinusCircle,
  Lightbulb,
  PlayCircle,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  User,
  Heart,
  Compass,
  Zap,
  Users,
};

interface DimensionGroupCardProps {
  group: DimensionGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DimensionGroupCard({
  group,
  isExpanded,
  onToggle,
}: DimensionGroupCardProps) {
  const IconComponent = ICON_MAP[group.iconName] || CheckCircle2;

  return (
    <div
      className={`editorial-card transition-all duration-300 overflow-hidden ${
        isExpanded
          ? "bg-white border-stone-900 shadow-sm"
          : "bg-white hover:border-stone-300"
      }`}
    >
      {/* Accordion Header Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isExpanded
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-800"
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-stone-900 text-base sm:text-lg tracking-tight">
              {group.title}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm truncate mt-0.5">
              {group.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-500 shrink-0">
          <span className="text-xs font-semibold hidden sm:inline text-stone-400">
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
          </span>
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* Accordion Expanded Body */}
      {isExpanded && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-6 animate-fadeIn">
          {/* Group Philosophy Overview */}
          <p className="text-stone-700 text-sm leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/60">
            {group.desc}
          </p>

          {/* 3 Sub-Dimensions Detailed Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Giải thích 3
              chỉ số chuyên sâu
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {group.subDimensions.map((sub) => (
                <div
                  key={sub.code}
                  className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 hover:border-stone-300 transition"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">
                      {sub.name}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {sub.code}
                    </span>
                  </div>

                  {/* Detailed Definition & Real Life Example */}
                  {sub.detailedDefinition && (
                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 font-medium flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span><span className="font-bold text-amber-900">Bản chất chỉ số:</span> {sub.detailedDefinition}</span>
                    </p>
                  )}

                  {sub.exampleScenario && (
                    <p className="text-stone-700 text-xs leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/80 flex items-start gap-2">
                      <PlayCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                      <span><span className="font-bold text-stone-900">Tình huống ví dụ:</span> {sub.exampleScenario}</span>
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        CHỈ SỐ HIGH (CAO):
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        {sub.meaningHigh}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <MinusCircle className="w-3.5 h-3.5 text-stone-500" />
                        CHỈ SỐ LOW (THẤP):
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        {sub.meaningLow}
                      </p>
                    </div>
                  </div>

                  {/* Related Archetypes Badges */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                      Linh thú có chỉ số HIGH ở nhóm này:
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {sub.highArchetypes.slice(0, 7).map((archCode) => {
                        const profile = getWittyProfile(archCode);
                        const imageUrl = getCharacterImageUrl(archCode);
                        return (
                          <Link
                            key={archCode}
                            href={`/personality/${archCode}`}
                            className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition text-xs font-medium text-stone-800"
                          >
                            <div className="relative w-4 h-4 rounded overflow-hidden shrink-0">
                              <Image
                                src={imageUrl}
                                alt={archCode}
                                fill
                                sizes="16px"
                                className="object-contain"
                              />
                            </div>
                            <span>{archCode}</span>
                            <span className="text-[10px] text-stone-400 group-hover:text-stone-300">
                              ({profile.name.split(" — ")[1] || profile.name})
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
