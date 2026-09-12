const Notification = require('../models/Notification');
const { validateEmail } = require('../utils/validator');
const { ERROR_MESSAGES } = require('../config/constants');

/**
 * Subscribe to notifications
 */
async function subscribe(req, res, next) {
  try {
    const { email, featureName } = req.body;
    const userId = req.user?.userId;
    const guestId = req.guestId || req.body.guestId;

    // Validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: ERROR_MESSAGES.INVALID_EMAIL });
    }

    if (!featureName) {
      return res.status(400).json({ error: 'featureName is required' });
    }

    const validFeatures = ['mountains', 'climate', 'new_features', 'updates'];
    if (!validFeatures.includes(featureName)) {
      return res.status(400).json({
        error: `featureName must be one of: ${validFeatures.join(', ')}`,
      });
    }

    // Create or update notification
    let notification = await Notification.findOne({ email });

    if (!notification) {
      notification = new Notification({
        email,
        userId: userId || undefined,
        guestId: guestId || undefined,
        subscriptions: [
          {
            featureName,
            subscribedAt: new Date(),
          },
        ],
      });
    } else {
      // Check if already subscribed to this feature
      const alreadySubscribed = notification.subscriptions.some(
        s => s.featureName === featureName && !s.unsubscribedAt
      );

      if (!alreadySubscribed) {
        notification.subscriptions.push({
          featureName,
          subscribedAt: new Date(),
        });
      }
    }

    await notification.save();

    res.json({
      message: 'Subscribed successfully',
      notification,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Unsubscribe from notifications
 */
async function unsubscribe(req, res, next) {
  try {
    const { email, featureName } = req.body;

    if (!email || !featureName) {
      return res.status(400).json({ error: 'Email and featureName are required' });
    }

    const notification = await Notification.findOne({ email });

    if (!notification) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Mark subscription as unsubscribed
    const subscription = notification.subscriptions.find(
      s => s.featureName === featureName
    );

    if (subscription) {
      subscription.unsubscribedAt = new Date();
    }

    notification.isActive = notification.subscriptions.some(s => !s.unsubscribedAt);
    await notification.save();

    res.json({
      message: 'Unsubscribed successfully',
      notification,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get subscriptions for email
 */
async function getSubscriptions(req, res, next) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const notification = await Notification.findOne({ email });

    if (!notification) {
      return res.status(404).json({ error: 'No subscriptions found' });
    }

    res.json({
      email,
      subscriptions: notification.subscriptions.filter(s => !s.unsubscribedAt),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  getSubscriptions,
};
