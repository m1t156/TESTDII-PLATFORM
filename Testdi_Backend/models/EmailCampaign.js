const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  htmlContent: {
    type: String,
    required: true,
  },
  textContent: String,  // Plain text fallback
  recipients: {
    type: String,
    enum: ['all', 'selected'],
    required: true,
  },
  selectedEmails: [String],  // When recipients = 'selected'
  status: {
    type: String,
    enum: ['draft', 'sending', 'sent', 'failed', 'partial'],
    default: 'draft',
    index: true,
  },
  sentCount: {
    type: Number,
    default: 0,
  },
  failedCount: {
    type: Number,
    default: 0,
  },
  failedEmails: [String],   // Track which emails failed
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sentAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

emailCampaignSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);
