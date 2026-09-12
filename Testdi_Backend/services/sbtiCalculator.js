const { ARCHETYPES, DIMENSION_GROUPS, DIMENSION_NAMES, SBTI_CONFIG } = require('../config/constants');

/**
 * Calculate user's 15-dimension vector from test answers
 * 
 * Logic (matching sbti_core_rev1905.py):
 * 1. Each answer has a raw score (1, 2, or 3)
 * 2. All questions are forward-scored (L→M→H = 1→2→3, no reverse)
 * 3. SUM scores per dimension (each dim has 2 questions → sum range 2-6)
 * 4. Convert sum to level: ≤3 → L, ≤4 → M, ≥5 → H
 * 5. Convert level to numeric: L=1, M=2, H=3
 * 
 * @param {Array} answers - [{questionId, selectedOptionIndex, score}]
 * @param {Array} questions - Question documents from DB
 * @returns {Object} { userVector: number[], bonusDrink: number }
 */
function calculateUserVector(answers, questions) {
  // Initialize: 15 dimensions, each collects summed scores
  const dimSums = new Array(15).fill(0);
  let bonusDrink = 1; // default

  answers.forEach(answer => {
    const question = questions.find(
      q => q._id.toString() === answer.questionId.toString()
    );
    if (!question) return;

    const dimIndex = question.dimensionIndex;

    if (dimIndex >= 0) {
      // All questions are forward-scored, use score directly
      dimSums[dimIndex] += answer.score;
    } else {
      // Bonus question (dimensionIndex === -1)
      bonusDrink = answer.score;
    }
  });

  // Convert summed scores to levels, then to numeric values (1, 2, 3)
  const userVector = dimSums.map(sum => {
    const level = sumToLevel(sum);
    return levelToNum(level);
  });

  return { userVector, bonusDrink };
}

/**
 * Convert summed score (2-6 for 2 questions scoring 1-3) to level code
 * Reference: sbti_core_rev1905.py sum_to_level()
 * 
 * @param {number} score - Sum of scores for a dimension (2-6)
 * @returns {string} 'L', 'M', or 'H'
 */
function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score <= 4) return 'M';
  return 'H'; // score >= 5
}

/**
 * Convert level code to numeric value
 * @param {string} level - 'L', 'M', or 'H'
 * @returns {number} 1, 2, or 3
 */
function levelToNum(level) {
  return { L: 1, M: 2, H: 3 }[level];
}

/**
 * Match user vector against 25 standard archetypes using Manhattan distance
 * 
 * IMPORTANT: DRUNK and HHHH are EXCLUDED from normal matching.
 * - DRUNK: Hidden archetype, triggered only by bonus question (Layer 1)
 * - HHHH:  Fallback archetype, used when no match scores >= 60% (Layer 2)
 * 
 * Reference: sbti_core_rev1905.py ArchetypeMatching.match()
 * 
 * Method:
 * 1. Calculate Manhattan distance (sum of absolute differences)
 * 2. Count exact dimension matches (difference == 0)
 * 3. Linear similarity: max(0, round((1 - distance/30) * 100))
 * 4. Sort by: distance ASC, exact DESC, score DESC
 * 
 * @param {number[]} userVector - 15-dimension vector (1, 2, or 3)
 * @returns {Object} { results: Array, confidence: string }
 */
