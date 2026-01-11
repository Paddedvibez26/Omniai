
export enum AppTab {
  HOME = 'home',
  MEALS = 'meals',
  SCAN = 'scan',
  PLANTS = 'plants',
  PROFILE = 'profile'
}

export enum ScanMode {
  GENERAL = 'general',
  FOOD = 'food',
  PLANT = 'plant'
}

export interface AnalysisResult {
  name: string;
  category: 'food' | 'plant' | 'product' | 'ingredient' | 'object' | 'unknown';
  safetyStatus: 'safe' | 'unsafe' | 'caution';
  confidence: number;
  description: string;
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    benefits: string[];
    bestTimeToEat: string;
  };
  plantInfo?: {
    scientificName: string;
    toxicity: string;
    careInstructions: {
      watering: string;
      sunlight: string;
    };
    environment: string;
  };
  recommendations: string[];
  preparedMeals?: {
    name: string;
    ingredients: string[];
    steps: string[];
  }[];
}

export interface MealPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface Meal {
  name: string;
  calories: string;
  highlights: string[];
}

export interface UserProfile {
  name: string;
  goal: string;
  dietPreference: string;
  healthScore: number;
  totalScans: number;
}
