const mongoose = require('mongoose');

const personalityArchetypeSchema = new mongoose.Schema({
  testType: {
    type: String,
    default: 'SBTI',
    index: true,
  },
  archetypeName: String,
  archetypeCode: String,
  dnaTattoo: {
    type: String,
    unique: true,
    required: true,
    // 15-char DNA pattern e.g., "LLMHMHLLMHLMHM"
  },
  description: String,
  characterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  },
  traits: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
personalityArchetypeSchema.index({ testType: 1, dnaTattoo: 1 });

module.exports = mongoose.model('PersonalityArchetype', personalityArchetypeSchema);
