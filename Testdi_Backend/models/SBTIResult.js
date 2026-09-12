const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedOptionId: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
}, { _id: false });

const topMatchSchema = new mongoose.Schema({
  type: { type: String, required: true },     // e.g., "CTRL"
  code: { type: String, required: true },      // e.g., "CTRL"
  score: { type: Number, required: true },     // similarity % (0-100)
  distance: { type: Number },                  // Manhattan distance
  exact: { type: Number },                     // Count of exact dimension matches
  desc: { type: String },                      // e.g., "The Controller - Trùm Kiếm Soát"
}, { _id: false });

const dimensionGroupSchema = new mongoose.Schema({
  level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  score: { type: Number, required: true },     // 0-100 scale
  raw: [Number],                               // raw scores per sub-dimension
}, { _id: false });

const sbtiResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  guestId: {
    type: String,
    sparse: true,
  },
  // 15-character DNA pattern e.g., "MLMHLHMMHMMMMHM"
  dnaTattoo: {
    type: String,
    required: true,
  },
  // Full 15-dimension numeric vector (1, 2, or 3 per dimension = L/M/H)
  userVector: {
    type: [Number],
    required: true,
  },
  // Main archetype result
  mainType: {
    type: { type: String },   // archetype code, e.g., "CTRL"
    code: String,
    score: Number,            // similarity %
    distance: Number,         // Manhattan distance
    exact: Number,            // Exact dimension matches
    desc: String,
  },
  // Top 5 archetype matches
  topMatches: [topMatchSchema],
  // Confidence level based on gap between #1 and #2 match
  confidence: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true,
  },
  // Dimension analysis by group (Bản Thân, Cảm Xúc, Thái Độ, Hành Động, Xã Hội)
  dimensionAnalysis: {
    type: Map,
    of: dimensionGroupSchema,
  },
  // Bonus: drinking habit (0/1/2)
  bonusDrink: {
    type: Number,
    min: 0,
    max: 3,
  },
  // Link to personality archetype in DB (for character mapping)
  personalityArchetypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalityArchetype',
  },
  // Link to character (for images)
  characterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  },
  // Raw answers
  answers: [answerSchema],
  // Legacy field (kept for compatibility)
  matchSimilarityScore: {
    type: Number,
    min: 0,
    max: 1,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries (userId and guestId indexed via sparse: true in schema)
sbtiResultSchema.index({ completedAt: -1 });
sbtiResultSchema.index({ 'mainType.code': 1 });

module.exports = mongoose.model('SBTIResult', sbtiResultSchema);