function matchArchetypes(userVector) {
  // Exclude DRUNK (hidden) and HHHH (fallback) from normal matching pool
  const EXCLUDED = ['DRUNK', 'HHHH'];
  const archetypeNames = Object.keys(ARCHETYPES).filter(n => !EXCLUDED.includes(n));
  const results = [];

  archetypeNames.forEach(name => {
    const arch = ARCHETYPES[name];
    const archVector = arch.vector;

    // Manhattan distance (sum of absolute differences)
    let distance = 0;
    let exact = 0;

    for (let i = 0; i < userVector.length; i++) {
      const diff = Math.abs(userVector[i] - archVector[i]);
      distance += diff;
      if (diff === 0) exact++;
    }

    // Linear similarity: closer = higher (max distance = 30 for 15 dims × 2 max diff)
    const score = Math.max(0, Math.round((1 - distance / SBTI_CONFIG.maxDistance) * 100));

    results.push({
      type: name,
      code: arch.code,
      score,
      distance,
      exact,
      desc: arch.desc,
    });
  });

  // Three-level sort (reference: engine.mjs / sbti_core_rev1905.py)
  // Primary: distance ascending, Secondary: exact descending, Tertiary: score descending
  results.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (a.exact !== b.exact) return b.exact - a.exact;
    return b.score - a.score;
  });

  // Calculate confidence based on gap between top 2 scores
  const topScore = results[0].score;
  const secondScore = results.length > 1 ? results[1].score : 0;
  const gap = topScore - secondScore;

  let confidence;
  if (gap > 15) {
    confidence = 'HIGH';
  } else if (gap > 5) {
    confidence = 'MEDIUM';
  } else {
    confidence = 'LOW';
  }

  return { results, confidence };
}

/**
 * Build a special archetype result entry (for DRUNK / HHHH overrides)
 * @param {string} code - Archetype code ('DRUNK' or 'HHHH')
 * @param {number[]} userVector - User's 15-dimension vector
 * @returns {Object} Match result entry
 */
function buildSpecialResult(code, userVector) {
  const arch = ARCHETYPES[code];
  const archVector = arch.vector;

  let distance = 0;
  let exact = 0;
  for (let i = 0; i < userVector.length; i++) {
    const diff = Math.abs(userVector[i] - archVector[i]);
    distance += diff;
    if (diff === 0) exact++;
  }

  const score = Math.max(0, Math.round((1 - distance / SBTI_CONFIG.maxDistance) * 100));

  return {
    type: code,
    code: arch.code,
    score,
    distance,
    exact,
    desc: arch.desc,
  };
}

/**
 * Analyze user vector by dimension groups
 * 
 * Groups: Bản Thân (0,1,2), Cảm Xúc (3,4,5), Thái Độ (6,7,8),
 *         Hành Động (9,10,11), Xã Hội (12,13,14)
 * 
 * With 1/2/3 scale:
 *   Level: avg >= 2.33 → HIGH, >= 1.33 → MEDIUM, else LOW
 *   Score: (avg - 1) * 50 → maps 1-3 to 0-100
 * 
 * @param {number[]} userVector - 15-dimension vector (1, 2, or 3)
 * @returns {Object} Analysis by group
 */
function analyzeDimensions(userVector) {
  const analysis = {};

  for (const [groupName, indices] of Object.entries(DIMENSION_GROUPS)) {
    const groupScores = indices.map(i => userVector[i]);
    const avg = groupScores.reduce((a, b) => a + b, 0) / groupScores.length;

    let level;
    if (avg >= 2.33) {
      level = 'HIGH';
    } else if (avg >= 1.33) {
      level = 'MEDIUM';
    } else {
      level = 'LOW';
    }

    analysis[groupName] = {
      level,
      score: parseFloat(((avg - 1) * 50).toFixed(1)), // Map 1-3 scale to 0-100
      raw: groupScores,
    };
  }

  return analysis;
}

/**
 * Generate DNA string (L/M/H) from user vector
 * 
 * With 1/2/3 scale:
 *   >= 2.33 → H, >= 1.33 → M, else → L
 * 
 * Since user vector values are always integers (1, 2, 3):
 *   1 → L, 2 → M, 3 → H
 * 
 * @param {number[]} userVector - 15-dimension vector (1, 2, or 3)
 * @returns {string} 15-character DNA string
 */
function generateDNA(userVector) {
  return userVector.map(x => {
    if (x >= 2.33) return 'H';
    if (x >= 1.33) return 'M';
    return 'L';
  }).join('');
}

module.exports = {
  calculateUserVector,
  sumToLevel,
  levelToNum,
  matchArchetypes,
  buildSpecialResult,
  analyzeDimensions,
  generateDNA,
};
