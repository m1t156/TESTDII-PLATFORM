const Character = require('../models/Character');
const { ERROR_MESSAGES } = require('../config/constants');

/**
 * Get character by personality type
 */
async function getCharacterByType(req, res, next) {
  try {
    const { personalityType } = req.params;

    const character = await Character.findOne({ personalityType });

    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    res.json({ character });
  } catch (error) {
    next(error);
  }
}

/**
 * Get character by ID
 */
async function getCharacterById(req, res, next) {
  try {
    const { characterId } = req.params;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    res.json({ character });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all characters
 */
async function getAllCharacters(req, res, next) {
  try {
    const characters = await Character.find().limit(27);

    res.json({
      totalCharacters: characters.length,
      characters,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get character palettes
 */
async function getCharacterPalettes(req, res, next) {
  try {
    const { characterId } = req.params;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    res.json({
      characterId: character._id,
      characterName: character.name,
      palettes: character.basePalettes,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCharacterByType,
  getCharacterById,
  getAllCharacters,
  getCharacterPalettes,
};
