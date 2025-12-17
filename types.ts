export enum Goal {
  LOSE_WEIGHT = 'Lose Weight',
  MAINTAIN = 'Maintain Weight',
  GAIN_WEIGHT = 'Gain Weight',
  GAIN_MUSCLE = 'Gain Muscle',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (little or no exercise)',
  LIGHT = 'Lightly active (exercise 1-3 days/week)',
  MODERATE = 'Moderately active (exercise 3-5 days/week)',
  ACTIVE = 'Active (exercise 6-7 days/week)',
  VERY_ACTIVE = 'Very active (hard exercise & physical job)',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum Region {
  SRI_LANKA = 'Sri Lanka',
  WORLDWIDE = 'Worldwide',
}

export type MeatType = 'Chicken' | 'Fish' | 'Beef' | 'Pork';

export interface UserProfile {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  meatPreferences: MeatType[];
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  cost: string; // Changed from number to string to support currencies (e.g. "Rs. 500" or "$2.50")
}

export interface Meal {
  name: string; // e.g., Breakfast, Lunch
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  notes?: string;
}

export interface DailyPlan {
  meals: Meal[];
  summary: {
    totalCalories: number;
    totalProtein: number;
    estimatedDailyCost: string; // Changed to string
    tips: string[];
  };
}

export interface ShakeRecipe {
  name: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  macros: { calories: number; protein: number; carbs: number; fats: number };
  tip: string;
}