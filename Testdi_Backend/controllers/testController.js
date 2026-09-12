const Question = require('../models/Question');
const SBTIResult = require('../models/SBTIResult');
const PersonalityArchetype = require('../models/PersonalityArchetype');
const Character = require('../models/Character');
const TestFactory = require('../services/TestFactory');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, ARCHETYPES } = require('../config/constants');

/**
 * Fisher-Yates shuffle (in-place)
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get all SBTI questions (shuffled for anti-gaming)
 */
async function getSBTIQuestions(req, res, next) {
  try {
    const questions = await Question.find({ testType: 'SBTI' }).sort({ order: 1 });

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }

    const questionsData = questions.map(q => q.toObject());
    const mainQuestions = questionsData.filter(q => !q.isBonus);
    const bonusQuestions = questionsData.filter(q => q.isBonus);

    shuffleArray(mainQuestions);
    [...mainQuestions, ...bonusQuestions].forEach(q => {
      shuffleArray(q.options);
    });

    const shuffledQuestions = [...mainQuestions, ...bonusQuestions];

    res.json({
      message: 'SBTI questions retrieved successfully',
      totalQuestions: shuffledQuestions.length,
      data: shuffledQuestions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Submit SBTI test and get result
 */
async function submitSBTITest(req, res, next) {
  try {
    const { answers } = req.body;
    const userId = req.user?.userId;
    const guestId = req.guestId || req.body.guestId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'User ID or Guest ID required' });
    }

    const testDefinition = TestFactory.getTest('SBTI');

    try {
      testDefinition.validateAnswers(answers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const questions = await Question.find({ testType: 'SBTI' });
    if (questions.length === 0) {
      return res.status(500).json({ error: 'Questions not found in database' });
    }

    const fullResult = testDefinition.calculateFullResult(answers, questions);
    const {
      userVector,
      dnaTattoo,
      mainType,
      topMatches,
      confidence,
      dimensionAnalysis,
      bonusDrink,
    } = fullResult;

    let archetype = null;
    let character = null;

    archetype = await PersonalityArchetype.findOne({
      testType: 'SBTI',
      archetypeCode: mainType.code,
    });

    if (archetype && archetype.characterId) {
      character = await Character.findById(archetype.characterId);
    }

    const mappedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId || undefined,
      score: answer.score,
    }));

    const sbtiResult = new SBTIResult({
      userId: userId || undefined,
      guestId: guestId || undefined,
      dnaTattoo,
      userVector,
      mainType: {
        type: mainType.type,
        code: mainType.code,
        score: mainType.score,
        distance: mainType.distance,
        exact: mainType.exact,
        desc: mainType.desc,
      },
      topMatches,
      confidence,
      dimensionAnalysis,
      bonusDrink,
      personalityArchetypeId: archetype?._id,
      characterId: character?._id,
      answers: mappedAnswers,
      matchSimilarityScore: parseFloat((mainType.score / 100).toFixed(3)),
    });

    await sbtiResult.save();

    res.json({
      message: SUCCESS_MESSAGES.TEST_SUBMITTED,
      result: {
        sbtiResultId: sbtiResult._id,
        dnaTattoo,
        userVector,
        mainType: {
          code: mainType.code,
          name: mainType.type,
          description: mainType.desc,
          similarityScore: mainType.score,
          distance: mainType.distance,
          exact: mainType.exact,
        },
        topMatches: topMatches.map(m => ({
          code: m.code,
          name: m.type,
          description: m.desc,
          similarityScore: m.score,
          distance: m.distance,
          exact: m.exact,
        })),
        confidence,
        dimensionAnalysis,
        bonusDrink,
        archetype: archetype ? {
          _id: archetype._id,
          name: archetype.archetypeName,
          code: archetype.archetypeCode,
          description: archetype.description,
          traits: archetype.traits,
        } : null,
        character: character ? {
          _id: character._id,
          name: character.name,
          description: character.description,
          baseImage: character.baseImage,
          unlockedImage: character.unlockedImage,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get SBTI result by ID
 */
async function getSBTIResult(req, res, next) {
  try {
    const { resultId } = req.params;

    const result = await SBTIResult.findById(resultId)
      .populate('personalityArchetypeId')
      .populate('characterId');

    if (!result) {
      return res.status(404).json({ error: ERROR_MESSAGES.RESULT_NOT_FOUND });
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get latest result for user/guest
 */
async function getLatestResult(req, res, next) {
  try {
    const userId = req.user?.userId;
    const guestId = req.guestId || req.query.guestId;

    const filter = userId ? { userId } : { guestId };

    const result = await SBTIResult.findOne(filter)
      .populate('personalityArchetypeId')
      .populate('characterId')
      .sort({ completedAt: -1 });

    if (!result) {
      return res.status(404).json({ error: 'No test result found' });
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
}

/**
 * Public Scoreboard Endpoint
 * GET /api/tests/sbti/scoreboard
 * Returns aggregated stats for popular personality types based on completed test results
 */
async function getSBTIScoreboard(req, res, next) {
  try {
    const totalTests = await SBTIResult.countDocuments();

    // Aggregate test count per mainType code
    const distribution = await SBTIResult.aggregate([
      {
        $group: {
          _id: '$mainType.code',
          count: { $sum: 1 },
          desc: { $first: '$mainType.desc' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    let scoreboard = [];

    if (totalTests > 0 && distribution.length > 0) {
      scoreboard = distribution.map((item, idx) => {
        const pct = parseFloat(((item.count / totalTests) * 100).toFixed(1));
        const archInfo = ARCHETYPES[item._id] || {};
        return {
          rank: idx + 1,
          code: item._id,
          desc: archInfo.desc || item.desc || item._id,
          count: item.count,
          percentage: pct,
        };
      });
    } else {
      // Fallback initial scoreboard dataset for empty database
      const initialRanks = [
        { code: 'BOSS', count: 342, percentage: 23.5 },
        { code: 'SEXY', count: 285, percentage: 19.6 },
        { code: 'CTRL', count: 220, percentage: 15.1 },
        { code: 'DRUNK', count: 180, percentage: 12.4 },
        { code: 'DIOR', count: 145, percentage: 10.0 },
        { code: 'SOLO', count: 120, percentage: 8.2 },
        { code: 'JOKER', count: 80, percentage: 5.5 },
        { code: 'MONK', count: 83, percentage: 5.7 },
      ];

      scoreboard = initialRanks.map((item, idx) => ({
        rank: idx + 1,
        code: item.code,
        desc: ARCHETYPES[item.code]?.desc || item.code,
        count: item.count,
        percentage: item.percentage,
      }));
    }

    res.json({
      message: 'Scoreboard retrieved successfully',
      totalTests: totalTests > 0 ? totalTests : 1455,
      scoreboard,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSBTIQuestions,
  submitSBTITest,
  getSBTIResult,
  getLatestResult,
  getSBTIScoreboard,
};
