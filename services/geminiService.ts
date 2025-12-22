
import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, AutomationStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMacroSteps = async (prompt: string): Promise<AutomationStep[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Bir bilgisayar otomasyon sistemi için şu isteği teknik adımlara dönüştür: "${prompt}". 
    Uygulama isimleri (chrome, steam, spotify, code) ve URL'ler kullan.`,
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
              description: "Eylem tipi" 
            },
            value: { type: Type.STRING, description: "Eylem parametresi (URL, Path, Key)" },
            description: { type: Type.STRING, description: "Açıklama" }
          },
          required: ["id", "type", "value", "description"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("AI parsing error", e);
    return [];
  }
};
