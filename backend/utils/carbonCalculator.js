/**
 * Emission factors representing kilograms of CO2 equivalent (kg CO2e) per unit.
 * Standards derived from average IPCC (Intergovernmental Panel on Climate Change) & EPA metrics.
 */
const EMISSION_FACTORS = {
  transportation: {
    petrol_car: 0.180,  // kg CO2e per km
    diesel_car: 0.171,  // kg CO2e per km
    hybrid_car: 0.104,  // kg CO2e per km
    electric_car: 0.047, // kg CO2e per km (based on average grid power emissions)
    bus: 0.080,          // kg CO2e per km
    train: 0.040,        // kg CO2e per km
    flight: 0.254,       // kg CO2e per km (average short/long haul mix)
    none: 0,
  },
  energy: {
    electricity: 0.450, // kg CO2e per kWh
    gas: 2.030,         // kg CO2e per cubic meter
    ac_hour: 1.200,     // kg CO2e per hour of use
    heater_hour: 1.500, // kg CO2e per hour of use
  },
  diet: {
    vegan: 0.400,       // kg CO2e per serving
    vegetarian: 0.800,  // kg CO2e per serving
    pescatarian: 1.200, // kg CO2e per serving
    low_meat: 1.600,    // kg CO2e per serving
    high_meat: 2.500,   // kg CO2e per serving
  },
  waste: {
    base_kg: 0.500,     // kg CO2e per kg of general trash
    recycle_discount: 0.300, // 70% discount rate if materials are recycled (emits 30% of base value)
  },
  shopping: {
    clothes: 15.000,     // kg CO2e per clothing item
    electronics: 80.000, // kg CO2e per electronics item
    household: 10.000,   // kg CO2e per household item
  }
};

/**
 * Calculates carbon footprint based on activity logging metrics.
 * @param {string} category - 'transportation', 'energy', 'diet', 'waste', or 'shopping'
 * @param {object} details - category-specific quantities and attributes
 * @returns {number} The computed carbon footprint in kg CO2e (rounded to 3 decimal places)
 */
const calculateCarbonFootprint = (category, details = {}) => {
  let footprint = 0;

  switch (category) {
    case 'transportation': {
      const { vehicleType, distanceKm = 0 } = details;
      const factor = EMISSION_FACTORS.transportation[vehicleType] || 0;
      footprint = distanceKm * factor;
      break;
    }
    case 'energy': {
      const { electricityKwh = 0, gasCubicMeters = 0, acHours = 0, heaterHours = 0 } = details;
      const electricityFootprint = electricityKwh * EMISSION_FACTORS.energy.electricity;
      const gasFootprint = gasCubicMeters * EMISSION_FACTORS.energy.gas;
      const acFootprint = acHours * EMISSION_FACTORS.energy.ac_hour;
      const heaterFootprint = heaterHours * EMISSION_FACTORS.energy.heater_hour;
      footprint = electricityFootprint + gasFootprint + acFootprint + heaterFootprint;
      break;
    }
    case 'diet': {
      const { mealType, servings = 0 } = details;
      const factor = EMISSION_FACTORS.diet[mealType] || 0;
      footprint = servings * factor;
      break;
    }
    case 'waste': {
      const { wasteKg = 0, recycled = false } = details;
      const factor = recycled 
        ? EMISSION_FACTORS.waste.base_kg * EMISSION_FACTORS.waste.recycle_discount 
        : EMISSION_FACTORS.waste.base_kg;
      footprint = wasteKg * factor;
      break;
    }
    case 'shopping': {
      const { shoppingType, itemsCount = 0 } = details;
      const factor = EMISSION_FACTORS.shopping[shoppingType] || 0;
      footprint = itemsCount * factor;
      break;
    }
    default:
      footprint = 0;
  }

  // Round off float numbers to maintain data consistency
  return Math.round(footprint * 1000) / 1000;
};

module.exports = {
  calculateCarbonFootprint,
  EMISSION_FACTORS
};
