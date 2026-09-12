const {
  matchArchetypes,
  buildSpecialResult,
  analyzeDimensions,
  generateDNA,
  sumToLevel,
  levelToNum,
} = require('../../services/sbtiCalculator');
const { ARCHETYPES } = require('../../config/constants');
const TestFactory = require('../../services/TestFactory');

describe('SBTI Calculator & Scoring Logic Unit Tests', () => {
  describe('Helper Functions', () => {
    it('sumToLevel should convert sum scores correctly', () => {
      expect(sumToLevel(2)).toBe('L');
      expect(sumToLevel(3)).toBe('L');
      expect(sumToLevel(4)).toBe('M');
      expect(sumToLevel(5)).toBe('H');
      expect(sumToLevel(6)).toBe('H');
    });

    it('levelToNum should map level codes to numbers', () => {
      expect(levelToNum('L')).toBe(1);
      expect(levelToNum('M')).toBe(2);
      expect(levelToNum('H')).toBe(3);
    });

    it('generateDNA should generate 15-character L/M/H string', () => {
      const vector = [1, 2, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 1, 2, 3];
      const dna = generateDNA(vector);
      expect(dna).toBe('LMHMLHMMHLMHLMH');
    });
  });

  describe('Archetype Matching Pool', () => {
    it('should exclude DRUNK and HHHH from normal matching pool of 25 archetypes', () => {
      const middleVector = Array(15).fill(2);
      const { results } = matchArchetypes(middleVector);
      expect(results.length).toBe(25);
      expect(results.some(r => r.code === 'DRUNK')).toBe(false);
      expect(results.some(r => r.code === 'HHHH')).toBe(false);
    });

    it('should match CTRL exact vector with 100% score and 0 distance', () => {
      const ctrlVector = [...ARCHETYPES.CTRL.vector];
      const { results } = matchArchetypes(ctrlVector);
      expect(results[0].code).toBe('CTRL');
      expect(results[0].score).toBe(100);
      expect(results[0].distance).toBe(0);
      expect(results[0].exact).toBe(15);
    });

    it('should match all 25 standard archetypes at 100% exact match', () => {
      const standardArchetypes = Object.keys(ARCHETYPES).filter(n => n !== 'DRUNK' && n !== 'HHHH');
      standardArchetypes.forEach(name => {
        const v = [...ARCHETYPES[name].vector];
        const { results } = matchArchetypes(v);
        expect(results[0].code).toBe(name);
        expect(results[0].score).toBe(100);
        expect(results[0].distance).toBe(0);
      });
    });
  });

  describe('Special Results & Overrides', () => {
    it('buildSpecialResult should create DRUNK entry', () => {
      const drunkUser = Array(15).fill(3);
      const drunkResult = buildSpecialResult('DRUNK', drunkUser);
      expect(drunkResult.code).toBe('DRUNK');
      expect(drunkResult.score).toBe(100);
      expect(drunkResult.distance).toBe(0);
    });

    it('buildSpecialResult should create HHHH entry', () => {
      const middleVector = Array(15).fill(2);
      const hhhhResult = buildSpecialResult('HHHH', middleVector);
      expect(hhhhResult.code).toBe('HHHH');
      expect(hhhhResult.score).toBe(100);
      expect(hhhhResult.distance).toBe(0);
    });
  });

  describe('Dimension Analysis', () => {
    it('should analyze vector into 5 dimension groups', () => {
      const vector = [1, 2, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 1, 2, 3];
      const analysis = analyzeDimensions(vector);

      expect(analysis['Bản Thân']).toBeDefined();
      expect(analysis['Cảm Xúc']).toBeDefined();
      expect(analysis['Thái Độ']).toBeDefined();
      expect(analysis['Hành Động']).toBeDefined();
      expect(analysis['Xã Hội']).toBeDefined();

      expect(analysis['Bản Thân'].raw).toEqual([1, 2, 3]);
      expect(analysis['Bản Thân'].level).toBe('MEDIUM');
      expect(analysis['Bản Thân'].score).toBe(50);
    });
  });

  describe('TestFactory & 2-Layer Logic', () => {
    it('should return SBTITestDefinition instance from TestFactory', () => {
      const testDef = TestFactory.getTest('SBTI');
      expect(testDef).toBeDefined();
      expect(testDef.getTestMetadata().testType).toBe('SBTI');
    });

    it('should trigger DRUNK_OVERRIDE when bonusDrink === 1', () => {
      const testDef = TestFactory.getTest('SBTI');
      // Create mock questions & answers
      const mockQuestions = Array.from({ length: 15 }, (_, i) => ({
        _id: `q${i}`,
        dimensionIndex: i,
      }));
      mockQuestions.push({ _id: 'bonus_q', dimensionIndex: -1, isBonus: true });

      const mockAnswers = Array.from({ length: 15 }, (_, i) => ({
        questionId: `q${i}`,
        score: 2,
      }));
      mockAnswers.push({ questionId: 'bonus_q', score: 1 }); // 1 = Thánh Say

      const result = testDef.calculateFullResult(mockAnswers, mockQuestions);
      expect(result.method).toBe('DRUNK_OVERRIDE');
      expect(result.mainType.code).toBe('DRUNK');
      expect(result.confidence).toBe('HIGH');
    });
  });
});
