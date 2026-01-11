
import { GoogleGenAI, Type } from "@google/genai";
import { ScanMode, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    category: { type: Type.STRING, description: "food, plant, product, ingredient, object, unknown" },
    safetyStatus: { type: Type.STRING, description: "safe, unsafe, caution" },
    confidence: { type: Type.NUMBER },
    description: { type: Type.STRING },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        bestTimeToEat: { type: Type.STRING }
      },
      required: ["calories", "protein", "carbs", "fat", "benefits", "bestTimeToEat"]
    },
    plantInfo: {
      type: Type.OBJECT,
      properties: {
        scientificName: { type: Type.STRING },
        toxicity: { type: Type.STRING },
        careInstructions: {
          type: Type.OBJECT,
          properties: {
            watering: { type: Type.STRING },
            sunlight: { type: Type.STRING }
          },
          required: ["watering", "sunlight"]
        },
        environment: { type: Type.STRING }
      },
      required: ["scientificName", "toxicity", "careInstructions", "environment"]
    },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    preparedMeals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "ingredients", "steps"]
      }
    }
  },
  required: ["name", "category", "safetyStatus", "confidence", "description", "recommendations"]
};

export async function analyzeImage(
  base64Image: string, 
  mode: ScanMode,
  userContext: { goal: string; preference: string }
): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  let prompt = `Analyze this image. Mode: ${mode}. User Goal: ${userContext.goal}. Preference: ${userContext.preference}.
  Identify the main object. If it's a food item, provide full nutritional breakdown and meal suggestions.
  If it's a plant, provide scientific name, toxicity, and care tips.
  If it's a general object, focus on its state and recommendations.
  Be precise and educational.`;

  if (mode === ScanMode.FOOD) {
    prompt += " Focus specifically on nutritional value and freshness. If multiple items are seen, list them and suggest a combined meal.";
  } else if (mode === ScanMode.PLANT) {
    prompt += " Focus on plant identification, toxicity warnings (CRITICAL), and care requirements.";
  }

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Analysis failed. Please try again.");
  }
}

export async function generateMealPlan(context: string) {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Generate a daily meal plan for a user who: ${context}. Include Breakfast, Lunch, and Dinner. For each, give name, calorie estimate, and health highlights. Return JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                name: { type: Type.STRING },
                calories: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
}
