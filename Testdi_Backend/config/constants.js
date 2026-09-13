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
  CTRL:  { vector: [3,3,3,2,3,2,3,3,2,3,3,3,3,2,3], desc: 'The Controller — Trùm Kiếm Soát', code: 'CTRL' },
  ATMR:  { vector: [3,3,3,2,2,3,3,3,2,2,3,2,3,2,1], desc: 'ATM-er — Cây ATM Biết Đi', code: 'ATMR' },
  DIOR:  { vector: [2,3,2,3,3,2,3,2,3,2,3,2,1,2,1], desc: 'Dior-s — Quý Tộc Sang Chảnh', code: 'DIOR' },
  BOSS:  { vector: [3,3,3,2,3,2,3,3,2,3,3,3,3,2,1], desc: 'The Boss — Thủ Lĩnh Uy Quyền', code: 'BOSS' },
  THANK: { vector: [2,3,2,2,3,3,3,2,3,3,3,2,3,2,1], desc: 'THAN-K — Người Biết Ơn', code: 'THANK' },
  OHNO:  { vector: [3,3,1,1,3,2,1,3,2,3,3,2,3,2,1], desc: 'OH-NO — Thánh Hoảng Hốt', code: 'OHNO' },
  GOGO:  { vector: [3,3,2,2,3,2,3,3,2,3,3,3,3,2,3], desc: 'GOGO — Chiến Thần Năng Lượng', code: 'GOGO' },
  SEXY:  { vector: [2,3,2,2,2,1,2,3,3,2,3,3,2,1,2], desc: 'SEXY — Linh Thú Quyến Rũ', code: 'SEXY' },
  LOVR:  { vector: [2,1,2,1,2,1,3,1,2,3,1,3,3,1,2], desc: 'LOVE-R — Kẻ Lãng Mạn Mộng Mơ', code: 'LOVR' },
  MUMM:  { vector: [2,3,2,3,2,1,3,2,3,1,3,3,3,1,1], desc: 'MUM — Người Mẹ Quốc Dân', code: 'MUMM' },
  FAKE:  { vector: [3,1,2,3,3,1,2,1,3,3,1,3,3,1,2], desc: 'FAKE — Bậc Thầy Núp Bóng', code: 'FAKE' },
  OJBK:  { vector: [2,3,2,3,3,3,3,2,1,1,3,3,3,3,1], desc: 'OJBK — Thánh Sao Cũng Được', code: 'OJBK' },
  MALO:  { vector: [2,1,2,3,2,3,3,1,2,3,1,2,1,3,2], desc: 'MALO — Khỉ Nho Hóm Hỉnh', code: 'MALO' },
  JOKER: { vector: [1,1,2,1,2,1,1,3,1,1,1,1,3,1,3], desc: 'JOKE-R — Hề Sĩ Vui Vẻ', code: 'JOKER' },
  WOCI:  { vector: [3,3,1,2,3,2,3,3,2,3,2,3,1,2,2], desc: 'WOC! — Thánh Ôi Chao', code: 'WOCI' },
  THINK: { vector: [3,3,1,2,3,2,3,1,2,3,2,3,1,2,2], desc: 'THIN-K — Nhà Triết Học Đêm Muộn', code: 'THINK' },
  SHIT:  { vector: [3,3,1,2,1,2,1,3,3,3,2,3,1,2,2], desc: 'SHIT — Chiến Thần Thẳng Thắn', code: 'SHIT' },
  ZZZZ:  { vector: [2,2,1,3,1,2,1,3,1,3,3,1,1,2,3], desc: 'ZZZZ — Ẩn Sĩ Mộng Mơ', code: 'ZZZZ' },
  POOR:  { vector: [3,3,1,3,1,2,1,3,2,3,3,3,1,2,1], desc: 'POOR — Thánh Than Nghèo', code: 'POOR' },
  MONK:  { vector: [3,3,1,1,1,2,1,1,3,3,3,1,1,2,3], desc: 'MONK — Thiền Sĩ Thanh Tịnh', code: 'MONK' },
  IMSB:  { vector: [1,1,2,1,3,3,1,1,1,1,1,1,3,1,3], desc: 'IMSB — Thánh Ngu Ngơ Trẻ Thơ', code: 'IMSB' },
  SOLO:  { vector: [1,3,1,1,1,3,1,2,1,1,3,1,1,3,3], desc: 'SOLO — Độc Hành Huyền Bí', code: 'SOLO' },
  FUCK:  { vector: [2,1,1,1,2,1,1,1,3,3,1,1,3,1,2], desc: 'FUCK — Kẻ Hoang Dã Phá Cách', code: 'FUCK' },
  DEAD:  { vector: [1,1,1,1,1,3,1,3,1,1,1,1,1,2,3], desc: 'DEAD — Chiến Binh Bất Tử', code: 'DEAD' },
  IMFW:  { vector: [1,1,2,1,2,1,1,2,1,1,1,1,3,1,1], desc: 'IMFW — Thánh Vô Dụng Yêu Đời', code: 'IMFW' },
  DRUNK: { vector: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], desc: 'DRUNK — Thánh Say Ma Thuật', code: 'DRUNK' },
  HHHH:  { vector: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], desc: 'HHHH — Bậc Thầy Giả Chết', code: 'HHHH' },
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
