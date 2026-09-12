/**
 * Admin Authorization Middleware
 * 
 * Must be used AFTER authMiddleware (which sets req.user from JWT).
 * Checks if the authenticated user has admin role.
 */
function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}

module.exports = { adminMiddleware };
