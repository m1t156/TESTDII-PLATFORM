const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { optionalAuthMiddleware } = require('../middleware/auth');

// Get user progress
router.get('/', optionalAuthMiddleware, progressController.getUserProgress);

// Save/update progress
router.post('/', optionalAuthMiddleware, progressController.saveProgress);

// Unlock element
router.post('/unlock', optionalAuthMiddleware, progressController.unlockElement);

module.exports = router;
