const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  featureName: {
    type: String,
    enum: ['mountains', 'climate', 'new_features', 'updates'],
    required: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: Date,
}, { _id: false });

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  guestId: {
    type: String,
    sparse: true,
  },
  subscriptions: [subscriptionSchema],
  isActive: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model('Notification', notificationSchema);
