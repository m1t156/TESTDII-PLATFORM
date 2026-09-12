/**
 * Standardized API Response Helper
 * Provides consistent JSON response structure across all backend endpoints.
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object|Array|null} data - Payload data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function successResponse(res, message, data = null, statusCode = 200) {
  const payload = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    // If data is an object with existing properties, merge or attach as data
    if (typeof data === 'object' && !Array.isArray(data)) {
      Object.assign(payload, data);
    } else {
      payload.data = data;
    }
  }

  return res.status(statusCode).json(payload);
}

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object|Array|null} details - Additional error details
 */
function errorResponse(res, message, statusCode = 400, details = null) {
  const payload = {
    success: false,
    error: message,
  };

  if (details) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse,
};
