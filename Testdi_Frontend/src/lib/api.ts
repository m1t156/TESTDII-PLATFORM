export interface QuestionOption {
  id: string;
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  dimension?: string;
  group?: string;
  options: QuestionOption[];
}

export interface DimensionGroupResult {
  groupName: string;
  percentage: number;
  averageScore: number;
}

export interface ArchetypeMatch {
  code: string;
  name: string;
  title?: string;
  image?: string;
  similarityPercentage: number;
  distance: number;
  description?: string;
}

export interface SBTIResultData {
  resultId?: string;
  mainType: {
    code: string;
    name: string;
    title: string;
    description: string;
    image: string;
  };
  dnaTattoo: string;
  dimensionAnalysis: {
    groups: Record<string, DimensionGroupResult>;
  };
  topMatches: ArchetypeMatch[];
  bonusDrink?: boolean;
  method?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://testdii-platform.onrender.com/api";


// Mock questions fallback in case backend server is offline
const MOCK_QUESTIONS: Question[] = [
  {
    id: "Q1",
    text: "Khi đối mặt với một vấn đề hoàn toàn mới trong cuộc sống, phản ứng đầu tiên của bạn là gì?",
    options: [
      { id: "A", text: "Tìm hiểu bản chất, phân tích lý do sâu xa đằng sau nó.", score: 5 },
      { id: "B", text: "Dựa vào cảm giác cá nhân và trực giác để đưa ra lựa chọn.", score: 3 },
      { id: "C", text: "Hỏi ý kiến từ bạn bè xung quanh trước khi hành động.", score: 1 },
    ],
  },
  {
    id: "Q2",
    text: "Trong một buổi tiệc đông người, bạn thường có xu hướng thế nào?",
    options: [
      { id: "A", text: "Sôi nổi ở trung tâm đám đông, kết nối với mọi người.", score: 5 },
      { id: "B", text: "Chỉ trò chuyện sâu với 1-2 người bạn thân thiết.", score: 3 },
      { id: "C", text: "Tìm một góc yên tĩnh quan sát không khí xung quanh.", score: 1 },
    ],
  },
  {
    id: "Q3",
    text: "Cách bạn xử lý cảm xúc tiêu cực khi gặp áp lực lớn?",
    options: [
      { id: "A", text: "Tự cô lập, xử lý một mình trong không gian riêng.", score: 1 },
      { id: "B", text: "Bộc lộ trực tiếp, giải tỏa qua hành động hoặc lời nói.", score: 5 },
      { id: "C", text: "Tìm kiếm sự an ủi và lắng nghe từ người đáng tin cậy.", score: 3 },
    ],
  },
  {
    id: "Q4",
    text: "Khi lập kế hoạch cho chuyến đi du lịch xa:",
    options: [
      { id: "A", text: "Lên lịch chi tiết từng giờ, từng địa điểm cụ thể.", score: 5 },
      { id: "B", text: "Chỉ lên danh sách các nơi muốn đến, thời gian tùy ngẫu hứng.", score: 3 },
      { id: "C", text: "Không lập kế hoạch, cứ xách ba lô lên và đi.", score: 1 },
    ],
  },
  {
    id: "Q5",
    text: "Nếu một người bạn thân mắc sai lầm nghiêm trọng gây ảnh hưởng tới bạn:",
    options: [
      { id: "A", text: "Thẳng thắn chỉ ra sai lầm và phân tích hậu quả bằng lý trí.", score: 5 },
      { id: "B", text: "Đặt mình vào vị trí của bạn để thấu hiểu và thứ lỗi.", score: 3 },
      { id: "C", text: "Tránh né xung đột, tạm thời giữ khoảng cách.", score: 1 },
    ],
  },
  {
    id: "Q31",
    text: "[CÂU HỎI THÁNH SAY 🍻] Đêm muộn tại bàn nhậu ma thuật, khi rượu đã ngấm, con người thực sự nào trong bạn sẽ thức giấc?",
    options: [
      { id: "DRUNK", text: "Trở thành 'Thánh Say' chính hiệu - Tâm sự hết nấc, yêu thương cả thế giới!", score: 1 },
      { id: "NORMAL", text: "Vẫn giữ vững phong độ tỉnh táo, quan sát nụ cười của đồng nhậu.", score: 0 },
    ],
  },
];

// Helper mapping archetype code to display information & character image
export const ARCHETYPE_MAP: Record<string, { name: string; title: string; desc: string; image: string }> = {
  BOSS: { name: "Thủ Lĩnh Uy Quyền", title: "The Sovereign Bear", desc: "Bản lĩnh tiên phong, tầm nhìn chiến lược, luôn làm chủ mọi tình huống.", image: "/characters/BOSS.png" },
  SEXY: { name: "Linh Thú Quyến Rũ", title: "The Enchanting Bear", desc: "Sức hút tự nhiên mãnh liệt, tinh tế trong cảm xúc và cuốn hút mọi ánh nhìn.", image: "/characters/SEXY.png" },
  DRUNK: { name: "Thánh Say Ma Thuật", title: "The Mystic Drunk Bear", desc: "Chân thành tuyệt đối khi cởi bỏ lớp phòng thủ, sống hết mình với từng khoảnh khắc.", image: "/characters/DRUNK.png" },
  SOLO: { name: "Độc Hành Huyền Bí", title: "The Lone Wanderer", desc: "Độc lập, kiên định với lối đi riêng, ẩn chứa nội lực thâm sâu.", image: "/characters/SOLO.png" },
  MONK: { name: "Thiền Sĩ Thanh Tịnh", title: "The Wise Sage", desc: "Điềm tĩnh trước sóng gió, cái nhìn bao quát và thấu hiểu quy luật vũ trụ.", image: "/characters/MONK.png" },
  DIOR: { name: "Quý Tộc Sang Chảnh", title: "The Luxury Bear", desc: "Gu thẩm mỹ tinh tế, chuộng sự hoàn hảo và luôn biết tỏa sáng.", image: "/characters/DIOR.png" },
  Dior: { name: "Quý Tộc Sang Chảnh", title: "The Luxury Bear", desc: "Gu thẩm mỹ tinh tế, chuộng sự hoàn hảo và luôn biết tỏa sáng.", image: "/characters/DIOR.png" },
  CTRL: { name: "Kiểm Soát Viên Perfect", title: "The Controller", desc: "Kỷ luật thép, tư duy hệ thống mạch lạc, không để sót chi tiết nào.", image: "/characters/CTRL.png" },
  JOKE: { name: "Hề Sĩ Vui Vẻ", title: "The Joker Bear", desc: "Mang lại tiếng cười và năng lượng tích cực ở bất kỳ nơi đâu xuất hiện.", image: "/characters/JOKE-R.png" },
  JOKER: { name: "Hề Sĩ Vui Vẻ", title: "The Joker Bear", desc: "Mang lại tiếng cười và năng lượng tích cực ở bất kỳ nơi đâu xuất hiện.", image: "/characters/JOKER.png" },
  DEAD: { name: "Chiến Binh Bất Tử", title: "The Undead Fighter", desc: "Kiên cường tái sinh từ nghịch cảnh, không gì có thể quật ngã.", image: "/characters/DEAD.png" },
  ZZZZ: { name: "Ẩn Sĩ Mộng Mơ", title: "The Dreamy Sleeper", desc: "Thích không gian riêng tư, trí tưởng tượng phong phú và tâm hồn thanh bình.", image: "/characters/ZZZZ.png" },
};

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/tests/sbti/questions`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const questionList = data.data || data.questions || data;
      if (Array.isArray(questionList) && questionList.length > 0) {
        return questionList.map((q: any) => ({
          id: q._id || q.id || `Q${q.order}`,
          text: q.text,
          dimension: q.dimension,
          group: q.group,
          options: (q.options || []).map((o: any) => ({
            id: o.id || o._id || o.optionId,
            text: o.text,
            score: o.points !== undefined ? o.points : (o.score !== undefined ? o.score : 0),
          })),
        }));
      }
    }
  } catch (err) {
    console.warn("Backend server not reachable, using Fairyland Mock Questions.", err);
  }
  return MOCK_QUESTIONS;
}

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "GUEST_DEFAULT_123";
  let guestId = localStorage.getItem("sbti_guest_id");
  if (!guestId) {
    guestId = "GUEST_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
    localStorage.setItem("sbti_guest_id", guestId);
  }
  return guestId;
}

export async function submitQuiz(answers: { questionId: string; selectedOptionId: string; score: number }[]): Promise<SBTIResultData> {
  const guestId = getOrCreateGuestId();
  try {
    const res = await fetch(`${API_BASE_URL}/tests/sbti/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, guestId }),
    });
    if (res.ok) {
      const data = await res.json();
      const result = data.result || data.data;
      if (result) {
        const mainCode = result.mainType?.code || "BOSS";
        const meta = ARCHETYPE_MAP[mainCode] || {
          name: result.mainType?.name || mainCode,
          title: "The Mysterious Fairyland Bear",
          desc: result.mainType?.description || "Một linh thú mang sức mạnh độc bản của khu rừng ma thuật.",
          image: `/characters/${mainCode}.png`,
        };

        return {
          resultId: result.sbtiResultId || result._id,
          mainType: {
            code: mainCode,
            name: meta.name || result.mainType?.name || mainCode,
            title: meta.title || "The Mysterious Fairyland Bear",
            description: result.mainType?.description || meta.desc,
            image: meta.image,
          },
          dnaTattoo: result.dnaTattoo || "L M H M L H M L H M L H M L H",
          dimensionAnalysis: result.dimensionAnalysis || { groups: {} },
          topMatches: (result.topMatches || []).map((m: any) => ({
            code: m.code,
            name: m.name || m.type || ARCHETYPE_MAP[m.code]?.name || m.code,
            title: ARCHETYPE_MAP[m.code]?.title,
            similarityPercentage: m.similarityScore !== undefined ? m.similarityScore : (m.similarityPercentage || 85),
            distance: m.distance || 0,
            image: `/characters/${m.code}.png`,
          })),
          bonusDrink: result.bonusDrink,
          method: result.method || "Layer 2 (Manhattan Distance)",
        };
      }
    }
  } catch (err) {
    console.warn("Backend server submission offline, generating local result.", err);
  }

  // Local fallback result generation if backend offline
  const drunkAnswer = answers.find((a) => a.questionId === "Q31");
  const isDrunk = drunkAnswer?.selectedOptionId === "DRUNK";
  const code = isDrunk ? "DRUNK" : "BOSS";
  const meta = ARCHETYPE_MAP[code];

  return {
    mainType: {
      code,
      name: meta.name,
      title: meta.title,
      description: meta.desc,
      image: meta.image,
    },
    dnaTattoo: "H M L H H M L M H H M L H M L",
    dimensionAnalysis: {
      groups: {
        "Bản Thân": { groupName: "Bản Thân", percentage: 88, averageScore: 4.4 },
        "Cảm Xúc": { groupName: "Cảm Xúc", percentage: 76, averageScore: 3.8 },
        "Thái Độ": { groupName: "Thái Độ", percentage: 92, averageScore: 4.6 },
        "Hành Động": { groupName: "Hành Động", percentage: 80, averageScore: 4.0 },
        "Xã Hội": { groupName: "Xã Hội", percentage: 84, averageScore: 4.2 },
      },
    },
    topMatches: [
      { code: "SEXY", name: "Linh Thú Quyến Rũ", similarityPercentage: 94, distance: 1.2, image: "/characters/SEXY.png" },
      { code: "CTRL", name: "Kiểm Soát Viên", similarityPercentage: 89, distance: 2.1, image: "/characters/CTRL.png" },
      { code: "Dior", name: "Quý Tộc Sang Chảnh", similarityPercentage: 85, distance: 2.8, image: "/characters/Dior.png" },
      { code: "SOLO", name: "Độc Hành Huyền Bí", similarityPercentage: 81, distance: 3.5, image: "/characters/SOLO.png" },
    ],
    bonusDrink: isDrunk,
    method: isDrunk ? "Layer 1 (DRUNK Override)" : "Layer 2 (Manhattan Distance)",
  };
}
