const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents password from leaking in standard document select queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    badges: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        unlockedAt: { type: Date, default: Date.now },
      },
    ],
    monthlyBudget: {
      type: Number,
      default: 500, // Carbon budget limit in kg CO2e
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * Mongoose Pre-save hook to hash password before writing document.
 * Only hashes password if the field is newly created or updated.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Schema Instance Method: Checks entered plain text password against database hashed password.
 * @param {string} enteredPassword - Password submitted in login request
 * @returns {Promise<boolean>} True if match, otherwise false
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
