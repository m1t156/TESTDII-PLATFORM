import Image from "next/image";
import Link from "next/link";
import { TopMatchResult } from "@/api/testApi";
import { getCharacterImageUrl } from "@/api/personalityApi";

interface TopMatchesProps {
  matches: TopMatchResult[];
}

export function TopMatches({ matches }: TopMatchesProps) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="editorial-card p-6 sm:p-10 space-y-6 bg-white">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Các nhóm tính cách tương đồng
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Những linh thú có tần số sóng tâm hồn gần nhất với bạn trong 27 archetype.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {matches.slice(0, 5).map((match, idx) => {
          const imageUrl = getCharacterImageUrl(match.code);
          return (
            <Link
              key={idx}
              href={`/personality/${match.code}`}
              className="group p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-400 hover:shadow-xs transition duration-200 flex items-center gap-4"
            >
              <div className="relative w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center p-1">
                <Image
                  src={imageUrl}
                  alt={match.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1 group-hover:scale-105 transition duration-200"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center gap-1">
                  <span className="font-bold text-stone-900 text-sm truncate group-hover:text-stone-700">
                    {match.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-stone-500 block mt-0.5">
                  Tương thích: {match.similarityScore}%
                </span>
                {match.description && (
                  <p className="text-stone-500 text-xs truncate mt-1">
                    {match.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
