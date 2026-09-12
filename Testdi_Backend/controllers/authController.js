const User = require('../models/User');
const { generateJWT, generateGuestId } = require('../utils/tokenGenerator');
const { validateEmail, validatePassword } = require('../utils/validator');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Register new user (local method)
 */
async function register(req, res, next) {
  try {
    const { email, username, password, passwordConfirm } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: ERROR_MESSAGES.INVALID_EMAIL });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters with uppercase, lowercase, and numbers',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: ERROR_MESSAGES.USER_EXISTS });
    }

    // Create user
    const user = new User({
      email,
      username: username || email.split('@')[0],
      password,
      loginMethod: 'local',
      isGuest: false,
    });

    await user.save();

    // Generate JWT token (includes role)
    const token = generateJWT(user._id, user.role);

    res.status(201).json({
      message: SUCCESS_MESSAGES.USER_CREATED,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user (local method)
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    // Google-only users can't login with password
    if (user.loginMethod === 'google' && !user.password) {
      return res.status(400).json({
        error: 'This account uses Google login. Please login with Google.',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: ERROR_MESSAGES.INVALID_PASSWORD });
    }

    // Generate JWT token (includes role)
    const token = generateJWT(user._id, user.role);

    res.json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Google OAuth login
 * 
 * Frontend sends Google ID token (from Google Sign-In SDK).
 * Backend verifies the token, finds or creates user, returns JWT.
 * 
 * Flow:
 * 1. Frontend: User clicks "Login with Google" → gets Google ID token
 * 2. Frontend: POST /api/auth/google { idToken: "..." }
 * 3. Backend: Verify token with Google → extract email, name, picture
 * 4. Backend: Find existing user by googleId or email, or create new
 * 5. Backend: Return JWT token
 */
async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify the Google ID token
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Google account must have an email' });
    }

    // Find existing user by googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Link Google account if user exists by email but not googleId
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        if (!user.loginMethod || user.loginMethod === 'local') {
          user.loginMethod = 'google';
        }
        user.updatedAt = new Date();
        await user.save();
      }
    } else {
      // Create new user from Google info
      user = new User({
        email,
        username: name || email.split('@')[0],
        googleId,
        avatar: picture,
        loginMethod: 'google',
        role: 'user',
        isGuest: false,
      });
      await user.save();
    }

    // Generate JWT token (includes role)
    const token = generateJWT(user._id, user.role);

    res.json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generate guest ID for anonymous users
 */
function generateGuest(req, res, next) {
  try {
    const guestId = generateGuestId();

    res.json({
      message: 'Guest ID generated successfully',
      guestId,
      isGuest: true,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 */
function logout(req, res, next) {
  try {
    // JWT tokens are stateless, so logout is mainly frontend cleanup
    // But we can return a response confirming logout
    res.json({ message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user info
 */
async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  generateGuest,
  logout,
  getCurrentUser,
};
