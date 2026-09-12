const {
  validateEmail,
  validatePassword,
  isValidMeasure,
  isValidDimension,
  isValidDNA,
} = require('../../utils/validator');

describe('Validator Utility Unit Tests', () => {
  describe('Email & Password Validation', () => {
    it('should validate valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('admin@testdi.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('should validate password strength (min 6 chars, uppercase, lowercase, number)', () => {
      expect(validatePassword('Admin123!')).toBe(true);
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('alllowercase')).toBe(false);
      expect(validatePassword('ALLUPPERCASE')).toBe(false);
      expect(validatePassword('NoNumbersHere')).toBe(false);
    });
  });

  describe('SBTI Measure & Dimension Validation', () => {
    it('should validate measures (S1..SO3)', () => {
      expect(isValidMeasure('S1')).toBe(true);
      expect(isValidMeasure('AC3')).toBe(true);
      expect(isValidMeasure('INVALID')).toBe(false);
    });

    it('should validate dimensions (SELF, EMOTIONS, ATTITUDE, ACTION, SOCIAL)', () => {
      expect(isValidDimension('SELF')).toBe(true);
      expect(isValidDimension('ACTION')).toBe(true);
      expect(isValidDimension('UNKNOWN')).toBe(false);
    });

    it('should validate 15-character L/M/H DNA string', () => {
      expect(isValidDNA('LMHMLHMMHLMHLMH')).toBe(true);
      expect(isValidDNA('SHORT')).toBe(false);
      expect(isValidDNA('LMHMLHMMHLMHLMX')).toBe(false); // X is invalid
    });
  });
});
