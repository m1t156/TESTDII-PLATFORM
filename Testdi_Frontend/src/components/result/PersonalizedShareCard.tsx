"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { SBTIResult } from "@/api/testApi";
import { getWittyProfile } from "@/lib/personalityDescriptions";
import { getCharacterImageUrl } from "@/api/personalityApi";
import { Button } from "@/components/common/Button";
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Zap,
  Shield,
  Palette,
  X,
  Info,
  ExternalLink,
} from "lucide-react";

interface PersonalizedShareCardProps {
  result: SBTIResult;
}

// 5 Aesthetic Theme Palettes for Social Share Card
export interface CardThemeConfig {
  id: string;
  name: string;
  dotBg: string;
  containerBg: string;
  bgGradient: string;
  borderClass: string;
  brandText: string;
  codeBadge: string;
  titleColor: string;
  taglineColor: string;
  boxBg: string;
  boxBorder: string;
  barBg: string;
  barFill: string;
  barText: string;
  zapIconColor: string;
  superpowerText: string;
  traitBadge: string;
  footerText: string;
  footerTagBg: string;
}

export const CARD_THEMES: CardThemeConfig[] = [
  {
    id: "obsidian",
    name: "Obsidian Gold",
    dotBg: "bg-gradient-to-r from-stone-900 to-amber-500",
    containerBg: "bg-stone-950 text-stone-100",
    bgGradient:
      "radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.18), transparent 70%), radial-gradient(circle at 100% 100%, rgba(120, 53, 15, 0.25), transparent 50%)",
    borderClass: "border-amber-500/30",
    brandText: "text-amber-400",
    codeBadge: "bg-stone-900 text-amber-300 border-amber-500/30",
    titleColor: "text-white",
    taglineColor: "text-amber-300/90",
    boxBg: "bg-stone-900/90",
    boxBorder: "border-stone-800",
    barBg: "bg-stone-800",
    barFill: "bg-gradient-to-r from-amber-500 to-amber-300",
    barText: "text-amber-400",
    zapIconColor: "text-amber-400",
    superpowerText: "text-stone-300",
    traitBadge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    footerText: "text-stone-400",
    footerTagBg: "bg-stone-900 text-amber-400 border-stone-800",
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    dotBg: "bg-gradient-to-r from-purple-900 to-cyan-400",
    containerBg: "bg-slate-950 text-slate-100",
    bgGradient:
      "radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.2), transparent 70%), radial-gradient(circle at 100% 100%, rgba(217, 70, 239, 0.25), transparent 50%)",
    borderClass: "border-cyan-500/30",
    brandText: "text-cyan-400",
    codeBadge: "bg-slate-900 text-cyan-300 border-cyan-500/30",
    titleColor: "text-white",
    taglineColor: "text-cyan-300/90",
    boxBg: "bg-slate-900/90",
    boxBorder: "border-slate-800",
    barBg: "bg-slate-800",
    barFill: "bg-gradient-to-r from-cyan-500 to-fuchsia-400",
    barText: "text-cyan-300",
    zapIconColor: "text-cyan-400",
    superpowerText: "text-slate-300",
    traitBadge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    footerText: "text-slate-400",
    footerTagBg: "bg-slate-900 text-cyan-400 border-slate-800",
  },
  {
    id: "minimal",
    name: "Minimal Cream",
    dotBg: "bg-gradient-to-r from-stone-200 to-stone-800",
    containerBg: "bg-stone-100 text-stone-900",
    bgGradient:
      "radial-gradient(circle at 50% 0%, rgba(214, 211, 209, 0.5), transparent 70%), radial-gradient(circle at 100% 100%, rgba(231, 229, 228, 0.6), transparent 50%)",
    borderClass: "border-stone-300 shadow-xl",
    brandText: "text-stone-900",
    codeBadge: "bg-stone-900 text-stone-100 border-stone-900",
    titleColor: "text-stone-900",
    taglineColor: "text-stone-700",
    boxBg: "bg-white",
    boxBorder: "border-stone-200",
    barBg: "bg-stone-200",
    barFill: "bg-gradient-to-r from-stone-900 to-stone-700",
    barText: "text-stone-900",
    zapIconColor: "text-stone-900",
    superpowerText: "text-stone-700",
    traitBadge: "bg-stone-200 text-stone-900 border-stone-300 font-semibold",
    footerText: "text-stone-600",
    footerTagBg: "bg-stone-900 text-white border-stone-900",
  },
  {
    id: "crimson",
    name: "Crimson Fire",
    dotBg: "bg-gradient-to-r from-red-950 to-orange-500",
    containerBg: "bg-neutral-950 text-rose-100",
    bgGradient:
      "radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.22), transparent 70%), radial-gradient(circle at 100% 100%, rgba(249, 115, 22, 0.2), transparent 50%)",
    borderClass: "border-rose-500/30",
    brandText: "text-rose-400",
    codeBadge: "bg-neutral-900 text-rose-300 border-rose-500/30",
    titleColor: "text-white",
    taglineColor: "text-rose-300/90",
    boxBg: "bg-neutral-900/90",
    boxBorder: "border-neutral-800",
    barBg: "bg-neutral-800",
    barFill: "bg-gradient-to-r from-rose-500 to-orange-400",
    barText: "text-rose-400",
    zapIconColor: "text-rose-400",
    superpowerText: "text-neutral-300",
    traitBadge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    footerText: "text-neutral-400",
    footerTagBg: "bg-neutral-900 text-rose-400 border-neutral-800",
  },
  {
    id: "emerald",
    name: "Emerald Mint",
    dotBg: "bg-gradient-to-r from-emerald-950 to-teal-400",
    containerBg: "bg-zinc-950 text-emerald-100",
    bgGradient:
      "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.22), transparent 70%), radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.25), transparent 50%)",
    borderClass: "border-emerald-500/30",
    brandText: "text-emerald-400",
    codeBadge: "bg-zinc-900 text-emerald-300 border-emerald-500/30",
    titleColor: "text-white",
    taglineColor: "text-emerald-300/90",
    boxBg: "bg-zinc-900/90",
    boxBorder: "border-zinc-800",
    barBg: "bg-zinc-800",
    barFill: "bg-gradient-to-r from-emerald-500 to-teal-300",
    barText: "text-emerald-400",
    zapIconColor: "text-emerald-400",
    superpowerText: "text-zinc-300",
    traitBadge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    footerText: "text-zinc-400",
    footerTagBg: "bg-zinc-900 text-emerald-400 border-zinc-800",
  },
];

