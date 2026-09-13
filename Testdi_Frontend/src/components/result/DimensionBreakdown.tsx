"use client";

import { useState } from "react";
import { DimensionGroupResult } from "@/api/testApi";
import { DIMENSION_GROUPS_DATA } from "@/lib/dimensionData";
import {
  User,
  Heart,
  Compass,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Flame,
  Scale,
  Leaf,
  Lightbulb,
  PlayCircle,
} from "lucide-react";

interface DimensionBreakdownProps {
  groups: Record<string, DimensionGroupResult>;
}

const ICON_MAP: Record<string, any> = {
  "Bản Thân": User,
  "Cảm Xúc": Heart,
  "Thái Độ": Compass,
  "Hành Động": Zap,
  "Xã Hội": Users,
};

// Personalized insights lookup table by dimension and level
const PERSONALIZED_INSIGHTS: Record<
  string,
  {
    HIGH: { text: string; tag: string; advice: string };
    MEDIUM: { text: string; tag: string; advice: string };
    LOW: { text: string; tag: string; advice: string };
  }
> = {
  "Bản Thân": {
    HIGH: {
      tag: "Cái tôi kiên định & Tự tin cao",
      text: "Bạn sở hữu một cái tôi vô cùng kiên định và thế giới nội tâm tự chủ. Bạn biết rất rõ mình là ai, muốn gì và không bao giờ để áp lực đồng lứa (peer pressure) hay sự so sánh bên ngoài làm xáo trộn giá trị cốt lõi của bản thân.",
      advice: "Hãy tiếp tục giữ vững bản lĩnh này, đồng thời lắng nghe thêm ý kiến từ những người yêu thương để hoàn thiện hơn!",
    },
    MEDIUM: {
      tag: "Cân bằng & Tự nhận thức tốt",
      text: "Bạn giữ được sự cân bằng tuyệt vời giữa việc tự tin vào giá trị cá nhân và tinh thần cởi mở lắng nghe góc nhìn mới từ mọi người. Bạn khá thấu hiểu cảm xúc của chính mình.",
      advice: "Dành thêm chút thời gian ghi chép nhật ký cảm xúc để làm sâu sắc hơn nữa sự tự tin nội tại nhé!",
    },
    LOW: {
      tag: "Khiêm tốn & Cần thêm niềm tin",
      text: "Bạn là người khiêm tốn nhưng đôi khi hay hoài nghi năng lực bản thân và rơi vào trạng thái overthinking khi gặp áp lực. Bạn có xu hướng đánh giá thấp những ưu điểm độc đáo của chính mình.",
      advice: "Hãy nhớ rằng bạn sở hữu những nét giá trị độc bản, tập trung vào thế mạnh riêng thay vì so sánh với người khác!",
    },
  },
  "Cảm Xúc": {
    HIGH: {
      tag: "Thấu cảm sâu sắc & Nồng ấm",
      text: "Tâm hồn bạn tràn ngập sự thấu cảm sâu sắc và tình cảm nồng ấm. Bạn dễ dàng cảm nhận được nỗi đau hay niềm vui của người khác và biết cách chia sẻ năng lượng chữa lành vô cùng tinh tế.",
      advice: "Tình cảm của bạn là món quà quý giá, nhưng nhớ đặt ranh giới để tránh bị kiệt sức bởi năng lượng tiêu cực của người khác!",
    },
    MEDIUM: {
      tag: "Tài hoa cảm xúc & Hài hòa",
      text: "Bạn xử lý cảm xúc một cách hài hòa và tỉnh táo. Bạn biết cách cởi mở đúng lúc nhưng vẫn giữ được sự riêng tư và không gian an toàn cho tâm trí cá nhân.",
      advice: "Tiếp tục duy trì sự cân bằng này trong các mối quan hệ tình cảm lẫn bạn bè!",
    },
    LOW: {
      tag: "Lý trí vững vàng & Độc lập tâm trí",
      text: "Bạn là kiểu người cực kỳ lý trí, kiểm soát cảm xúc tốt và ít khi để tình cảm làm ảnh hưởng tới các quyết định quan trọng. Bạn giữ khoảng cách an toàn và tự chủ tâm trạng.",
      advice: "Thỉnh thoảng hãy dũng cảm thả lỏng vỏ bọc để chia sẻ những tâm sự thầm kín với những người thân thiết nhé!",
    },
  },
  "Thái Độ": {
    HIGH: {
      tag: "Thế giới quan rộng mở & Cầu tiến",
      text: "Thế giới quan của bạn cực kỳ rộng mở và cầu tiến. Bạn sẵn sàng đón nhận những lời nhận xét thẳng thắn, coi khó khăn là bài học phát triển và luôn khao khát đầu tư cho tương lai dài hạn.",
      advice: "Tinh thần cầu tiến này sẽ đưa bạn đi rất xa, hãy kiên trì với những mục tiêu dài hạn đã đề ra!",
    },
    MEDIUM: {
      tag: "Thực tế & Linh hoạt ứng biến",
      text: "Bạn có thái độ sống thực tế và linh hoạt. Bạn biết cách chấp nhận thực tại đồng thời giữ tinh thần học hỏi vừa sức để cải thiện bản thân mỗi ngày.",
      advice: "Thử thách bản thân với một vài mục tiêu táo bạo hơn để bứt phá giới hạn nhé!",
    },
    LOW: {
      tag: "Trân trọng hiện tại & Thận trọng",
      text: "Bạn thích sự an toàn, quen thuộc và trân trọng những gì đang có ở hiện tại hơn là mạo hiểm với những kế hoạch xa xôi. Bạn có xu hướng bảo vệ vùng an toàn của mình.",
      advice: "Thỉnh thoảng bước ra khỏi vùng an toàn 1 xíu sẽ mang tới cho bạn những bất ngờ thú vị đấy!",
    },
  },
  "Hành Động": {
    HIGH: {
      tag: "Quyết liệt & Thực thi thần tốc",
      text: "Bạn là chiếc 'động cơ bứt phá' với tốc độ quyết định nhanh và khả năng thực thi quyết liệt. Đã nói là làm, luôn chủ động hoàn thành mọi mục tiêu đúng hoặc trước hạn định.",
      advice: "Tốc độ của bạn rất tuyệt vời, nhưng hãy nhớ dành những khoảng nghỉ để nạp lại năng lượng!",
    },
    MEDIUM: {
      tag: "Nhịp độ chắc chắn & Chu đáo",
      text: "Bạn có nhịp độ hành động điềm tĩnh và chắc chắn. Bạn cân nhắc kỹ lưỡng mọi khía cạnh trước khi bứt phá để đảm bảo hiệu quả cao nhất mà không bị vấp ngã.",
      advice: "Duy trì sự kiên trì này, bạn đang đi đúng hướng trên lộ trình của mình!",
    },
    LOW: {
      tag: "Thư thái & Bùng nổ phút 89",
      text: "Bạn là thánh tận hưởng sự thư thái hoặc chuyên gia bùng nổ 23h59. Bạn chỉ thực sự phát huy hết 100% công lực khi có áp lực thời gian hoặc cảm hứng sáng tạo thúc ép.",
      advice: "Chia nhỏ công việc thành từng phần nhỏ để tránh bị quá tải vào phút chót nhé!",
    },
  },
  "Xã Hội": {
    HIGH: {
      tag: "Kết nối rực rỡ & Ranh giới rõ ràng",
      text: "Bạn là ngôi sao hướng ngoại với khả năng làm quen kết nối rực rỡ. Đồng thời, bạn vô cùng dũng cảm thiết lập ranh giới cá nhân và sống thật với bản sắc của mình.",
      advice: "Sức hút xã hội của bạn rất lớn, hãy dùng nó để lan tỏa những năng lượng tích cực cho tập thể!",
    },
    MEDIUM: {
      tag: "Giao thiệp khéo léo & Tự nhiên",
      text: "Bạn có kỹ năng giao thiệp khéo léo và linh hoạt. Bạn vừa có thể khuấy động các cuộc vui, vừa biết cách lùi lại để tận hưởng không gian riêng tư nhẹ nhàng.",
      advice: "Sự khéo léo này giúp bạn luôn giữ được những tình bạn đẹp và bền vững!",
    },
    LOW: {
      tag: "Hướng nội sâu sắc & Chân thành",
      text: "Bạn sở hữu năng lượng hướng nội sâu sắc. Bạn thích chất lượng hơn số lượng trong các mối quan hệ, chỉ mở lòng với những người thực sự tin tưởng và trân trọng sự tĩnh lặng.",
      advice: "Trân trọng nhóm bạn thân chất lượng của bạn, họ thực sự là những tri kỷ quý giá!",
    },
  },
};

