const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Express Middleware protecting routes against unauthorized requests.
 * Evaluates JWT stored inside Request authorization headers.
 */
const protect = async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header if formatted as "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Split the schema and token
      token = req.headers.authorization.split(' ')[1];

      // Decode token content using signing secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from decoded payload subject and inject reference to Request object (exclude password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user profile does not exist anymore',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error(`JWT Verification Error: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token signature',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, access token missing from header',
    });
  }
};

module.exports = { protect };
