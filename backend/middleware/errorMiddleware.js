/**
 * Global Express error handling middleware.
 * Catches syntax errors, Mongoose exceptions, and runtime issues.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log runtime error details to server console
  console.error('Captured Runtime Error:', err);

  // Mongoose Bad ObjectId Cast Error
  if (err.name === 'CastError') {
    const message = `Resource not found with requested ID: ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Mongoose Duplicate Primary/Unique Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field '${field}'. That account already exists.`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Mongoose Schema Validation Errors
  if (err.name === 'ValidationError') {
    const errorsList = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Database validation checks failed',
      errors: errorsList,
    });
  }

  // Custom fallback for uncaught 500 server errors
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error encountered',
  });
};

module.exports = errorHandler;
