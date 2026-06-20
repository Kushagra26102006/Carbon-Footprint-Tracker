const { z } = require('zod');

// Zod Schema to validate Activity Logging API parameters
const createLogSchema = z.object({
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Date must be a valid ISO-8601 string or date value',
    }),
  category: z.enum(['transportation', 'energy', 'diet', 'waste', 'shopping'], {
    required_error: 'Category is required and must be transportation, energy, diet, waste, or shopping',
  }),
  details: z.object({
    // Transportation Fields
    vehicleType: z.enum(['diesel_car', 'petrol_car', 'hybrid_car', 'electric_car', 'bus', 'train', 'flight', 'none']).optional(),
    distanceKm: z.number().nonnegative('Distance must be a non-negative number').optional(),

    // Energy Fields
    electricityKwh: z.number().nonnegative('Electricity usage must be a non-negative number').optional(),
    gasCubicMeters: z.number().nonnegative('Gas usage must be a non-negative number').optional(),
    acHours: z.number().nonnegative('AC usage hours must be a non-negative number').optional(),
    heaterHours: z.number().nonnegative('Heater usage hours must be a non-negative number').optional(),

    // Diet Fields
    mealType: z.enum(['vegan', 'vegetarian', 'pescatarian', 'high_meat', 'low_meat']).optional(),
    servings: z.number().nonnegative('Servings must be a non-negative number').optional(),

    // Waste Fields
    wasteKg: z.number().nonnegative('Waste weight must be a non-negative number').optional(),
    recycled: z.boolean().optional().default(false),

    // Shopping Fields
    shoppingType: z.enum(['clothes', 'electronics', 'household']).optional(),
    itemsCount: z.number().nonnegative('Items count must be a non-negative number').optional(),
  }, { required_error: 'Details object is required' }),
}).superRefine((data, ctx) => {
  const { category, details } = data;

  if (category === 'transportation') {
    if (!details.vehicleType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.vehicleType'],
        message: 'vehicleType is required when category is transportation',
      });
    }
    if (details.distanceKm === undefined || details.distanceKm === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.distanceKm'],
        message: 'distanceKm is required when category is transportation',
      });
    }
  }

  if (category === 'energy') {
    if (
      details.electricityKwh === undefined && 
      details.gasCubicMeters === undefined && 
      details.acHours === undefined && 
      details.heaterHours === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details'],
        message: 'At least one utility field (electricityKwh, gasCubicMeters, acHours, or heaterHours) must be specified for energy category',
      });
    }
  }

  if (category === 'diet') {
    if (!details.mealType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.mealType'],
        message: 'mealType is required when category is diet',
      });
    }
    if (details.servings === undefined || details.servings === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.servings'],
        message: 'servings count is required when category is diet',
      });
    }
  }

  if (category === 'waste') {
    if (details.wasteKg === undefined || details.wasteKg === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.wasteKg'],
        message: 'wasteKg is required when category is waste',
      });
    }
  }

  if (category === 'shopping') {
    if (!details.shoppingType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.shoppingType'],
        message: 'shoppingType is required when category is shopping',
      });
    }
    if (details.itemsCount === undefined || details.itemsCount === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['details.itemsCount'],
        message: 'itemsCount is required when category is shopping',
      });
    }
  }
});

module.exports = {
  createLogSchema,
};
