"use client";

import Image from "next/image";
import Link from "next/link";
import { ArchetypeMatch } from "@/lib/api";

interface ResultTopMatchesProps {
  topMatches?: ArchetypeMatch[];
}

export function ResultTopMatches({ topMatches }: ResultTopMatchesProps) {
  if (!topMatches || topMatches.length === 0) return null;

  return (
    <div className="mb-12 p-6 rounded-3xl bg-white/90 border border-black/5 shadow-sm transition-colors duration-200">
      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-900 mb-4 text-center">
        Closest SBTI Personality Matches
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {topMatches.slice(0, 4).map((match) => (
          <Link
            key={match.code}
            href={`/personality/${match.code}`}
            className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-700 transition-all group block"
          >
            <div className="relative w-16 h-16 mx-auto mb-2">
              <Image
                src={match.image || `/characters/${match.code}.png`}
                alt={match.name}
                fill
                sizes="64px"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 truncate">
              {match.name}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
              {match.similarityPercentage}% match
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
