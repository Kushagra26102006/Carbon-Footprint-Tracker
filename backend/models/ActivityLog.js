const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Log must belong to a user'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date for this activity'],
      default: Date.now,
    },
    category: {
      type: String,
      enum: {
        values: ['transportation', 'energy', 'diet', 'waste', 'shopping'],
        message: 'Category must be transportation, energy, diet, waste, or shopping',
      },
      required: [true, 'Please provide a category'],
    },
    details: {
      // Transportation Details
      vehicleType: {
        type: String,
        enum: ['diesel_car', 'petrol_car', 'hybrid_car', 'electric_car', 'bus', 'train', 'flight', 'none'],
      },
      distanceKm: {
        type: Number,
        min: [0, 'Distance cannot be negative'],
      },

      // Energy Details
      electricityKwh: {
        type: Number,
        min: [0, 'Electricity usage cannot be negative'],
      },
      gasCubicMeters: {
        type: Number,
        min: [0, 'Gas usage cannot be negative'],
      },
      acHours: {
        type: Number,
        min: [0, 'AC hours cannot be negative'],
      },
      heaterHours: {
        type: Number,
        min: [0, 'Heater hours cannot be negative'],
      },

      // Diet Details
      mealType: {
        type: String,
        enum: ['vegan', 'vegetarian', 'pescatarian', 'high_meat', 'low_meat'],
      },
      servings: {
        type: Number,
        min: [0, 'Servings cannot be negative'],
      },

      // Waste Details
      wasteKg: {
        type: Number,
        min: [0, 'Waste weight cannot be negative'],
      },
      recycled: {
        type: Boolean,
        default: false,
      },

      // Shopping Details
      shoppingType: {
        type: String,
        enum: ['clothes', 'electronics', 'household'],
      },
      itemsCount: {
        type: Number,
        min: [0, 'Items count cannot be negative'],
      },
    },
    calculatedCarbon: {
      type: Number,
      required: [true, 'Calculated carbon footprint is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Optimize data queries filtering by user scope and chronological order
ActivityLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
