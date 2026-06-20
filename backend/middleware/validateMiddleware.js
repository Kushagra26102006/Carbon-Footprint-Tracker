/**
 * Higher-order middleware function to validate incoming request body schemas using Zod.
 * Intercepts errors and returns standardized JSON error responses.
 * @param {import('zod').ZodSchema} schema - The Zod schema definitions object
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Parse request body. This will throw an error if parameters do not match schema.
    schema.parse(req.body);
    next();
  } catch (error) {
    // Check if error comes from Zod parsing validation
    if (error.errors) {
      const errorDetails = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Invalid request payload content parameters',
        errors: errorDetails,
      });
    }

    next(error);
  }
};

module.exports = validate;
