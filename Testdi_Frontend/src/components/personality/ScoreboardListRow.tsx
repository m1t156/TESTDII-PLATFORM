"use client";

import Image from "next/image";
import Link from "next/link";
import { ScoreboardItem } from "@/api/testApi";
import { getCharacterImageUrl } from "@/api/personalityApi";
import { getWittyProfile } from "@/lib/personalityDescriptions";
import { Users } from "lucide-react";

interface ScoreboardListRowProps {
  item: ScoreboardItem;
}

export function ScoreboardListRow({ item }: ScoreboardListRowProps) {
  const profile = getWittyProfile(item.code);
  const imageUrl = getCharacterImageUrl(item.code);

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-amber-400 text-amber-950 font-bold border-amber-500 shadow-xs";
      case 2:
        return "bg-stone-300 text-stone-900 font-bold border-stone-400";
      case 3:
        return "bg-amber-700/20 text-amber-900 font-bold border-amber-700/40";
      default:
        return "bg-stone-100 text-stone-600 font-semibold border-stone-200";
    }
  };

  return (
    <Link
      href={`/personality/${item.code}`}
      className="group p-4 sm:p-5 rounded-2xl border border-stone-200/80 bg-stone-50/60 hover:bg-white hover:border-stone-400 hover:shadow-xs transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Left: Rank + Avatar + Name */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Rank Badge */}
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm shrink-0 ${getRankBadgeStyle(
            item.rank
          )}`}
        >
          #{item.rank}
        </div>

        {/* Character Avatar */}
        <div className="relative w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center p-1">
          <Image
            src={imageUrl}
            alt={profile.name}
            fill
            sizes="56px"
            className="object-contain p-1 group-hover:scale-105 transition duration-200"
          />
        </div>

        {/* Name & Tagline */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
              {item.code}
            </span>
            <h3 className="font-bold text-stone-900 text-base truncate group-hover:text-stone-700">
              {profile.name}
            </h3>
          </div>
          <p className="text-stone-500 text-xs truncate mt-1">
            “{profile.tagline}”
          </p>
        </div>
      </div>

      {/* Right: Percentage Bar + Count */}
      <div className="w-full sm:w-48 shrink-0 space-y-1 sm:text-right">
        <div className="flex justify-between sm:justify-end items-center gap-2 text-xs font-semibold text-stone-700">
          <span className="flex items-center gap-1 text-stone-500 font-normal">
            <Users className="w-3.5 h-3.5" /> {item.count.toLocaleString()} người
          </span>
          <span className="font-mono font-bold text-stone-900 text-sm">
            {item.percentage}%
          </span>
        </div>

        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-stone-900 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${item.percentage}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
