const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { optionalAuthMiddleware } = require('../middleware/auth');

// Get all SBTI questions
router.get('/sbti/questions', testController.getSBTIQuestions);

// Submit SBTI test
router.post('/sbti/submit', optionalAuthMiddleware, testController.submitSBTITest);

// Get specific result
router.get('/sbti/result/:resultId', testController.getSBTIResult);

// Get latest result for user/guest
router.get('/sbti/latest', optionalAuthMiddleware, testController.getLatestResult);

// Get public personality scoreboard / statistics
router.get('/sbti/scoreboard', testController.getSBTIScoreboard);

module.exports = router;
