import Image from "next/image";
import Link from "next/link";
import { getCharacterImageUrl } from "@/api/personalityApi";
import { getWittyProfile } from "@/lib/personalityDescriptions";

interface PersonalityItem {
  code: string;
}

const ARCHETYPE_LIST: PersonalityItem[] = [
  { code: "BOSS" },
  { code: "CTRL" },
  { code: "SEXY" },
  { code: "DRUNK" },
  { code: "SOLO" },
  { code: "MONK" },
  { code: "DIOR" },
  { code: "JOKER" },
  { code: "DEAD" },
  { code: "ZZZZ" },
  { code: "ATMR" },
  { code: "THANK" },
  { code: "OHNO" },
  { code: "GOGO" },
  { code: "LOVR" },
  { code: "MUMM" },
  { code: "FAKE" },
  { code: "OJBK" },
  { code: "MALO" },
  { code: "WOCI" },
  { code: "THINK" },
  { code: "SHIT" },
  { code: "POOR" },
  { code: "IMSB" },
  { code: "FUCK" },
  { code: "IMFW" },
  { code: "HHHH" },
];

interface PersonalityGalleryProps {
  limit?: number;
  title?: string;
  subtitle?: string;
}

export function PersonalityGallery({
  limit,
  title = "Khám phá 27 loại hình tính cách",
  subtitle = "Mỗi linh thú đại diện cho một cấu trúc vector 15 chiều không gian tâm hồn độc bản.",
}: PersonalityGalleryProps) {
  const items = limit ? ARCHETYPE_LIST.slice(0, limit) : ARCHETYPE_LIST;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          {title}
        </h2>
        {subtitle && <p className="text-stone-600 text-sm">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => {
          const profile = getWittyProfile(item.code);
          const imageUrl = getCharacterImageUrl(item.code);

          return (
            <Link
              key={item.code}
              href={`/personality/${item.code}`}
              className="editorial-card p-4 text-center group flex flex-col items-center justify-between hover:-translate-y-1 transition duration-200 bg-white"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-stone-100 border border-stone-200/60 p-2 mb-3 overflow-hidden flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain p-1 group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="space-y-1 w-full">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 inline-block">
                  {item.code}
                </span>
                <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-stone-700">
                  {profile.name.split(" — ")[1] || profile.name}
                </h3>
                <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                  {profile.tagline}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
