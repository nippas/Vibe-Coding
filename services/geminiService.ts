import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, MacroTargets, DailyPlan, MeatType, ShakeRecipe, Region } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for strict JSON output
const foodItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the food item" },
    portion: { type: Type.STRING, description: "Portion size (e.g., 1 cup, 100g)" },
    calories: { type: Type.NUMBER, description: "Approximate calories" },
    protein: { type: Type.NUMBER, description: "Approximate protein in grams" },
    cost: { type: Type.STRING, description: "Estimated cost with currency symbol (e.g. 'Rs. 200' or '$1.50')" },
  },
  required: ["name", "portion", "calories", "protein", "cost"],
};

const mealSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Meal name (Breakfast, Lunch, Dinner, Snack)" },
    items: { type: Type.ARRAY, items: foodItemSchema },
    totalCalories: { type: Type.NUMBER },
    totalProtein: { type: Type.NUMBER },
    notes: { type: Type.STRING, description: "Cooking tip or preparation method (optional)" },
  },
  required: ["name", "items", "totalCalories", "totalProtein"],
};

const summarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    totalCalories: { type: Type.NUMBER },
    totalProtein: { type: Type.NUMBER },
    estimatedDailyCost: { type: Type.STRING, description: "Total daily cost with currency" },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["totalCalories", "totalProtein", "estimatedDailyCost", "tips"],
};

const dailyPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    meals: { type: Type.ARRAY, items: mealSchema },
    summary: summarySchema,
  },
  required: ["meals", "summary"],
};

// Shake Schema
const shakeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        },
        required: ["name", "amount"]
      }
    },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    macros: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fats: { type: Type.NUMBER }
      },
      required: ["calories", "protein", "carbs", "fats"]
    },
    tip: { type: Type.STRING }
  },
  required: ["name", "ingredients", "instructions", "macros", "tip"]
};

export const generateMealPlan = async (
  profile: UserProfile,
  targets: MacroTargets,
  region: Region
): Promise<DailyPlan> => {
  const prefs = profile.meatPreferences || [];
  
  // Construct Region Specific Guidelines
  let dietGuidelines = "";
  let forbidden = "";
  let currencyContext = "";

  if (region === Region.SRI_LANKA) {
    currencyContext = "Estimate costs in Sri Lankan Rupees (LKR).";
    forbidden = "No Salmon, Imported Premium Fish Steaks, Broccoli, Olive Oil, Quinoa, Asparagus, Cheese blocks (Cheddar/Mozzarella), or foreign berries.";
    
    let proteinInst = "";
    if (prefs.includes('Chicken')) proteinInst += "- **Chicken**: Curry or Devilled (include bone-in cuts).\n";
    if (prefs.includes('Fish')) proteinInst += "- **Fish**: **Local Tuna (Kelawalla/Balaya)** is recommended. Also Sprats, Salaya.\n";
    if (prefs.includes('Beef')) proteinInst += "- **Beef**: Curry or stir-fry (affordable cuts).\n";
    if (prefs.includes('Pork')) proteinInst += "- **Pork**: Black Pork Curry.\n";
    
    dietGuidelines = `
    CONTEXT: Sri Lanka (Budget Friendly).
    1. **Carbs**: White Rice (Samba/Nadu), Red Rice, String Hoppers, Roast Paan, Manioc, Sweet Potato.
    2. **Proteins** (Prioritize User Selection):
       ${proteinInst}
       - Staples: Soya Meat (TVP), Dhal (Parippu), Eggs, Yogurt (Highland/Curd).
    3. **Vegetables**: Murunga, Beans, Pumpkin, Gotukola, Kankun, Brinjal.
    `;
  } else {
    // Worldwide / Western Context
    currencyContext = "Estimate costs in USD ($).";
    forbidden = "No Wagyu beef, Truffles, extremely expensive organic specialty brands.";

    let proteinInst = "";
    if (prefs.includes('Chicken')) proteinInst += "- **Chicken**: Breast, Thighs, or Rotisserie.\n";
    if (prefs.includes('Fish')) proteinInst += "- **Fish**: Canned Tuna, Tilapia, Cod, Frozen Fillets.\n";
    if (prefs.includes('Beef')) proteinInst += "- **Beef**: Lean Ground Beef, Flank Steak.\n";
    if (prefs.includes('Pork')) proteinInst += "- **Pork**: Loin Chops, Tenderloin.\n";

    dietGuidelines = `
    CONTEXT: Worldwide / General Western Diet (Budget Friendly).
    1. **Carbs**: Rice, Potatoes, Oats, Whole Wheat Bread, Pasta.
    2. **Proteins** (Prioritize User Selection):
       ${proteinInst}
       - Staples: Canned Beans, Lentils, Eggs, Greek Yogurt, Cottage Cheese, Whey Protein.
    3. **Vegetables**: Frozen Veggie Mixes, Spinach, Broccoli (frozen), Carrots.
    `;
  }

  const prompt = `
    Create a highly specific, budget-friendly 1-day meal plan.
    
    User Profile:
    - Region: ${region}
    - Goal: ${profile.goal}
    - Daily Targets: ${Math.round(targets.calories)} kcal, ${Math.round(targets.protein)}g Protein
    - Allowed Meats: ${prefs.length > 0 ? prefs.join(', ') : 'Vegetarian/Basic Only'}
    
    ${dietGuidelines}
    
    FORBIDDEN:
    ${forbidden}
    
    REQUIREMENTS:
    - ${currencyContext}
    - Calculate exact macros to match target within +/- 5%.
    - Provide 3 main meals + 1-2 snacks.
    
    Output strictly valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dailyPlanSchema,
        systemInstruction: "You are a pragmatic nutritionist. You balance budget with local availability and preferences.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPlan;
    }
    throw new Error("No response text received from Gemini.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate meal plan. Please try again.");
  }
};

export const generateShakeRecipe = async (availableIngredients: string[], region: Region): Promise<ShakeRecipe> => {
  const context = region === Region.SRI_LANKA 
    ? "Context: Sri Lanka (use local brand names like Highland, Munchee, Samaposha, Milo if applicable)." 
    : "Context: Worldwide/General (use standard ingredients like Oats, Peanut Butter, Frozen Fruit).";

  const prompt = `
    Create a delicious and effective protein shake recipe using ONLY a subset of the ingredients provided below.
    Goal: Maximize protein and taste. 
    ${context}
    
    Available Ingredients: ${availableIngredients.join(', ')}
    
    Instructions:
    1. Pick the best combination from the provided list.
    2. Add 'Water' or 'Ice' freely if needed.
    3. Create a recipe with portions.
    4. Estimate macros.
    
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: shakeSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ShakeRecipe;
    }
    throw new Error("No response from Gemini.");
  } catch (error) {
    console.error("Gemini Shake Error:", error);
    throw new Error("Failed to generate shake recipe.");
  }
};