const UserProgress = require('../models/UserProgress');
const SBTIResult = require('../models/SBTIResult');
const Character = require('../models/Character');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Get user progress
 */
async function getUserProgress(req, res, next) {
  try {
    const userId = req.user?.userId;
    const guestId = req.guestId || req.query.guestId;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'User ID or Guest ID required' });
    }

    const filter = userId ? { userId } : { guestId };
    const progress = await UserProgress.findOne(filter)
      .populate('sbtiResultId')
      .populate('selectedCharacterId');

    if (!progress) {
      return res.status(404).json({ error: 'No progress found' });
    }

    res.json({ progress });
  } catch (error) {
    next(error);
  }
}

/**
 * Create or update user progress
 */
async function saveProgress(req, res, next) {
  try {
    const { sbtiResultId, selectedCharacterId, selectedPaletteId } = req.body;
    const userId = req.user?.userId;
    const guestId = req.guestId || req.body.guestId;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'User ID or Guest ID required' });
    }

    if (!sbtiResultId || !selectedCharacterId) {
      return res.status(400).json({
        error: 'sbtiResultId and selectedCharacterId are required',
      });
    }

    const filter = userId ? { userId } : { guestId };

    // Verify character exists
    const character = await Character.findById(selectedCharacterId);
    if (!character) {
      return res.status(404).json({ error: ERROR_MESSAGES.CHARACTER_NOT_FOUND });
    }

    // Verify palette exists if provided
    if (selectedPaletteId && character) {
      const paletteExists = character.basePalettes.some(
        p => p.paletteId.toString() === selectedPaletteId
      );
      if (!paletteExists) {
        return res.status(404).json({ error: 'Palette not found' });
      }
    }

    // Create or update progress
    let progress = await UserProgress.findOne(filter);
    if (!progress) {
      progress = new UserProgress({
        userId: userId || undefined,
        guestId: guestId || undefined,
        sbtiResultId,
        selectedCharacterId,
        selectedPaletteId: selectedPaletteId || null,
        unlockedElements: [
          {
            elementType: 'character',
            elementId: selectedCharacterId,
          },
        ],
      });
    } else {
      progress.sbtiResultId = sbtiResultId;
      progress.selectedCharacterId = selectedCharacterId;
      progress.selectedPaletteId = selectedPaletteId || null;
      progress.lastUpdated = new Date();
    }

    await progress.save();

    res.json({
      message: SUCCESS_MESSAGES.PALETTE_SELECTED,
      progress: await progress.populate('selectedCharacterId'),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Unlock element in progression
 */
async function unlockElement(req, res, next) {
  try {
    const { elementType, elementId } = req.body;
    const userId = req.user?.userId;
    const guestId = req.guestId || req.body.guestId;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'User ID or Guest ID required' });
    }

    const filter = userId ? { userId } : { guestId };
    let progress = await UserProgress.findOne(filter);

    if (!progress) {
      return res.status(404).json({ error: 'User progress not found' });
    }

    // Check if element already unlocked
    const alreadyUnlocked = progress.unlockedElements.some(
      e => e.elementId.toString() === elementId && e.elementType === elementType
    );

    if (!alreadyUnlocked) {
      progress.unlockedElements.push({
        elementType,
        elementId,
      });
    }

    progress.lastUpdated = new Date();
    await progress.save();

    res.json({
      message: 'Element unlocked successfully',
      progress,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserProgress,
  saveProgress,
  unlockElement,
};
