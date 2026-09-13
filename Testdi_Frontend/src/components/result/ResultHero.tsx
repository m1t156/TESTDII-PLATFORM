import Image from "next/image";
import { SBTIResult } from "@/api/testApi";
import { getCharacterImageUrl } from "@/api/personalityApi";

interface ResultHeroProps {
  result: SBTIResult;
}

export function ResultHero({ result }: ResultHeroProps) {
  const { mainType, dnaTattoo, confidence, character } = result;
  
  const imageUrl = getCharacterImageUrl(
    mainType.code,
    character?.unlockedImage || character?.baseImage
  );

  return (
    <div className="editorial-card p-6 sm:p-10 bg-white transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left Column: Character Artwork */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 sm:w-80 h-64 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm p-4 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={mainType.name}
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-contain p-2 hover:scale-[1.02] transition-transform duration-300"
              priority
            />
          </div>
        </div>

        {/* Right Column: Personality Overview */}
        <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="editorial-tag">KẾT QUẢ CỦA BẠN</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-900 text-white">
                {mainType.code}
              </span>
              {confidence && (
                <span className="text-xs font-medium text-stone-500">
                  • Độ tin cậy: {confidence}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
              {mainType.name}
            </h1>
            <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
              Độ tương thích: {mainType.similarityScore}%
            </p>
          </div>

          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            {mainType.description}
          </p>

          {/* DNA Tattoo */}
          {dnaTattoo && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                DNA TATTOO VECTƠ
              </span>
              <p className="text-xs sm:text-sm font-mono tracking-widest text-stone-800 font-semibold break-all">
                {dnaTattoo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
