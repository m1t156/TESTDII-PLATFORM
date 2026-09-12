const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    index: true,
  },
  method: {
    type: String,
    default: 'GET',
  },
  ipHash: String,       // Hashed IP for privacy
  userAgent: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  guestId: {
    type: String,
    sparse: true,
  },
  sessionId: String,    // For unique session tracking
  referrer: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound indexes for analytics queries
pageViewSchema.index({ createdAt: -1, path: 1 });
pageViewSchema.index({ sessionId: 1 });

module.exports = mongoose.model('PageView', pageViewSchema);
