"use client";

import { useState } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";
import { Compass, RotateCw } from "lucide-react";

interface ResultFlipCardProps {
  mainBear: {
    name: string;
    code: string;
    image: string;
  };
  dnaTattoo: string;
}

export function ResultFlipCard({ mainBear, dnaTattoo }: ResultFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    sound.playCardFlip();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleFlip}
        className="cursor-pointer perspective-1000 group relative w-72 h-[420px] rounded-3xl transition-transform duration-300 hover:scale-105"
      >
        {/* Front Card View */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-5 bg-white/90 border border-emerald-900/15 shadow-xl flex flex-col justify-between transition-all duration-700 backface-hidden ${
            isFlipped ? "rotate-y-180 opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[linear-gradient(180deg,#f5fbf8,#ecf4f1)] p-4 flex items-center justify-center">
            <Image
              src={mainBear.image}
              alt={mainBear.name}
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="text-center mt-2">
            <h3 className="text-xl font-bold text-slate-950">{mainBear.name}</h3>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              {mainBear.code}
            </p>
          </div>

          <div className="flex justify-center text-[10px] text-slate-500 font-mono tracking-wider pt-2 border-t border-slate-100">
            CLICK TO FLIP DNA TATTOO ↺
          </div>
        </div>

        {/* Back Card View: DNA Constellation */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-6 bg-slate-950 text-white border border-emerald-500/30 shadow-xl flex flex-col justify-between transition-all duration-700 backface-hidden ${
            isFlipped ? "opacity-100" : "rotate-y-180 opacity-0 pointer-events-none"
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-4 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> DNA TATTOO
              </span>
              <span>15-DIMENSIONS</span>
            </div>

            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/40 text-center mb-4">
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">
                15-Level String
              </div>
              <div className="font-mono text-sm tracking-widest text-amber-300 font-bold">
                {dnaTattoo}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic">
              Chuỗi 15 cấp độ L/M/H phản ánh chính xác phân bổ tâm lý của bạn qua 5 nhóm mô hình tính cách.
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" /> View Collectible Card
          </button>
        </div>
      </div>
    </div>
  );
}
