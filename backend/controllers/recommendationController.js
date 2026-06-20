const { GoogleGenerativeAI } = require('@google/generative-ai');
const ActivityLog = require('../models/ActivityLog');
const Recommendation = require('../models/Recommendation');

/**
 * Compiles a structured, static recommendation guide based on user logging patterns.
 * Used as a robust fallback when GEMINI_API_KEY is not defined.
 * @param {Array} logs - User activity log documents list
 * @returns {string} Markdown formatted guidance advice
 */
const generateStaticRecommendations = (logs) => {
  let transportCarbon = 0;
  let energyCarbon = 0;
  let dietCarbon = 0;
  let wasteCarbon = 0;

  logs.forEach((log) => {
    if (log.category === 'transportation') transportCarbon += log.calculatedCarbon;
    if (log.category === 'energy') energyCarbon += log.calculatedCarbon;
    if (log.category === 'diet') dietCarbon += log.calculatedCarbon;
    if (log.category === 'waste') wasteCarbon += log.calculatedCarbon;
  });

  const total = transportCarbon + energyCarbon + dietCarbon + wasteCarbon;

  if (total === 0) {
    return `### Welcome to EcoTrack! 🌿
    
To generate personalized sustainability recommendations, please start logging your daily habits under the **Log Activity** page:
1. Record your commutes (driving, public transit).
2. Input your utility electricity (kWh) consumption.
3. Log daily meals to monitor dietary footprint.`;
  }

  // Identify highest emission category
  const categories = [
    { name: 'Transportation', value: transportCarbon },
    { name: 'Utilities/Energy', value: energyCarbon },
    { name: 'Dietary Habits', value: dietCarbon },
    { name: 'Waste Production', value: wasteCarbon },
  ];
  categories.sort((a, b) => b.value - a.value);
  const highest = categories[0];

  let recommendationMarkdown = `## EcoTrack Sustainability Audit 📊

Based on your weekly activity data, your total logged emissions are **${total.toFixed(2)} kg CO2e**.
Your primary source of emissions is **${highest.name}** at **${highest.value.toFixed(2)} kg CO2e** (${((highest.value / total) * 100).toFixed(1)}% of your footprint).

Here are 3 concrete, personalized actions you can take this week to reduce your footprint:

`;

  if (highest.name === 'Transportation') {
    recommendationMarkdown += `1. **Active Commuting**: For trips shorter than 2 km, try walking or cycling. This emits 0 kg CO2e and improves health!
2. **Transit Alternatives**: Replace a single car drive with public transport. Utilizing buses or trains reduces transportation footprint by roughly 50-70%.
3. **Eco-Driving Habits**: Maintain correct tire inflation pressure and remove excess weight. This can improve vehicle fuel efficiency by up to 3%.`;
  } else if (highest.name === 'Utilities/Energy') {
    recommendationMarkdown += `1. **Power Off Standby**: Turn off electronics and chargers at the wall outlet when not in use. "Vampire power" accounts for up to 10% of standard home electricity bills.
2. **Thermostat Adjustment**: Adjust your thermostat by just 1°C (cooler in winter, warmer in summer) to save roughly 5-10% on HVAC electricity requirements.
3. **LED Upgrade**: Swap out old incandescent light bulbs for LEDs, which use up to 80% less power and last 25 times longer.`;
  } else if (highest.name === 'Dietary Habits') {
    recommendationMarkdown += `1. **Meat-Free Challenge**: Try replacing beef or lamb meals with chicken, beans, or tofu once or twice a week. Plant-based meals have an emissions footprint that is 80% lower than high-meat alternatives.
2. **Minimize Food Waste**: Plan meals in advance to avoid food spoiling. Food waste decaying in landfills represents a major source of global methane emissions.
3. **Eat Local & Seasonal**: Transporting food over long distances adds to global emissions. Purchase local, seasonal ingredients when possible.`;
  } else {
    recommendationMarkdown += `1. **Improve Recycling Practices**: Audit your trash. Ensure plastics, glass, paper, and metal are cleaned and placed in recycling bins to earn the 70% recycling discount score.
2. **Eliminate Single-Use Items**: Switch to reusable water bottles, shopping bags, and travel mugs to prevent plastic pollution and production waste.
3. **Home Composting**: Compost organic scraps. Decaying compost in soil releases nutrients naturally without releasing high volumes of anaerobic landfill methane.`;
  }

  recommendationMarkdown += `\n\n*Note: Add more daily logs regularly to receive updated, context-aware audits!*`;
  return recommendationMarkdown;
};

/**
 * @desc    Get custom-tailored recommendations based on weekly footprint logs
 * @route   GET /api/recommendations
 * @access  Private
 */
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if recommendations are already cached in MongoDB
    const cachedRec = await Recommendation.findOne({ userId }).sort({ createdAt: -1 });
    if (cachedRec) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: {
          aiResponse: cachedRec.aiResponse,
        },
      });
    }

    // Retrieve logs from the last 7 days to pass to calculation engine
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await ActivityLog.find({
      userId,
      date: { $gte: sevenDaysAgo },
    });

    let aiResponseText = '';

    // If Gemini key is defined in environment, call Google GenAI SDK
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
      try {
        // Aggregate log values for prompt building
        let transportCarbon = 0;
        let energyCarbon = 0;
        let dietCarbon = 0;
        let wasteCarbon = 0;

        logs.forEach((log) => {
          if (log.category === 'transportation') transportCarbon += log.calculatedCarbon;
          if (log.category === 'energy') energyCarbon += log.calculatedCarbon;
          if (log.category === 'diet') dietCarbon += log.calculatedCarbon;
          if (log.category === 'waste') wasteCarbon += log.calculatedCarbon;
        });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Define prompt structure
        const prompt = `You are EcoGenius, a senior sustainability consultant. 
        A user has logged the following carbon emissions over the last 7 days:
        - Transportation: ${transportCarbon.toFixed(2)} kg CO2e
        - Utilities/Energy: ${energyCarbon.toFixed(2)} kg CO2e
        - Diet: ${dietCarbon.toFixed(2)} kg CO2e
        - Waste: ${wasteCarbon.toFixed(2)} kg CO2e
        
        Please generate a highly engaging, structured, and customized recommendation report. 
        1. Keep the output in a clean markdown format (using headers and bullet points).
        2. Congratulate them on their efforts if their total emission is low (e.g. less than 100 kg CO2e).
        3. Highlight the highest emission category first, explaining the primary driver.
        4. Give 3 actionable, highly practical tips tailored to reduce their emissions in their highest category.
        5. Suggest small behavioral modifications.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (text) {
          aiResponseText = text;
        } else {
          throw new Error('Gemini API returned an empty text payload response');
        }
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to static rules:', geminiError.message);
        aiResponseText = generateStaticRecommendations(logs);
      }
    } else {
      // Fallback directly to rule-based parser if key is absent
      aiResponseText = generateStaticRecommendations(logs);
    }

    // Cache the response in DB (expires automatically in 24 hours)
    const cachedRecommendation = await Recommendation.create({
      userId,
      aiResponse: aiResponseText,
    });

    return res.status(200).json({
      success: true,
      source: 'generated',
      data: {
        aiResponse: cachedRecommendation.aiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
