import { DimensionGroupResult } from "@/api/testApi";

interface DimensionBreakdownProps {
  groups: Record<string, DimensionGroupResult>;
}

export function DimensionBreakdown({ groups }: DimensionBreakdownProps) {
  const dimensionList = [
    { key: "Bản Thân", defaultName: "BẢN THÂN", desc: "Tự nhận thức, sự rõ ràng cá nhân & định hướng mục tiêu" },
    { key: "Cảm Xúc", defaultName: "CẢM XÚC", desc: "Cách xử lý cảm xúc, mức độ độc lập & kết nối tinh thần" },
    { key: "Thái Độ", defaultName: "THÁI ĐỘ", desc: "Góc nhìn cuộc sống, sự linh hoạt & tìm kiếm ý nghĩa" },
    { key: "Hành Động", defaultName: "HÀNH ĐỘNG", desc: "Động lực thực hiện, cách ra quyết định & tính kiên trì" },
    { key: "Xã Hội", defaultName: "XÃ HỘI", desc: "Mức độ chủ động giao tiếp, thiết lập ranh giới & tính chân thật" },
  ];

  // Helper to extract nested groups if dimensionAnalysis is wrapped
  const actualGroups = (groups as any)?.groups || groups || {};

  return (
    <div className="editorial-card p-6 sm:p-10 space-y-6 bg-white">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Phân tích 5 chiều không gian tính cách
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Chỉ số thể hiện mức độ nổi trội của từng khía cạnh trong tâm hồn bạn.
        </p>
      </div>

      <div className="space-y-6 pt-2">
        {dimensionList.map((dim) => {
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
              const avg = groupData.raw.reduce((a: number, b: number) => a + b, 0) / groupData.raw.length;
              percentage = Math.round((avg - 1) * 50);
            } else if (groupData.averageScore !== undefined) {
              percentage = Math.round((groupData.averageScore - 1) * 50);
            }
          }

          // Ensure percentage stays within 0 to 100
          percentage = Math.min(100, Math.max(0, percentage));

          return (
            <div key={dim.key} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {dim.defaultName}
                  </span>
                  <span className="text-stone-500 text-xs block sm:inline sm:ml-2">
                    {dim.desc}
                  </span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm sm:text-base shrink-0 ml-2">
                  {percentage}%
                </span>
              </div>

              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-stone-900 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
