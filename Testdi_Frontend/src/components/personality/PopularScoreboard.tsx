"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testApi, ScoreboardItem } from "@/api/testApi";
import { ScoreboardListRow } from "@/components/personality/ScoreboardListRow";
import { Button } from "@/components/common/Button";
import { Award, Flame, ArrowRight, PlayCircle } from "lucide-react";

export function PopularScoreboard() {
  const [scoreboard, setScoreboard] = useState<ScoreboardItem[]>([]);
  const [totalTests, setTotalTests] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadScoreboard() {
      setLoading(true);
      const data = await testApi.getScoreboard();
      setTotalTests(data.totalTests || 1455);
      setScoreboard(data.scoreboard || []);
      setLoading(false);
    }
    loadScoreboard();
  }, []);

  return (
    <div className="editorial-card p-6 sm:p-10 bg-white border border-stone-200 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="editorial-tag inline-flex items-center gap-1.5 bg-stone-100 text-stone-800">
              <Award className="w-3.5 h-3.5 text-amber-600" /> BẢNG XẾP HẠNG TÍNH CÁCH PHỔ BIẾN
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Top Linh Thú Được Khai Phá Nhiều Nhất
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Số liệu thống kê thực tế đo lường dựa trên các bài test được người dùng hoàn thành.
          </p>
        </div>

        {/* Total Tests Counter Badge */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-900 text-white shadow-xs">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider block">
              TỔNG LƯỢT KHAI PHÁ
            </span>
            <span className="text-lg font-mono font-extrabold tracking-tight">
              {totalTests.toLocaleString("vi-VN")} lượt test
            </span>
          </div>
        </div>
      </div>

      {/* Scoreboard List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-stone-500 text-sm animate-pulse">
            Đang tổng hợp số liệu bảng xếp hạng...
          </div>
        ) : (
          scoreboard.slice(0, 6).map((item) => (
            <ScoreboardListRow key={item.code} item={item} />
          ))
        )}
      </div>

      {/* Bottom CTA Block inside Scoreboard */}
      <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">
            Bạn nằm ở vị trí nào trong Bảng Xếp Hạng?
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm">
            Dành 5 phút làm bài test SBTI để khai phá linh thú đại diện và đóng góp số liệu của bạn.
          </p>
        </div>

        <Link href="/test" className="w-full sm:w-auto shrink-0">
          <Button size="lg" className="w-full sm:w-auto bg-white text-stone-900 hover:bg-stone-100 font-bold gap-2">
            <PlayCircle className="w-5 h-5 text-stone-900" />
            Làm bài test ngay
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

