const SBTITestDefinition = require('./SBTITestDefinition');

/**
 * Factory pattern for getting test definitions
 * Allows easy extension for new test types (MBTI, DiSC, etc.)
 */
class TestFactory {
  static getTest(testType) {
    switch (testType) {
      case 'SBTI':
        return new SBTITestDefinition();
      // Future: add more test types
      // case 'MBTI':
      //   return new MBTITestDefinition();
      // case 'DISC':
      //   return new DISCTestDefinition();
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }
  }

  static getAvailableTests() {
    return ['SBTI']; // Add more as they're implemented
  }

  static isTestSupported(testType) {
    return this.getAvailableTests().includes(testType);
  }
}

module.exports = TestFactory;
