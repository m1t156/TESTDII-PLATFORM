import Image from "next/image";
import Link from "next/link";
import { CharacterItem, getCharacterImageUrl } from "@/api/personalityApi";
import { getWittyProfile } from "@/lib/personalityDescriptions";
import { Button } from "@/components/common/Button";
import { ArrowLeft, PlayCircle, Zap, AlertTriangle, Quote, Lightbulb, Sparkles } from "lucide-react";

interface PersonalityDetailProps {
  character: CharacterItem;
  code: string;
}

export function PersonalityDetail({ character, code }: PersonalityDetailProps) {
  const wittyProfile = getWittyProfile(code || character?.personalityType);
  const imageUrl = getCharacterImageUrl(
    code,
    character.unlockedImage || character.baseImage
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Back Navigation */}
      <div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-stone-600">
            <ArrowLeft className="w-4 h-4" />
            Trở về trang chủ
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="editorial-card p-6 sm:p-10 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: Artwork */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 sm:w-80 h-64 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 p-4 flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={wittyProfile.name}
                fill
                sizes="(max-width: 640px) 256px, 320px"
                className="object-contain p-2 hover:scale-[1.02] transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Right: Intro */}
          <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-stone-900 text-white">
                  ARCHETYPE: {code}
                </span>
                <span className="editorial-tag">27 PERSONALITIES</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight pt-1">
                {wittyProfile.name}
              </h1>
              <p className="text-sm font-semibold text-stone-600 italic">
                “{wittyProfile.tagline}”
              </p>
            </div>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed pt-2">
              {wittyProfile.bio || character.description}
            </p>

            {/* Traits Tags */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Đặc tính nổi bật
              </span>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {wittyProfile.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
                  >
                    #{trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link href="/test/sbti">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Làm bài test để xem độ tương thích
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Humorous Personality Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Superpower Card */}
        <div className="editorial-card p-6 bg-white space-y-3 border-amber-200/80">
          <div className="flex items-center gap-2.5 text-amber-800">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Siêu năng lực bá đạo</h3>
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            {wittyProfile.superpower}
          </p>
        </div>

        {/* Kryptonite Card */}
        <div className="editorial-card p-6 bg-white space-y-3 border-stone-300">
          <div className="flex items-center gap-2.5 text-stone-800">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-stone-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Huyệt điểm dễ "tạ"</h3>
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            {wittyProfile.kryptonite}
          </p>
        </div>

        {/* Famous Quote Card */}
        <div className="editorial-card p-6 bg-white space-y-3">
          <div className="flex items-center gap-2.5 text-stone-800">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <Quote className="w-4 h-4 text-stone-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Câu nói cửa miệng</h3>
          </div>
          <p className="text-stone-800 font-medium text-sm italic leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            {wittyProfile.quote}
          </p>
        </div>

        {/* Cosmic Advice Card */}
        <div className="editorial-card p-6 bg-white space-y-3">
          <div className="flex items-center gap-2.5 text-stone-800">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-stone-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Lời khuyên vũ trụ</h3>
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            {wittyProfile.advice}
          </p>
        </div>
      </div>

      {/* Real life Example Scenario Card (Full Width) */}
      {wittyProfile.exampleScenario && (
        <div className="editorial-card p-6 sm:p-8 bg-gradient-to-br from-amber-50/60 to-orange-50/40 border-amber-200 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900">
            <div className="w-8 h-8 rounded-lg bg-amber-200/80 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-800" />
            </div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">Ví dụ tình huống thực tế siêu "nhạy"</h3>
          </div>
          <p className="text-stone-800 text-sm sm:text-base leading-relaxed bg-white/80 p-4 rounded-xl border border-amber-200/80">
            {wittyProfile.exampleScenario}
          </p>
        </div>
      )}
    </div>
  );
}
