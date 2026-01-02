const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

// OAuth routes (placeholders)
const passport = require('passport');
const { generateTokens } = require('../middleware/auth');

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/auth/login?error=google_auth_failed', session: false }),
  (req, res) => {
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    req.user.refreshToken = refreshToken;
    req.user.save();

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${accessToken}&refreshToken=${refreshToken}`);
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.FRONTEND_URL + '/auth/login?error=github_auth_failed', session: false }),
  (req, res) => {
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    req.user.refreshToken = refreshToken;
    req.user.save();

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${accessToken}&refreshToken=${refreshToken}`);
  }
);

router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;


