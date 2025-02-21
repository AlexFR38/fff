import OpenAI from 'openai';
import { apiKeyManager } from './apiKeyManager';

export type FoodSearchResponse = {
  foods: Array<{
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }>;
};

export const searchFood = async (query: string): Promise<FoodSearchResponse> => {
  return await apiKeyManager.executeWithRetry(async (apiKey) => {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Provide nutritional information for ${query}. Return the response in this exact JSON format: { "foods": [{ "name": "food name", "calories": number, "proteins": number, "carbs": number, "fats": number }] }. Calories should be per 100g, proteins/carbs/fats in grams per 100g. Be precise and realistic with the values.`,
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content);
  });
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodSearchResponse> => {
  return await apiKeyManager.executeWithRetry(async (apiKey) => {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide nutritional information. Return the response in this exact JSON format: { \"foods\": [{ \"name\": \"food name\", \"calories\": number, \"proteins\": number, \"carbs\": number, \"fats\": number }] }. Calories should be per 100g, proteins/carbs/fats in grams per 100g. Be precise and realistic with the values.",
            },
            {
              type: "image_url",
              image_url: `data:image/jpeg;base64,${base64Image}`,
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content);
  });
};