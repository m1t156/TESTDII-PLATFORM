const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/admin/adminDashboardController');
const adminAnalyticsController = require('../controllers/admin/adminAnalyticsController');
const adminQuestionController = require('../controllers/admin/adminQuestionController');
const adminUserController = require('../controllers/admin/adminUserController');
const adminCharacterController = require('../controllers/adminCharacterController');
const adminEmailController = require('../controllers/adminEmailController');
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/adminAuth');

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// ====================== Dashboard ======================
router.get('/dashboard', adminDashboardController.getDashboard);

// ====================== Analytics ======================
router.get('/analytics', adminAnalyticsController.getAnalytics);  // Legacy
router.get('/analytics/archetype-distribution', adminAnalyticsController.getArchetypeDistribution);
router.get('/analytics/traffic', adminAnalyticsController.getTrafficStats);
router.get('/analytics/test-stats', adminAnalyticsController.getTestStats);

// ====================== Users ======================
router.get('/users', adminUserController.getUsers);

// ====================== Questions CRUD ======================
router.get('/questions', adminQuestionController.getAllQuestions);
router.get('/questions/export', adminQuestionController.exportQuestions);
router.post('/questions', adminQuestionController.createQuestion);
router.post('/questions/bulk', adminQuestionController.bulkImportQuestions);
router.put('/questions/reorder', adminQuestionController.reorderQuestions);
router.put('/questions/:questionId', adminQuestionController.updateQuestion);
router.delete('/questions/:questionId', adminQuestionController.deleteQuestion);

// ====================== Characters & Archetypes ======================
router.get('/characters', adminCharacterController.getAllCharacters);
router.get('/characters/:id', adminCharacterController.getCharacter);
router.put('/characters/:id', adminCharacterController.updateCharacter);
router.post('/characters/:id/image/:imageType', adminCharacterController.uploadImage);
router.delete('/characters/:id/image/:imageType', adminCharacterController.deleteImage);

router.get('/archetypes', adminCharacterController.getAllArchetypes);
router.put('/archetypes/:id', adminCharacterController.updateArchetype);

// ====================== Email Campaigns ======================
router.get('/emails/verify', adminEmailController.verifyEmail);
router.get('/emails/recipients', adminEmailController.getRecipients);
router.get('/emails/campaigns', adminEmailController.getCampaigns);
router.get('/emails/campaigns/:id', adminEmailController.getCampaign);
router.post('/emails/campaigns', adminEmailController.createCampaign);
router.put('/emails/campaigns/:id', adminEmailController.updateCampaign);
router.post('/emails/campaigns/:id/send', adminEmailController.sendCampaign);
router.delete('/emails/campaigns/:id', adminEmailController.deleteCampaign);

module.exports = router;
