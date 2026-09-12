const TestDefinition = require('./TestDefinition');
const { SBTI_CONFIG, MEASURES_MAP } = require('../config/constants');
const {
  calculateUserVector,
  matchArchetypes,
  buildSpecialResult,
  analyzeDimensions,
  generateDNA,
} = require('./sbtiCalculator');

class SBTITestDefinition extends TestDefinition {
  getTestMetadata() {
    return {
      testType: SBTI_CONFIG.testType,
      name: 'Bộ Trắc Nghiệm Tính Cách SBTI',
      totalQuestions: SBTI_CONFIG.totalQuestions,
      totalMeasures: SBTI_CONFIG.totalMeasures,
      totalArchetypes: SBTI_CONFIG.totalArchetypes,
    };
  }

  getDimensions() {
    return SBTI_CONFIG.dimensions;
  }

  getMeasures() {
    return MEASURES_MAP;
  }

  getQuestionsFilter() {
    return { testType: SBTI_CONFIG.testType };
  }

  getTotalQuestions() {
    return SBTI_CONFIG.totalQuestions;
  }

  /**
   * Calculate full SBTI result from answers
   * 
   * 2-LAYER SCORING LOGIC:
   * 
   * Layer 1 — DRUNK Override:
   *   If bonus question (drinking) = 1 ("Thánh Say"),
   *   override result to DRUNK immediately.
   * 
   * Layer 2 — Normal Matching + HHHH Fallback:
   *   Match against 25 standard archetypes (excluding DRUNK & HHHH).
   *   If top match score < 60%, fallback to HHHH.
   * 
   * @param {Array} answers - [{questionId, selectedOptionId, score}]
   * @param {Array} questions - Question documents from DB
   * @returns {Object} Full result with vector, DNA, matches, confidence, analysis
   */
  calculateFullResult(answers, questions) {
    // Step 1: Calculate user vector (sum → level → 1/2/3)
    const { userVector, bonusDrink } = calculateUserVector(answers, questions);

    // Step 2: Generate DNA string
    const dnaTattoo = generateDNA(userVector);

    // Step 3: Analyze dimensions
    const dimensionAnalysis = analyzeDimensions(userVector);

    // ==================== LAYER 1: DRUNK Override ====================
    // Bonus question answer = 1 ("Thánh Say") → DRUNK immediately
    if (bonusDrink === 1) {
      const drunkResult = buildSpecialResult('DRUNK', userVector);
      // Still run normal matching to populate top matches list
      const { results: normalMatches } = matchArchetypes(userVector);
      const topMatches = [drunkResult, ...normalMatches.slice(0, 4)];

      return {
        userVector,
        dnaTattoo,
        mainType: drunkResult,
        topMatches,
        confidence: 'HIGH',
        dimensionAnalysis,
        bonusDrink,
        method: 'DRUNK_OVERRIDE',
      };
    }

    // ==================== LAYER 2: Normal Matching ====================
    // Match against 25 archetypes (DRUNK & HHHH excluded)
    const { results: allMatches, confidence } = matchArchetypes(userVector);

    // HHHH Fallback: if top match score < 60%, override to HHHH
    const HHHH_THRESHOLD = 60;
    if (allMatches[0].score < HHHH_THRESHOLD) {
      const hhhhResult = buildSpecialResult('HHHH', userVector);
      const topMatches = [hhhhResult, ...allMatches.slice(0, 4)];

      return {
        userVector,
        dnaTattoo,
        mainType: hhhhResult,
        topMatches,
        confidence: 'LOW',
        dimensionAnalysis,
        bonusDrink,
        method: 'HHHH_FALLBACK',
      };
    }

    // Normal result: top match from 25 archetypes
    const topMatches = allMatches.slice(0, 5);

    return {
      userVector,
      dnaTattoo,
      mainType: topMatches[0],
      topMatches,
      confidence,
      dimensionAnalysis,
      bonusDrink,
      method: 'NORMAL',
    };
  }

  /**
   * Legacy: Calculate DNA from answers (kept for compatibility)
   */
  calculateResultDNA(answers, questions) {
    const { userVector } = calculateUserVector(answers, questions);
    return generateDNA(userVector);
  }

  /**
   * Legacy: Match DNA with archetypes (kept for compatibility)
   * Uses Manhattan distance on numeric vectors converted from DNA
   */
  matchWithArchetypes(dna) {
    // Convert DNA back to numeric vector for matching
    const levelValues = { L: 1, M: 2, H: 3 };
    const approximateVector = dna.split('').map(c => levelValues[c] || 2);
    const { results } = matchArchetypes(approximateVector);

    return {
      archetype: {
        archetypeCode: results[0].code,
        archetypeName: results[0].type,
        description: results[0].desc,
      },
      similarityScore: parseFloat((results[0].score / 100).toFixed(3)),
    };
  }

  /**
   * Validate SBTI answers format
   * @param {Array} answers - Array of {questionId, selectedOptionId, score}
   */
  validateAnswers(answers) {
    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    if (answers.length !== SBTI_CONFIG.totalQuestions) {
      throw new Error(
        `Expected ${SBTI_CONFIG.totalQuestions} answers, got ${answers.length}`
      );
    }

    for (const answer of answers) {
      if (!answer.questionId) {
        throw new Error('Each answer must have questionId');
      }
      if (answer.score === undefined || answer.score === null) {
        throw new Error('Each answer must have a score (1, 2, or 3)');
      }
      if (answer.score < 1 || answer.score > 3) {
        throw new Error(`Score must be 1, 2, or 3. Got: ${answer.score}`);
      }
    }

    return true;
  }
}

module.exports = SBTITestDefinition;
