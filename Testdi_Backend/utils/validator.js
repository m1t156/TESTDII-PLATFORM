const validator = require('validator');

/**
 * Validate email format
 */
function validateEmail(email) {
  return validator.isEmail(email);
}

/**
 * Validate password strength
 * Min 6 characters, at least 1 uppercase, 1 lowercase, 1 number
 */
function validatePassword(password) {
  if (!password || password.length < 6) {
    return false;
  }
  // At least one uppercase, one lowercase, one number
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Sanitize user input
 */
function sanitizeString(str) {
  return validator.trim(str);
}

/**
 * Validate ObjectId format
 */
function isValidObjectId(id) {
  return validator.isMongoId(id);
}

/**
 * Validate measure code (e.g., S1, E2, AC3)
 */
function isValidMeasure(measure) {
  const validMeasures = [
    'S1', 'S2', 'S3',
    'E1', 'E2', 'E3',
    'A1', 'A2', 'A3',
    'AC1', 'AC2', 'AC3',
    'SO1', 'SO2', 'SO3',
  ];
  return validMeasures.includes(measure);
}

/**
 * Validate dimension
 */
function isValidDimension(dimension) {
  const validDimensions = ['SELF', 'EMOTIONS', 'ATTITUDE', 'ACTION', 'SOCIAL'];
  return validDimensions.includes(dimension);
}

/**
 * Validate DNA tattoo format (15 chars of L/M/H)
 */
function isValidDNA(dna) {
  if (typeof dna !== 'string' || dna.length !== 15) {
    return false;
  }
  return /^[LMH]{15}$/.test(dna);
}

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeString,
  isValidObjectId,
  isValidMeasure,
  isValidDimension,
  isValidDNA,
};
