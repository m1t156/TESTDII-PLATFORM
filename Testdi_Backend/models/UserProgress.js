const mongoose = require('mongoose');

const unlockedElementSchema = new mongoose.Schema({
  elementType: {
    type: String,
    enum: ['character', 'mountain', 'climate', 'other'],
  },
  elementId: mongoose.Schema.Types.ObjectId,
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  guestId: {
    type: String,
    sparse: true,
  },
  sbtiResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SBTIResult',
  },
  selectedCharacterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  },
  selectedPaletteId: mongoose.Schema.Types.ObjectId,
  unlockedElements: [unlockedElementSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries (userId and guestId indexed via sparse: true in schema)
userProgressSchema.index({ sbtiResultId: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
