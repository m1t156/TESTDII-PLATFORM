"use client";

import { useState } from "react";
import { DIMENSION_GROUPS_DATA, DimensionGroup } from "@/lib/dimensionData";
import { DimensionGroupCard } from "@/components/personality/DimensionGroupCard";

export function DimensionExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null); // Default all cards collapsed

  const toggleGroup = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          5 nhóm chiều không gian phân tích
        </h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          Nhấp vào từng nhóm bên dưới để khám phá chi tiết 15 chỉ số nhỏ (S1-S3, E1-E3...) và các mẫu hình tính cách liên quan.
        </p>
      </div>

      <div className="space-y-3 max-w-4xl mx-auto">
        {DIMENSION_GROUPS_DATA.map((group: DimensionGroup) => (
          <DimensionGroupCard
            key={group.id}
            group={group}
            isExpanded={activeId === group.id}
            onToggle={() => toggleGroup(group.id)}
          />
        ))}
      </div>
    </div>
  );
}

