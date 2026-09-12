const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Subscribe to notifications
router.post('/subscribe', notificationController.subscribe);

// Unsubscribe from notifications
router.post('/unsubscribe', notificationController.unsubscribe);

// Get subscriptions for email
router.get('/subscriptions', notificationController.getSubscriptions);

module.exports = router;
