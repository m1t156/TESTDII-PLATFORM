const { verifyJWT, extractTokenFromHeader } = require('../utils/tokenGenerator');
const { ERROR_MESSAGES } = require('../config/constants');

/**
 * Middleware to verify JWT token
 * Adds userId to req.user
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
    }

    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }
}

/**
 * Middleware to handle guest access
 * Verifies guestId from query or body
 */
function guestMiddleware(req, res, next) {
  const guestId = req.query.guestId || req.body.guestId;

  if (!guestId) {
    return res.status(400).json({ error: 'Guest ID is required' });
  }

  req.guestId = guestId;
  next();
}

/**
 * Middleware to handle both auth and guest
 * User can be either authenticated or guest
 */
function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyJWT(token);
      req.user = decoded;
      return next();
    }

    // Fall back to guest ID
    const guestId = req.query.guestId || req.body.guestId;
    if (guestId) {
      req.guestId = guestId;
      return next();
    }

    return res.status(401).json({ error: 'Authentication or guest ID required' });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = {
  authMiddleware,
  guestMiddleware,
  optionalAuthMiddleware,
};
