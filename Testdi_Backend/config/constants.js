// ====================== DIMENSION CONFIGURATION ======================
const DIMENSION_NAMES = [
  'S1_SelfEsteem', 'S2_SelfClarity', 'S3_Purpose',
  'E1_Attachment', 'E2_EmotionalDepth', 'E3_Independence',
  'A1_Worldview', 'A2_RulesFlex', 'A3_Meaning',
  'AC1_Motivation', 'AC2_Decision', 'AC3_Execution',
  'So1_SocialProactivity', 'So2_Boundaries', 'So3_Authenticity',
];

const DIMENSION_GROUPS = {
  'Bản Thân': [0, 1, 2],
  'Cảm Xúc': [3, 4, 5],
  'Thái Độ': [6, 7, 8],
  'Hành Động': [9, 10, 11],
  'Xã Hội': [12, 13, 14],
};

// ====================== 27 ARCHETYPES (from sbti_core_rev1905.py) ======================
// Vectors use 1/2/3 scale (L/M/H) matching reference engine.mjs
const ARCHETYPES = {
  CTRL:  { vector: [3,3,3,2,3,2,3,3,2,3,3,3,3,2,3], desc: 'The Controller - Trùm Kiếm Soát', code: 'CTRL' },
  ATMR:  { vector: [3,3,3,2,2,3,3,3,2,2,3,2,3,2,1], desc: 'ATM-er - Cây ATM Biết đi', code: 'ATMR' },
  DIOR:  { vector: [2,3,2,3,3,2,3,2,3,2,3,2,1,2,1], desc: 'Dior-s - Kẻ Thất Bại', code: 'DIOR' },
  BOSS:  { vector: [3,3,3,2,3,2,3,3,2,3,3,3,3,2,1], desc: 'The Boss - Thủ Lĩnh', code: 'BOSS' },
  THANK: { vector: [2,3,2,2,3,3,3,2,3,3,3,2,3,2,1], desc: 'THAN-K - Người Biết Ơn', code: 'THANK' },
  OHNO:  { vector: [3,3,1,1,3,2,1,3,2,3,3,2,3,2,1], desc: 'OH-NO - Người OH-NO', code: 'OHNO' },
  GOGO:  { vector: [3,3,2,2,3,2,3,3,2,3,3,3,3,2,3], desc: 'GOGO - Người Go-Go', code: 'GOGO' },
  SEXY:  { vector: [2,3,2,2,2,1,2,3,3,2,3,3,2,1,2], desc: 'SEXY - Người Hấp Dẫn', code: 'SEXY' },
  LOVR:  { vector: [2,1,2,1,2,1,3,1,2,3,1,3,3,1,2], desc: 'LOVE-R - Người Lãng Mạn', code: 'LOVR' },
  MUMM:  { vector: [2,3,2,3,2,1,3,2,3,1,3,3,3,1,1], desc: 'MUM - Mẹ', code: 'MUMM' },
  FAKE:  { vector: [3,1,2,3,3,1,2,1,3,3,1,3,3,1,2], desc: 'FAKE - Người Giả', code: 'FAKE' },
  OJBK:  { vector: [2,3,2,3,3,3,3,2,1,1,3,3,3,3,1], desc: 'OJBK - Người Tùy Tiện', code: 'OJBK' },
  MALO:  { vector: [2,1,2,3,2,3,3,1,2,3,1,2,1,3,2], desc: 'MALO - Khi Nho', code: 'MALO' },
  JOKER: { vector: [1,1,2,1,2,1,1,3,1,1,1,1,3,1,3], desc: 'JOKE-R - Người Hề', code: 'JOKER' },
  WOCI:  { vector: [3,3,1,2,3,2,3,3,2,3,2,3,1,2,2], desc: 'WOC! - Người WOC!', code: 'WOCI' },
  THINK: { vector: [3,3,1,2,3,2,3,1,2,3,2,3,1,2,2], desc: 'THIN-K - Người Suy Tư', code: 'THINK' },
  SHIT:  { vector: [3,3,1,2,1,2,1,3,3,3,2,3,1,2,2], desc: 'SHIT - Người Hận Thù', code: 'SHIT' },
  ZZZZ:  { vector: [2,2,1,3,1,2,1,3,1,3,3,1,1,2,3], desc: 'ZZZZ - Người Ma', code: 'ZZZZ' },
  POOR:  { vector: [3,3,1,3,1,2,1,3,2,3,3,3,1,2,1], desc: 'POOR - Người Nghèo', code: 'POOR' },
  MONK:  { vector: [3,3,1,1,1,2,1,1,3,3,3,1,1,2,3], desc: 'MONK - Nhà Sư', code: 'MONK' },
  IMSB:  { vector: [1,1,2,1,3,3,1,1,1,1,1,1,3,1,3], desc: 'IMSB - Người Ngu', code: 'IMSB' },
  SOLO:  { vector: [1,3,1,1,1,3,1,2,1,1,3,1,1,3,3], desc: 'SOLO - Người Cô Đơn', code: 'SOLO' },
  FUCK:  { vector: [2,1,1,1,2,1,1,1,3,3,1,1,3,1,2], desc: 'FUCK - Người Hoang Dã', code: 'FUCK' },
  DEAD:  { vector: [1,1,1,1,1,3,1,3,1,1,1,1,1,2,3], desc: 'DEAD - Kẻ Chết', code: 'DEAD' },
  IMFW:  { vector: [1,1,2,1,2,1,1,2,1,1,1,1,3,1,1], desc: 'IMFW - Người Vô Dụng', code: 'IMFW' },
  DRUNK: { vector: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], desc: 'DRUNK - Người Say Xỉn (Hidden)', code: 'DRUNK' },
  HHHH:  { vector: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], desc: 'HHHH - Người Giả Chết (Fallback)', code: 'HHHH' },
};

