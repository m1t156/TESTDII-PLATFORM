import { apiClient } from "./apiClient";

export interface ColorPalette {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface CharacterItem {
  _id: string;
  personalityType: string;
  name: string;
  description: string;
  baseImage?: string;
  unlockedImage?: string;
  basePalettes?: ColorPalette[];
  traits?: string[];
  createdAt?: string;
}

// Static image mapping for all 27 personalities to guarantee artwork display
export const CHARACTER_IMAGE_MAP: Record<string, string> = {
  ATM: "/characters/ATM-er.png",
  ATMR: "/characters/ATM-er.png",
  "ATM-er": "/characters/ATM-er.png",
  BOSS: "/characters/BOSS.png",
  CTRL: "/characters/CTRL.png",
  DEAD: "/characters/DEAD.png",
  DRUNK: "/characters/DRUNK.png",
  Dior: "/characters/Dior.png",
  DIOR: "/characters/Dior.png",
  FAKE: "/characters/FAKE.png",
  FUCK: "/characters/FUCK.png",
  GOGO: "/characters/GOGO.png",
  HHHH: "/characters/HHHH.png",
  IMFW: "/characters/IMFW.png",
  IMSB: "/characters/IMSB.png",
  JOKER: "/characters/JOKE-R.png",
  "JOKE-R": "/characters/JOKE-R.png",
  LOVR: "/characters/LOVE-R.png",
  "LOVE-R": "/characters/LOVE-R.png",
  MALO: "/characters/MALO.png",
  MONK: "/characters/MONK.png",
  MUM: "/characters/MUM.png",
  MUMM: "/characters/MUM.png",
  OHNO: "/characters/OH-NO.png",
  "OH-NO": "/characters/OH-NO.png",
  OJBK: "/characters/OJBK.png",
  POOR: "/characters/POOR.png",
  SEXY: "/characters/SEXY.png",
  SHIT: "/characters/SHIT.png",
  SOLO: "/characters/SOLO.png",
  THANK: "/characters/THAN-K.png",
  "THAN-K": "/characters/THAN-K.png",
  THINK: "/characters/THIN-K.png",
  "THIN-K": "/characters/THIN-K.png",
  WOC: "/characters/WOC.png",
  WOCI: "/characters/WOC.png",
  ZZZZ: "/characters/ZZZZ.png",
};

/**
 * Resolves local image asset path for an archetype code or character
 */
export function getCharacterImageUrl(codeOrType: string, dbImageUrl?: string): string {
  if (dbImageUrl && (dbImageUrl.startsWith("http") || dbImageUrl.startsWith("/uploads"))) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return dbImageUrl.startsWith("/uploads") ? `${apiBase.replace(/\/api$/, "")}${dbImageUrl}` : dbImageUrl;
  }
  
  if (!codeOrType) return "/characters/BOSS.png";
  const upperCode = codeOrType.trim().toUpperCase();
  
  if (CHARACTER_IMAGE_MAP[codeOrType]) return CHARACTER_IMAGE_MAP[codeOrType];
  if (CHARACTER_IMAGE_MAP[upperCode]) return CHARACTER_IMAGE_MAP[upperCode];

  // Try direct code lookup
  return `/characters/${codeOrType}.png`;
}

export const personalityApi = {
  /**
   * Get all 27 personality characters
   */
  getAllCharacters: async (): Promise<CharacterItem[]> => {
    try {
      const res = await apiClient<{ totalCharacters: number; characters: CharacterItem[] }>(
        "/characters"
      );
      return res.characters || [];
    } catch {
      return [];
    }
  },

  /**
   * Get character by ID
   */
  getCharacterById: async (characterId: string): Promise<CharacterItem | null> => {
    try {
      const res = await apiClient<{ character: CharacterItem }>("/characters/" + characterId);
      return res.character;
    } catch {
      return null;
    }
  },

  /**
   * Get character by personality type code (e.g., 'BOSS', 'SEXY', 'CTRL')
   */
  getCharacterByType: async (personalityType: string): Promise<CharacterItem | null> => {
    try {
      const res = await apiClient<{ character: CharacterItem }>(
        "/characters/type/" + encodeURIComponent(personalityType)
      );
      return res.character;
    } catch {
      return null;
    }
  },
};