export function PersonalizedShareCard({ result }: PersonalizedShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string>("obsidian");
  const [base64Image, setBase64Image] = useState<string>("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string>("");

  const code = result?.mainType?.code || "BOSS";

  // Cleanup Blob URL when modal closes or unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewBlobUrl && previewBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  // Memoize profile & image URL for performance
  const wittyProfile = useMemo(() => getWittyProfile(code), [code]);
  const imageUrl = useMemo(() => getCharacterImageUrl(code), [code]);

  // Pre-load character image as Base64 to guarantee 100% canvas export rendering on all devices
  useEffect(() => {
    let isMounted = true;
    async function preloadBase64() {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted && typeof reader.result === "string") {
            setBase64Image(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        if (isMounted) setBase64Image(imageUrl);
      }
    }
    if (imageUrl) {
      preloadBase64();
    }
    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  const activeTheme =
    CARD_THEMES.find((t) => t.id === activeThemeId) || CARD_THEMES[0];

  // Memoize 5 dimension percentages
  const dimensionScores = useMemo(() => {
    const actualGroups =
      (result?.dimensionAnalysis as any)?.groups || result?.dimensionAnalysis || {};

    const dimensionList = [
      { name: "Bản Thân", key: "Bản Thân", defaultName: "BẢN THÂN" },
      { name: "Cảm Xúc", key: "Cảm Xúc", defaultName: "CẢM XÚC" },
      { name: "Thái Độ", key: "Thái Độ", defaultName: "THÁI ĐỘ" },
      { name: "Hành Động", key: "Hành Động", defaultName: "HÀNH ĐỘNG" },
      { name: "Xã Hội", key: "Xã Hội", defaultName: "XÃ HỘI" },
    ];

    return dimensionList.map((dim) => {
      const groupData: any =
        actualGroups[dim.key] ||
        actualGroups[dim.defaultName] ||
        actualGroups[dim.key.toLowerCase()] ||
        null;

      let percentage = 50;
      if (groupData) {
        if (groupData.score !== undefined) {
          percentage = Math.round(groupData.score);
        } else if (groupData.percentage !== undefined) {
          percentage = Math.round(groupData.percentage);
        } else if (groupData.raw && Array.isArray(groupData.raw) && groupData.raw.length > 0) {
          const avg =
            groupData.raw.reduce((a: number, b: number) => a + b, 0) / groupData.raw.length;
          percentage = Math.round((avg - 1) * 50);
        }
      }
      return { name: dim.name, percentage: Math.min(100, Math.max(0, percentage)) };
    });
  }, [result]);

  // Optimized function to generate PNG blob safely without hanging Android UI thread
  const generateCardPng = async (): Promise<{ dataUrl: string; blob: Blob; file: File; blobUrl: string }> => {
    if (!cardRef.current) throw new Error("Card element not ready");
    const { toBlob, toPng } = await import("html-to-image");

    const isMobile =
      typeof window !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // On mobile devices, lower pixelRatio (1.5) avoids heavy main-thread freezes & RAM overload
    const targetPixelRatio = isMobile ? 1.5 : 2.0;

    let blob: Blob | null = null;
    try {
      blob = await toBlob(cardRef.current, {
        quality: 0.95,
        cacheBust: true,
        pixelRatio: targetPixelRatio,
      });
    } catch {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        cacheBust: true,
        pixelRatio: targetPixelRatio,
      });
      const res = await fetch(dataUrl);
      blob = await res.blob();
    }

    if (!blob) throw new Error("Failed to generate image blob");

    const blobUrl = URL.createObjectURL(blob);
    const file = new File([blob], `TESTDII_${code}_${activeTheme.id}.png`, { type: "image/png" });

    return { dataUrl: blobUrl, blob, file, blobUrl };
  };

  // Handle PNG Image Download (Android direct save-to-gallery support)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { file, blobUrl } = await generateCardPng();

      const isMobile =
        typeof window !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      // Clean up previous blob URL if exists
      if (previewBlobUrl && previewBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewBlobUrl);
      }

      setPreviewBlobUrl(blobUrl);
      setPreviewImageUrl(blobUrl);

      if (isMobile) {
        // On Mobile (Android / iOS): Open Lightbox Modal immediately so users can long-press to save straight to Gallery
        setPreviewModalOpen(true);
      } else {
        // Desktop: Direct Blob URL download
        const link = document.createElement("a");
        link.download = `TESTDII_${code}_${activeTheme.id}.png`;
        link.href = blobUrl;
        link.click();
      }
    } catch (err) {
      console.error("Failed to generate image card:", err);
      alert("Không thể tạo ảnh, vui lòng thử lại!");
    } finally {
      setDownloading(false);
    }
  };

  // Handle Copy Link with custom message
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareText = `Mình vừa làm bài test SBTI tại TESTDII và nhận kết quả [${wittyProfile.name}]! Khám phá tính cách độc bản của bạn tại: ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Handle Native Web Share (Share to Story / Social apps)
  const handleNativeShare = async () => {
    setDownloading(true);
    try {
      if (cardRef.current) {
        const { file, blobUrl } = await generateCardPng();

        if (
          typeof navigator !== "undefined" &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: `TESTDII — ${wittyProfile.name}`,
              text: `Tôi vừa làm bài test tính cách SBTI và thuộc nhóm ${wittyProfile.name}! Thử ngay tại:`,
              url: window.location.href,
            });
            return;
          } catch {
            // User cancelled or share blocked, fallback to preview lightbox modal
          }
        }

        // Fallback: Open preview modal for in-app browsers like Zalo / Facebook WebView
        if (previewBlobUrl && previewBlobUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewBlobUrl);
        }
        setPreviewBlobUrl(blobUrl);
        setPreviewImageUrl(blobUrl);
        setPreviewModalOpen(true);
      } else {
        handleCopyLink();
      }
    } catch (e) {
      handleCopyLink();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="editorial-card p-4 sm:p-10 bg-white transition-colors duration-200 space-y-6">
      {/* Component Title & Subtitle */}
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-stone-900" />
          Tấm Card Tính Cách Cá Nhân Hóa (Social Share)
        </h3>
        <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
          Chọn theme màu bạn yêu thích, tải ảnh chất lượng cao hoặc chia sẻ ngay lên Instagram Story, Facebook, Zalo!
        </p>
      </div>

      {/* Theme Color Selector Bar */}
      <div className="flex flex-col items-center space-y-2 pt-1 max-w-full">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-stone-600" /> Chọn Theme Màu Card:
        </span>
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto max-w-full py-1.5 px-2 rounded-2xl bg-stone-100 border border-stone-200/80 no-scrollbar">
          {CARD_THEMES.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveThemeId(theme.id)}
                title={theme.name}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs font-medium shrink-0 ${
                  isSelected
                    ? "bg-white text-stone-900 shadow-sm border border-stone-300 font-bold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${theme.dotBg} border border-black/10 shrink-0`} />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Social Card Frame Container */}
      <div className="flex justify-center py-2 overflow-hidden">
        <div
          ref={cardRef}
          className={`w-full max-w-sm sm:max-w-md ${activeTheme.containerBg} rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300 border ${activeTheme.borderClass} relative overflow-hidden`}
          style={{ backgroundImage: activeTheme.bgGradient }}
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between border-b border-black/10 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-white font-black text-xs flex items-center justify-center tracking-tighter shrink-0">
                T2
              </div>
              <div>
                <span className={`font-black tracking-wider text-xs ${activeTheme.brandText} uppercase block`}>
                  TESTDII
                </span>
                <span className="text-[9px] font-mono text-stone-400 tracking-widest uppercase block">
                  SBTI PERSONALITY PROFILE
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap shrink-0 ${activeTheme.codeBadge}`}>
              #{code}
            </span>
          </div>

          {/* Character Main Visual Frame */}
          <div className="space-y-4 text-center relative z-10">
            <div className="mx-auto relative w-36 sm:w-44 h-36 sm:h-44 rounded-2xl overflow-hidden bg-black/10 border border-black/10 p-3 shadow-lg flex items-center justify-center">
              {base64Image ? (
                /* Standard img tag using Base64 URI ensures html-to-image captures character artwork 100% reliably without CORS or Next.js Image loader issues */
                <img
                  src={base64Image}
                  alt={wittyProfile.name}
                  className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                  crossOrigin="anonymous"
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={wittyProfile.name}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-contain p-2 hover:scale-105 transition-transform"
                  priority
                />
              )}
            </div>

            <div className="space-y-1">
              <h2 className={`text-xl sm:text-2xl font-black ${activeTheme.titleColor} tracking-tight leading-snug`}>
                {wittyProfile.name}
              </h2>
              <p className={`text-xs sm:text-sm font-medium italic ${activeTheme.taglineColor}`}>
                “{wittyProfile.tagline}”
              </p>
            </div>
          </div>

          {/* 5 Dimension Mini Bars */}
          <div className={`space-y-2 ${activeTheme.boxBg} p-3.5 sm:p-4 rounded-2xl border ${activeTheme.boxBorder} relative z-10`}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 block mb-2 text-center">
              5 CHỈ SỐ KHÍA CẠNH TÍNH CÁCH
            </span>
            <div className="space-y-2">
              {dimensionScores.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-16 font-semibold opacity-80 shrink-0 text-[11px]">
                    {item.name}
                  </span>
                  <div className={`flex-1 ${activeTheme.barBg} h-2 rounded-full overflow-hidden`}>
                    <div
                      className={`${activeTheme.barFill} h-full rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className={`w-8 font-mono font-bold ${activeTheme.barText} text-right text-[11px]`}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Superpower & Traits */}
          <div className="space-y-3 relative z-10 text-xs">
            <div className={`flex items-start gap-2 ${activeTheme.boxBg} p-3 rounded-xl border ${activeTheme.boxBorder}`}>
              <Zap className={`w-4 h-4 ${activeTheme.zapIconColor} shrink-0 mt-0.5`} />
              <p className={`${activeTheme.superpowerText} leading-snug`}>
                <span className="font-bold">Siêu năng lực:</span> {wittyProfile.superpower}
              </p>
            </div>

            {/* Traits Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {wittyProfile.traits.map((t, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap inline-block leading-none shrink-0 ${activeTheme.traitBadge}`}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Promo CTA Slogan */}
          <div className={`border-t border-black/10 pt-3 flex items-center justify-between gap-2 ${activeTheme.footerText} relative z-10`}>
            <div className="flex items-center gap-1.5 text-[10px] font-medium whitespace-nowrap">
              <Shield className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span className="font-semibold">TESTDII — Khám phá bản ngã</span>
            </div>
            <div className={`text-[10px] font-mono font-bold flex items-center gap-1 px-2.5 py-1 rounded border whitespace-nowrap ${activeTheme.footerTagBg}`}>
              <span>TESTDII</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          onClick={handleDownloadImage}
          disabled={downloading}
          className="w-full sm:w-auto min-h-[48px] justify-center gap-2 shadow-md bg-stone-900 hover:bg-stone-800 text-white font-bold"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Đang tạo ảnh HD..." : "Tải Ảnh Card HD (PNG)"}
        </Button>

        <Button
          variant="secondary"
          onClick={handleNativeShare}
          disabled={downloading}
          className="w-full sm:w-auto min-h-[48px] justify-center gap-2 text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200"
        >
          <Share2 className="w-4 h-4 text-stone-700" />
          Chia sẻ lên Story
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="w-full sm:w-auto min-h-[48px] justify-center gap-2 text-stone-700 border-stone-300"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
          {copied ? "Đã sao chép link!" : "Sao chép lời mời"}
        </Button>
      </div>

      {/* Mobile Image Preview Lightbox Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 text-white border border-stone-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Ảnh Card HD (Bộ sưu tập)</h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detailed Guide Banner for Android & iPhone */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Cách lưu trực tiếp vào Bộ sưu tập (Gallery):</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-stone-300 text-[11px]">
                <li>
                  <strong className="text-amber-300">Cách 1 (Nhanh nhất):</strong> Chạm và <strong className="text-white">nhấn giữ 1-2 giây</strong> vào bức ảnh phía dưới ➔ chọn <strong className="text-white">"Lưu hình ảnh"</strong> (Save Image).
                </li>
                <li>
                  <strong className="text-amber-300">Cách 2:</strong> Bấm nút <strong className="text-white">"Mở ảnh ở trang riêng"</strong> phía dưới ➔ Nhấn giữ hoặc bấm menu trình duyệt để lưu thẳng vào Gallery.
                </li>
              </ul>
            </div>

            {/* High-Res Image Preview with long-press support */}
            <div className="flex flex-col items-center justify-center p-2 bg-black/50 rounded-2xl border border-stone-800 relative group">
              <img
                src={previewImageUrl}
                alt={`TESTDII ${code} Card`}
                className="w-full max-w-[320px] rounded-xl object-contain shadow-2xl transition-transform active:scale-[0.99]"
              />
              <span className="text-[10px] font-medium text-stone-400 mt-2 flex items-center gap-1">
                👇 Chạm & nhấn giữ 1s vào ảnh trên để lưu
              </span>
            </div>

            {/* Actions inside Modal */}
            <div className="flex flex-col gap-2 pt-1">
              <a
                href={previewImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Mở ảnh ở trang riêng (để nhấn giữ lưu)
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={previewImageUrl}
                  download={`TESTDII_${code}_${activeTheme.id}.png`}
                  className="flex-1 text-center py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition border border-stone-700/80 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải về Tệp
                </a>

                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition border border-stone-700/80"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
