
import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, AutomationStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMacroSteps = async (prompt: string): Promise<AutomationStep[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following automation request into a sequence of computer automation steps. Use common app identifiers (e.g., 'chrome', 'steam', 'spotify').
    
    Request: ${prompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { 
              type: Type.STRING, 
              enum: Object.values(ActionType),
              description: "The type of action to perform" 
            },
            value: { type: Type.STRING, description: "The parameter for the action (URL, Path, Command)" },
            description: { type: Type.STRING, description: "A human readable explanation of this step" }
          },
          required: ["id", "type", "value", "description"]
        }
      }
    }
  });

  try {
    const steps = JSON.parse(response.text);
    return steps;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};