// ====================== SBTI CONFIG ======================
const SBTI_CONFIG = {
  testType: 'SBTI',
  totalQuestions: 31, // 30 main + 1 bonus
  totalMainQuestions: 30,
  totalMeasures: 15,
  dimensions: ['SELF', 'EMOTIONS', 'ATTITUDE', 'ACTION', 'SOCIAL'],
  measuresPerDimension: 3,
  questionsPerMeasure: 2,
  levels: ['L', 'M', 'H'],
  // Each question has 3 options scoring 1, 2, 3
  scoreRange: { min: 1, max: 3 },
  // Manhattan distance matching config
  // Max distance = 15 dims × 2 max diff = 30
  maxDistance: 30,
  totalArchetypes: 27,
};

// Measures mapping (5 dimensions × 3 measures each)
const MEASURES_MAP = {
  SELF: ['S1', 'S2', 'S3'],
  EMOTIONS: ['E1', 'E2', 'E3'],
  ATTITUDE: ['A1', 'A2', 'A3'],
  ACTION: ['AC1', 'AC2', 'AC3'],
  SOCIAL: ['SO1', 'SO2', 'SO3'],
};

// Error messages
const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Email is not valid',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_PASSWORD: 'Password is incorrect',
  JWT_EXPIRED: 'JWT token has expired',
  INVALID_TOKEN: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',
  QUESTION_NOT_FOUND: 'Question not found',
  CHARACTER_NOT_FOUND: 'Character not found',
  RESULT_NOT_FOUND: 'Result not found',
  INVALID_ANSWERS: 'Invalid answers format',
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TEST_SUBMITTED: 'Test submitted successfully',
  PALETTE_SELECTED: 'Palette selected successfully',
};

module.exports = {
  DIMENSION_NAMES,
  DIMENSION_GROUPS,
  ARCHETYPES,
  SBTI_CONFIG,
  MEASURES_MAP,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
