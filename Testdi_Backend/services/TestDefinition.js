/**
 * Abstract base class for Test Definitions
 * Extensible pattern for adding new test types (MBTI, DiSC, etc.)
 */
class TestDefinition {
  constructor() {
    if (new.target === TestDefinition) {
      throw new TypeError('Cannot instantiate abstract class TestDefinition');
    }
  }

  /**
   * Get test metadata
   */
  getTestMetadata() {
    throw new Error('getTestMetadata() must be implemented');
  }

  /**
   * Get all dimensions for this test
   */
  getDimensions() {
    throw new Error('getDimensions() must be implemented');
  }

  /**
   * Get all measures (sub-dimensions)
   */
  getMeasures() {
    throw new Error('getMeasures() must be implemented');
  }

  /**
   * Get all questions query filter
   */
  getQuestionsFilter() {
    throw new Error('getQuestionsFilter() must be implemented');
  }

  /**
   * Calculate result DNA from answers
   * @param {Array} answers - User's answers
   * @param {Array} questions - All questions for this test
   * @returns {String} Result DNA pattern
   */
  calculateResultDNA(answers, questions) {
    throw new Error('calculateResultDNA() must be implemented');
  }

  /**
   * Match DNA with archetypes
   * @param {String} dna - Calculated DNA
   * @param {Array} archetypes - Available archetypes
   * @returns {Object} {archetype, similarityScore}
   */
  matchWithArchetypes(dna, archetypes) {
    throw new Error('matchWithArchetypes() must be implemented');
  }

  /**
   * Get total questions expected
   */
  getTotalQuestions() {
    throw new Error('getTotalQuestions() must be implemented');
  }

  /**
   * Validate answers format
   */
  validateAnswers(answers) {
    throw new Error('validateAnswers() must be implemented');
  }
}

module.exports = TestDefinition;
