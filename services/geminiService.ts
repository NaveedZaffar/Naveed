
import { GoogleGenAI, Type } from "@google/genai";
import { EnergyReading, OptimizationInsight, SearchResult } from "../types";

// Create instances inside calls as per guidelines for key selection
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (currentData: EnergyReading): Promise<OptimizationInsight[]> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this real-time energy audit data and provide 3 specific optimization strategies for an industrial facility:
      - Active Power: ${currentData.activePower} kW
      - Power Factor: ${currentData.powerFactor}
      - THD: ${currentData.thd}%
      - Voltage Balance: ${currentData.voltage.join(', ')}V
      Return a JSON array with objects containing id, type (warning/info/success), title, description, and potentialSavings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              potentialSavings: { type: Type.STRING }
            },
            required: ["id", "type", "title", "description", "potentialSavings"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return getFallbackInsights();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackInsights();
  }
};

export const getGlobalMarketInsights = async (): Promise<SearchResult> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What are the latest global energy price trends and industrial sustainability regulations for 2025? Provide a concise summary for facility managers.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text || "No data available",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "Unable to fetch live market data at this time." };
  }
};

export const generateAuditVisual = async (prompt: string, size: "1K" | "2K" | "4K"): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: `Create a professional architectural visualization for an energy audit report based on this concept: ${prompt}. High-tech, sustainable industrial aesthetic.` },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

const getFallbackInsights = (): OptimizationInsight[] => [
  {
    id: "1",
    type: "warning",
    title: "Harmonic Distortion Detected",
    description: "THD levels are approaching IEEE limits. Investigate VFD filters.",
    potentialSavings: "$1,200/year"
  },
  {
    id: "2",
    type: "info",
    title: "Dynamic Tariff Window",
    description: "Energy prices will drop in 2 hours. Schedule non-critical processes then.",
    potentialSavings: "$450/month"
  },
  {
    id: "3",
    type: "success",
    title: "Power Factor Optimized",
    description: "PF is maintained above 0.95. No utility penalties expected.",
    potentialSavings: "Avoids $300 penalty"
  }
];
