const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { calculateCarbonFootprint } = require('../utils/carbonCalculator');

/**
 * Checks and awards gamified badges dynamically based on user logging behavior.
 * @param {string} userId - User identifier
 */
const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const userLogs = await ActivityLog.find({ userId });
    const userBadges = user.badges.map((b) => b.title);
    const newBadges = [];

    // Helper functions for achievements evaluation
    const hasLogOfCategory = (category) => userLogs.some((log) => log.category === category);
    
    // 1. First Step Badge
    if (userLogs.length >= 1 && !userBadges.includes('First Step')) {
      newBadges.push({
        title: 'First Step',
        description: 'Logged your very first carbon emission footprint activity!',
      });
    }

    // 2. Green Commuter Badge (If logged public transit or electric cars)
    const hasTransitLogs = userLogs.some(
      (log) =>
        log.category === 'transportation' &&
        ['electric_car', 'bus', 'train'].includes(log.details.vehicleType)
    );
    if (hasTransitLogs && !userBadges.includes('Green Commuter')) {
      newBadges.push({
        title: 'Green Commuter',
        description: 'Opted for eco-friendly public transit or electric vehicle alternatives.',
      });
    }

    // 3. Plant-Based Hero Badge (Vegan/Vegetarian diets)
    const hasGreenDiets = userLogs.some(
      (log) =>
        log.category === 'diet' &&
        ['vegan', 'vegetarian'].includes(log.details.mealType)
    );
    if (hasGreenDiets && !userBadges.includes('Plant-Based Hero')) {
      newBadges.push({
        title: 'Plant-Based Hero',
        description: 'Logged green eating options to reduce agricultural emissions footprint.',
      });
    }

    // 4. Zero Waste Champion Badge (Logged recycling activity)
    const hasRecycledLogs = userLogs.some(
      (log) => log.category === 'waste' && log.details.recycled === true
    );
    if (hasRecycledLogs && !userBadges.includes('Zero Waste Champion')) {
      newBadges.push({
        title: 'Zero Waste Champion',
        description: 'Reduced landfill deposits by actively recycling your household waste.',
      });
    }

    // If new badges have been unlocked, push them to database document
    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
      await user.save();
      console.log(`Badge Unlocked for user ${user.name}:`, newBadges.map((b) => b.title));
    }
  } catch (error) {
    console.error('Error executing Badge award validation checks:', error.message);
  }
};

/**
 * @desc    Create a new activity log
 * @route   POST /api/logs
 * @access  Private
 */
const createLog = async (req, res, next) => {
  const { date, category, details } = req.body;

  try {
    // Math engine calculations calculation
    const calculatedCarbon = calculateCarbonFootprint(category, details);

    const log = await ActivityLog.create({
      userId: req.user._id,
      date: date ? new Date(date) : undefined,
      category,
      details,
      calculatedCarbon,
    });

    // Check badges conditions
    await checkAndAwardBadges(req.user._id);

    return res.status(201).json({
      success: true,
      message: 'Carbon activity logged successfully',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user activity logs with optional date range filter
 * @route   GET /api/logs
 * @access  Private
 */
const getLogs = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    const query = { userId: req.user._id };

    // Apply date range filters if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const logs = await ActivityLog.find(query).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an activity log
 * @route   DELETE /api/logs/:id
 * @access  Private
 */
const deleteLog = async (req, res, next) => {
  try {
    const log = await ActivityLog.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log record not found or unauthorized to delete',
      });
    }

    await log.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Activity log deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get carbon footprint analytics summary and category breakdowns
 * @route   GET /api/logs/analytics
 * @access  Private
 */
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    // Summing carbon emissions category-wise
    let totalCarbon = 0;
    const byCategory = {
      transportation: 0,
      energy: 0,
      diet: 0,
      waste: 0,
    };

    logs.forEach((log) => {
      totalCarbon += log.calculatedCarbon;
      if (byCategory[log.category] !== undefined) {
        byCategory[log.category] += log.calculatedCarbon;
      }
    });

    // Formatting outputs
    return res.status(200).json({
      success: true,
      data: {
        totalCarbon: Math.round(totalCarbon * 1000) / 1000,
        monthlyBudget: user ? user.monthlyBudget : 500,
        byCategory: {
          transportation: Math.round(byCategory.transportation * 1000) / 1000,
          energy: Math.round(byCategory.energy * 1000) / 1000,
          diet: Math.round(byCategory.diet * 1000) / 1000,
          waste: Math.round(byCategory.waste * 1000) / 1000,
        },
        logsCount: logs.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLog,
  getLogs,
  deleteLog,
  getAnalyticsSummary,
};
