const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT token
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} role - User's role ('user' or 'admin')
 * @param {string} expiresIn - Token expiration (default from env)
 */
function generateJWT(userId, role = 'user', expiresIn = process.env.JWT_EXPIRE || '7d') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

/**
 * Verify JWT token
 */
function verifyJWT(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate unique guest ID
 */
function generateGuestId() {
  const prefix = process.env.GUEST_ID_PREFIX || 'GUEST_';
  const randomStr = crypto.randomBytes(12).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}${timestamp}${randomStr}`;
}

/**
 * Extract token from Authorization header
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

module.exports = {
  generateJWT,
  verifyJWT,
  generateGuestId,
  extractTokenFromHeader,
};
