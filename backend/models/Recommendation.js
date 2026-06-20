const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recommendations must belong to a user'],
    },
    aiResponse: {
      type: String,
      required: [true, 'AI response content cannot be empty'],
    },
    // Used to automatically evict caches in MongoDB after a duration (TTL index)
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // 86400 seconds = 24 hours
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recommendation', RecommendationSchema);
