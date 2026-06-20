const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserBudget,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// Public Route: User Registration
router.post('/register', validate(registerSchema), registerUser);

// Public Route: User Login
router.post('/login', validate(loginSchema), loginUser);

// Protected Route: Retrieve Auth User Profile Context details
router.get('/profile', protect, getUserProfile);

// Protected Route: Update Monthly Carbon Target Goal limit
router.put('/budget', protect, updateUserBudget);

module.exports = router;
