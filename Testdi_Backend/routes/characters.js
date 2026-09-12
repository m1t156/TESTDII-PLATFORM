const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// Get all characters
router.get('/', characterController.getAllCharacters);

// Get character by ID
router.get('/:characterId', characterController.getCharacterById);

// Get character by personality type
router.get('/type/:personalityType', characterController.getCharacterByType);

// Get character palettes
router.get('/:characterId/palettes', characterController.getCharacterPalettes);

module.exports = router;
