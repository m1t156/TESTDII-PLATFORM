const crypto = require('crypto');
const PageView = require('../models/PageView');

/**
 * Middleware to track page views / API access
 * 
 * Logs every incoming request to PageView collection.
 * Skips health checks and static assets.
 * 
 * Usage in server.js:
 *   app.use(trackPageView);
 */
function trackPageView(req, res, next) {
  // Skip health checks, static files, and favicon
  const skipPaths = ['/api/health', '/favicon.ico'];
  if (skipPaths.some(p => req.path.startsWith(p))) {
    return next();
  }

  // Skip static file requests
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  // Hash IP for privacy (don't store raw IPs)
  const ipHash = crypto
    .createHash('sha256')
    .update(req.ip || req.connection.remoteAddress || 'unknown')
    .digest('hex')
    .substring(0, 16);

  // Extract session ID from cookie or generate from IP+UA
  const sessionId = req.cookies?.sessionId || 
    crypto.createHash('sha256')
      .update(`${req.ip}${req.headers['user-agent'] || ''}`)
      .digest('hex')
      .substring(0, 24);

  // Fire and forget — don't block the response
  PageView.create({
    path: req.path,
    method: req.method,
    ipHash,
    userAgent: (req.headers['user-agent'] || '').substring(0, 200),
    userId: req.user?.userId || undefined,
    guestId: req.guestId || req.query?.guestId || undefined,
    sessionId,
    referrer: (req.headers.referer || '').substring(0, 200),
  }).catch(err => {
    // Silently fail — tracking should never break the app
    if (process.env.NODE_ENV === 'development') {
      console.error('PageView tracking error:', err.message);
    }
  });

  next();
}

module.exports = trackPageView;
