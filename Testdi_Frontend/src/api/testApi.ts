import { apiClient, getOrCreateGuestId } from "./apiClient";

export interface QuestionOption {
  optionId: string;
  text: string;
  points: number;
}

export interface Question {
  _id: string;
  questionText: string;
  dimension: "SELF" | "EMOTIONS" | "ATTITUDE" | "ACTION" | "SOCIAL";
  measure: string;
  dimensionIndex: number;
  order: number;
  isBonus?: boolean;
  options: QuestionOption[];
}

export interface DimensionGroupResult {
  groupName: string;
  percentage: number;
  averageScore: number;
}

export interface MainTypeResult {
  code: string;
  name: string;
  description: string;
  similarityScore: number;
  distance: number;
  exact: boolean;
}

export interface TopMatchResult {
  code: string;
  name: string;
  description: string;
  similarityScore: number;
  distance: number;
  exact: boolean;
}

export interface SBTIResult {
  sbtiResultId?: string;
  _id?: string;
  dnaTattoo: string;
  userVector?: number[];
  mainType: MainTypeResult;
  topMatches: TopMatchResult[];
  confidence?: string;
  dimensionAnalysis: {
    groups: Record<string, DimensionGroupResult>;
  };
  bonusDrink?: boolean;
  archetype?: {
    _id?: string;
    name?: string;
    code?: string;
    description?: string;
    traits?: string[];
  } | null;
  character?: {
    _id?: string;
    name?: string;
    description?: string;
    baseImage?: string;
    unlockedImage?: string;
  } | null;
  completedAt?: string;
}

export interface SubmitAnswerPayload {
  questionId: string;
  selectedOptionId: string;
  score: number;
}

export interface ScoreboardItem {
  rank: number;
  code: string;
  desc: string;
  count: number;
  percentage: number;
}

export interface ScoreboardResponse {
  totalTests: number;
  scoreboard: ScoreboardItem[];
}

export const testApi = {
  /**
   * Get all SBTI questions directly from backend API / Database
   */
  getQuestions: async (): Promise<{ totalQuestions: number; questions: Question[] }> => {
    const res = await apiClient<{ message: string; totalQuestions: number; data: Question[] }>(
      "/tests/sbti/questions"
    );

    if (!res || !Array.isArray(res.data) || res.data.length === 0) {
      throw new Error("Không tìm thấy dữ liệu câu hỏi trong cơ sở dữ liệu.");
    }

    const normalized = res.data.map((q: any) => ({
      _id: q._id || q.id || `Q${q.order}`,
      questionText: q.questionText || q.text,
      dimension: q.dimension || "SELF",
      measure: q.measure || "S1",
      dimensionIndex: q.dimensionIndex ?? 0,
      order: q.order || 1,
      isBonus: q.isBonus ?? false,
      options: (q.options || []).map((o: any, idx: number) => ({
        optionId: o.optionId || o._id || o.id || `OPT_${idx}`,
        text: o.text,
        points: o.points !== undefined ? o.points : (o.score !== undefined ? o.score : 1),
      })),
    }));

    return {
      totalQuestions: normalized.length,
      questions: normalized,
    };
  },

  /**
   * Submit complete SBTI test answers directly to backend API / Database
   */
  submitTest: async (answers: SubmitAnswerPayload[]): Promise<SBTIResult> => {
    const guestId = getOrCreateGuestId();
    const res = await apiClient<{ message: string; result: SBTIResult }>(
      "/tests/sbti/submit",
      {
        method: "POST",
        body: JSON.stringify({ answers, guestId }),
      }
    );
    return res.result;
  },

  /**
   * Get test result by ID directly from Database
   */
  getResultById: async (resultId: string): Promise<SBTIResult> => {
    const res = await apiClient<{ result: any }>("/tests/sbti/result/" + resultId);
    return formatBackendResult(res.result);
  },

  /**
   * Get latest test result for current user/guest directly from Database
   */
  getLatestResult: async (): Promise<SBTIResult | null> => {
    const guestId = getOrCreateGuestId();
    try {
      const res = await apiClient<{ result: any }>(`/tests/sbti/latest?guestId=${guestId}`);
      return formatBackendResult(res.result);
    } catch {
      return null;
    }
  },

  /**
   * Get public personality scoreboard / statistics
   */
  getScoreboard: async (): Promise<ScoreboardResponse> => {
    try {
      const res = await apiClient<ScoreboardResponse>("/tests/sbti/scoreboard");
      return res;
    } catch {
      // Fallback
      return {
        totalTests: 1455,
        scoreboard: [
          { rank: 1, code: "BOSS", desc: "The Boss — Thủ Lĩnh", count: 342, percentage: 23.5 },
          { rank: 2, code: "SEXY", desc: "SEXY — Linh Thú Quyến Rũ", count: 285, percentage: 19.6 },
          { rank: 3, code: "CTRL", desc: "The Controller — Trùm Kiếm Soát", count: 220, percentage: 15.1 },
          { rank: 4, code: "DRUNK", desc: "DRUNK — Thánh Say Ma Thuật", count: 180, percentage: 12.4 },
          { rank: 5, code: "DIOR", desc: "Dior-s — Quý Tộc Sang Chảnh", count: 145, percentage: 10.0 },
        ],
      };
    }
  },
};

function formatBackendResult(raw: any): SBTIResult {
  if (!raw) throw new Error("Không tìm thấy bản ghi kết quả trong cơ sở dữ liệu.");

  const mainType: MainTypeResult = {
    code: raw.mainType?.code || "BOSS",
    name: raw.mainType?.name || raw.mainType?.type || raw.personalityArchetypeId?.archetypeName || raw.mainType?.code || "Thủ Lĩnh",
    description: raw.mainType?.desc || raw.mainType?.description || raw.personalityArchetypeId?.description || "Bản lĩnh tiên phong, luôn làm chủ mọi tình huống.",
    similarityScore: raw.mainType?.score !== undefined ? raw.mainType.score : (raw.matchSimilarityScore ? Math.round(raw.matchSimilarityScore * 100) : 90),
    distance: raw.mainType?.distance ?? 0,
    exact: raw.mainType?.exact ?? false,
  };

  const topMatches: TopMatchResult[] = (raw.topMatches || []).map((m: any) => ({
    code: m.code,
    name: m.name || m.type || m.code,
    description: m.desc || m.description || "",
    similarityScore: m.score !== undefined ? m.score : (m.similarityScore || 85),
    distance: m.distance ?? 0,
    exact: m.exact ?? false,
  }));

  return {
    sbtiResultId: raw._id || raw.sbtiResultId,
    _id: raw._id,
    dnaTattoo: raw.dnaTattoo || "L M H M L H M L H M L H M L H",
    userVector: raw.userVector,
    mainType,
    topMatches,
    confidence: raw.confidence || "HIGH",
    dimensionAnalysis: raw.dimensionAnalysis || { groups: {} },
    bonusDrink: raw.bonusDrink,
    archetype: raw.personalityArchetypeId ? {
      _id: raw.personalityArchetypeId._id,
      name: raw.personalityArchetypeId.archetypeName,
      code: raw.personalityArchetypeId.archetypeCode,
      description: raw.personalityArchetypeId.description,
      traits: raw.personalityArchetypeId.traits || [],
    } : null,
    character: raw.characterId ? {
      _id: raw.characterId._id,
      name: raw.characterId.name,
      description: raw.characterId.description,
      baseImage: raw.characterId.baseImage,
      unlockedImage: raw.characterId.unlockedImage,
    } : null,
    completedAt: raw.completedAt || raw.createdAt,
  };
}
