const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  text: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  testType: {
    type: String,
    default: 'SBTI',
    index: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  dimension: {
    type: String,
    enum: ['SELF', 'EMOTIONS', 'ATTITUDE', 'ACTION', 'SOCIAL'],
    required: true,
  },
  measure: {
    type: String,
    required: true,
    // S1-S3, E1-E3, A1-A3, AC1-AC3, SO1-SO3
  },
  // Index of the dimension in the 15-dimension vector (0-14)
  // -1 for bonus questions that don't affect scoring
  dimensionIndex: {
    type: Number,
    required: true,
    min: -1,
    max: 14,
  },
  options: [optionSchema],
  order: {
    type: Number,
    required: true,
    min: 1,
  },
  isBonus: {
    type: Boolean,
    default: false,
  },
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
questionSchema.index({ testType: 1, order: 1 });
questionSchema.index({ dimension: 1, measure: 1 });

module.exports = mongoose.model('Question', questionSchema);
