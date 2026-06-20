const mongoose = require('mongoose');

/**
 * Establishes connection to the MongoDB database using URI from environment configuration.
 * Gracefully logs success or terminates process on structural network failures.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Failure Error: ${error.message}`);
    // Exit application process with failure status code
    process.exit(1);
  }
};

module.exports = connectDB;
