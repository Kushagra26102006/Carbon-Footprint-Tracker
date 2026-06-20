const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Utility function to generate JWT signing tokens
 * @param {string} id - The User Document database ID
 * @returns {string} Signed JWT token string
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Account with that email already exists',
      });
    }

    // Create User Document
    const user = await User.create({
      name,
      email,
      password, // Password hashed automatically via model pre-save hook
    });

    if (user) {
      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user registration input data',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user and explicitly select password since select: false is set in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    // Verify entered password matches database hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile data details
 * @route   GET /api/auth/profile
 * @access  Private (Requires JWT token)
 */
const getUserProfile = async (req, res, next) => {
  try {
    // req.user populated by protect auth middleware
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User profile record not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user carbon budget goals limit
 * @route   PUT /api/auth/budget
 * @access  Private (Requires JWT token)
 */
const updateUserBudget = async (req, res, next) => {
  const { monthlyBudget } = req.body;

  try {
    if (monthlyBudget === undefined || monthlyBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid carbon budget greater than 0',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { monthlyBudget },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Monthly carbon budget updated successfully',
      data: {
        monthlyBudget: user.monthlyBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserBudget,
};
