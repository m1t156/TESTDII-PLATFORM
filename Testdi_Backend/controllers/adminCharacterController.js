const Character = require('../models/Character');
const PersonalityArchetype = require('../models/PersonalityArchetype');
const { ERROR_MESSAGES } = require('../config/constants');
const { uploadCharacterImage, deleteOldImage, getImageUrl } = require('../middleware/upload');

// ====================== CHARACTERS ======================

/**
 * GET /api/admin/characters
 * List all characters with their archetype mapping
 */
async function getAllCharacters(req, res, next) {
  try {
    const characters = await Character.find().sort({ personalityType: 1 });

    // Also get archetype mapping
    const archetypes = await PersonalityArchetype.find().lean();
    const archetypeMap = {};
    archetypes.forEach(a => {
      if (a.characterId) {
        archetypeMap[a.characterId.toString()] = {
          archetypeCode: a.archetypeCode,
          archetypeName: a.archetypeName,
          dnaTattoo: a.dnaTattoo,
        };
      }
    });

    const result = characters.map(c => ({
      ...c.toObject(),
      archetype: archetypeMap[c._id.toString()] || null,
    }));

    res.json({
      total: result.length,
      characters: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/characters/:id
 * Get character detail
 */
async function getCharacter(req, res, next) {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    // Get associated archetype
    const archetype = await PersonalityArchetype.findOne({
      characterId: character._id,
    });

    res.json({
      character: character.toObject(),
      archetype: archetype ? archetype.toObject() : null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/characters/:id
 * Update character metadata (name, description, palettes)
 */
async function updateCharacter(req, res, next) {
  try {
    const { name, description, basePalettes } = req.body;

    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    if (name) character.name = name;
    if (description) character.description = description;
    if (basePalettes) character.basePalettes = basePalettes;
    character.updatedAt = new Date();

    await character.save();

    res.json({
      message: 'Character updated successfully',
      character,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/characters/:id/image/:imageType
 * Upload character image (base or unlocked)
 * imageType: 'base' or 'unlocked'
 * 
 * Body: multipart/form-data with field 'image'
 */
async function uploadImage(req, res, next) {
  try {
    const { id, imageType } = req.params;

    if (!['base', 'unlocked'].includes(imageType)) {
      return res.status(400).json({ error: 'imageType must be "base" or "unlocked"' });
    }

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    // Handle upload via multer
    uploadCharacterImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Delete old image if replacing
      const oldImageField = imageType === 'base' ? 'baseImage' : 'unlockedImage';
      deleteOldImage(character[oldImageField]);

      // Update character with new image URL
      const imageUrl = getImageUrl(req.file.filename);
      character[oldImageField] = imageUrl;
      character.updatedAt = new Date();
      await character.save();

      res.json({
        message: `${imageType} image uploaded successfully`,
        imageUrl,
        character,
      });
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/characters/:id/image/:imageType
 * Remove character image
 */
async function deleteImage(req, res, next) {
  try {
    const { id, imageType } = req.params;

    if (!['base', 'unlocked'].includes(imageType)) {
      return res.status(400).json({ error: 'imageType must be "base" or "unlocked"' });
    }

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    const imageField = imageType === 'base' ? 'baseImage' : 'unlockedImage';
    deleteOldImage(character[imageField]);
    character[imageField] = '';
    character.updatedAt = new Date();
    await character.save();

    res.json({
      message: `${imageType} image deleted successfully`,
      character,
    });
  } catch (error) {
    next(error);
  }
}

// ====================== ARCHETYPES ======================

/**
 * GET /api/admin/archetypes
 * List all archetypes
 */
async function getAllArchetypes(req, res, next) {
  try {
    const archetypes = await PersonalityArchetype.find()
      .populate('characterId')
      .sort({ archetypeCode: 1 });

    res.json({
      total: archetypes.length,
      archetypes,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/archetypes/:id
 * Update archetype (traits, description)
 */
async function updateArchetype(req, res, next) {
  try {
    const { archetypeName, description, traits } = req.body;

    const archetype = await PersonalityArchetype.findById(req.params.id);
    if (!archetype) {
      return res.status(404).json({ error: 'Archetype not found' });
    }

    if (archetypeName) archetype.archetypeName = archetypeName;
    if (description) archetype.description = description;
    if (traits) archetype.traits = traits;
    archetype.updatedAt = new Date();

    await archetype.save();

    res.json({
      message: 'Archetype updated successfully',
      archetype,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCharacters,
  getCharacter,
  updateCharacter,
  uploadImage,
  deleteImage,
  getAllArchetypes,
  updateArchetype,
};