export function DimensionBreakdown({ groups }: DimensionBreakdownProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>("Bản Thân");

  const dimensionList = [
    { key: "Bản Thân", defaultName: "BẢN THÂN", groupCode: "SELF", desc: "Tự nhận thức, sự rõ ràng cá nhân & định hướng mục tiêu" },
    { key: "Cảm Xúc", defaultName: "CẢM XÚC", groupCode: "EMOTIONS", desc: "Cách xử lý cảm xúc, mức độ độc lập & kết nối tinh thần" },
    { key: "Thái Độ", defaultName: "THÁI ĐỘ", groupCode: "ATTITUDE", desc: "Góc nhìn cuộc sống, sự linh hoạt & tìm kiếm ý nghĩa" },
    { key: "Hành Động", defaultName: "HÀNH ĐỘNG", groupCode: "ACTION", desc: "Động lực thực hiện, cách ra quyết định & tính kiên trì" },
    { key: "Xã Hội", defaultName: "XÃ HỘI", groupCode: "SOCIAL", desc: "Mức độ chủ động giao tiếp, thiết lập ranh giới & tính chân thật" },
  ];

  const actualGroups = (groups as any)?.groups || groups || {};

  const toggleExpand = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="editorial-card p-6 sm:p-10 space-y-6 bg-white transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Phân tích 5 chiều không gian tính cách
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Nhấp vào từng chiều không gian để xem nhận xét cá nhân hóa & khám phá chi tiết 15 chỉ số thành phần!
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold self-start sm:self-auto">
          INTERACTIVE EXPLORER
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {dimensionList.map((dim) => {
          const groupData: any =
            actualGroups[dim.key] ||
            actualGroups[dim.defaultName] ||
            actualGroups[dim.key.toLowerCase()] ||
            null;

          let percentage = 50;
          let rawScores: number[] = [2, 2, 2];

          if (groupData) {
            if (groupData.score !== undefined) {
              percentage = Math.round(groupData.score);
            } else if (groupData.percentage !== undefined) {
              percentage = Math.round(groupData.percentage);
            } else if (groupData.raw && Array.isArray(groupData.raw) && groupData.raw.length > 0) {
              const avg = groupData.raw.reduce((a: number, b: number) => a + b, 0) / groupData.raw.length;
              percentage = Math.round((avg - 1) * 50);
            }

            if (groupData.raw && Array.isArray(groupData.raw)) {
              rawScores = groupData.raw;
            }
          }

          percentage = Math.min(100, Math.max(0, percentage));

          // Level calculation: High (>=70%), Medium (40-69%), Low (<40%)
          const levelKey: "HIGH" | "MEDIUM" | "LOW" =
            percentage >= 70 ? "HIGH" : percentage >= 40 ? "MEDIUM" : "LOW";

          const levelBadgeText =
            levelKey === "HIGH"
              ? "HIGH — NỔI TRỘI"
              : levelKey === "MEDIUM"
              ? "MEDIUM — CÂN BẰNG"
              : "LOW — THẤP";

          const LevelIcon =
            levelKey === "HIGH" ? Flame : levelKey === "MEDIUM" ? Scale : Leaf;

          const levelBadgeClass =
            levelKey === "HIGH"
              ? "bg-amber-100 text-amber-900 border-amber-300"
              : levelKey === "MEDIUM"
              ? "bg-stone-100 text-stone-800 border-stone-300"
              : "bg-blue-50 text-blue-800 border-blue-200";

          const insightData =
            PERSONALIZED_INSIGHTS[dim.key]?.[levelKey] ||
            PERSONALIZED_INSIGHTS["Bản Thân"].MEDIUM;

          const isExpanded = expandedKey === dim.key;
          const IconComp = ICON_MAP[dim.key] || User;

          // Find corresponding dimData from lib/dimensionData.ts
          const matchedGroupData = DIMENSION_GROUPS_DATA.find(
            (g) => g.id === dim.groupCode || g.title.includes(dim.key)
          );

          return (
            <div
              key={dim.key}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "border-stone-900 bg-white shadow-sm"
                  : "border-stone-200 bg-stone-50/40 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleExpand(dim.key)}
                className="w-full p-4 sm:p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded
                        ? "bg-stone-900 text-white"
                        : "bg-stone-200/80 text-stone-700"
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 text-base sm:text-lg">
                        {dim.defaultName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${levelBadgeClass}`}
                      >
                        <LevelIcon className="w-3 h-3" />
                        {levelBadgeText}
                      </span>
                    </div>
                    <p className="text-stone-500 text-xs truncate mt-0.5">
                      {insightData.tag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  {/* Percentage Bar & Number */}
                  <div className="flex items-center gap-3 w-36 sm:w-44">
                    <div className="flex-1 bg-stone-200/70 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-stone-900 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-stone-900 text-sm sm:text-base w-10 text-right">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-5 animate-fadeIn">
                  {/* Personalized Insight Box */}
                  <div className="p-4 sm:p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                      <Award className="w-4 h-4 text-amber-700" />
                      <span>Nhận xét cá nhân hóa cho bạn ({percentage}%):</span>
                    </div>
                    <p className="text-stone-800 text-xs sm:text-sm leading-relaxed">
                      {insightData.text}
                    </p>
                    <p className="text-stone-600 text-xs italic pt-1 border-t border-amber-200/60 flex items-start sm:items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 not-italic mt-0.5 sm:mt-0" />
                      <span><span className="font-semibold not-italic">Lời khuyên phát triển:</span> {insightData.advice}</span>
                    </p>
                  </div>

                  {/* Sub-dimensions Breakdown */}
                  {matchedGroupData && (
                    <div className="space-y-3 pt-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-stone-700" />
                        Chi tiết 3 chỉ số thành phần nhóm {dim.defaultName}
                      </h4>

                      <div className="grid grid-cols-1 gap-3">
                        {matchedGroupData.subDimensions.map((sub, idx) => {
                          const rawVal = rawScores[idx] !== undefined ? rawScores[idx] : 2;
                          // Convert raw score 1/2/3 to 0-100%
                          const subPct = Math.round((rawVal - 1) * 50);
                          const subLevel = rawVal >= 3 ? "HIGH" : rawVal >= 2 ? "MEDIUM" : "LOW";

                          return (
                            <div
                              key={sub.code}
                              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-900 text-sm">
                                  {sub.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-stone-700 text-xs">
                                    {sub.code}: {subPct}%
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      subLevel === "HIGH"
                                        ? "bg-amber-100 text-amber-900"
                                        : subLevel === "MEDIUM"
                                        ? "bg-stone-200 text-stone-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {subLevel}
                                  </span>
                                </div>
                              </div>

                              <p className="text-stone-600 leading-relaxed">
                                {sub.detailedDefinition}
                              </p>

                              <p className="text-stone-600 bg-white p-2 rounded border border-stone-200/60 flex items-start gap-1.5">
                                <PlayCircle className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                                <span><span className="font-semibold text-stone-800">Ví dụ:</span> {sub.exampleScenario}</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
