
import { GoogleGenAI, Type } from "@google/genai";
import { StepType } from "../types";

export const geminiService = {
  // Génération de stratégie profonde avec Thinking
  async generateStrategy(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Budget max pour une stratégie marketing complexe
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: Object.values(StepType) },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  buttonText: { type: Type.STRING }
                },
                required: ['type', 'title', 'description', 'buttonText']
              }
            }
          }
        }
      },
      contents: `Crée une stratégie "Lead Generation Machine" complète. Analyse en profondeur les points de douleur psychologiques et génère 9 étapes (Attract -> Convert). Produit uniquement du JSON. Contexte : ${prompt}`
    });

    return JSON.parse(response.text || '{}');
  },

  // Veille marketing temps réel avec Search Grounding
  async getMarketTrends() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        tools: [{ googleSearch: {} }]
      },
      contents: "Quelles sont les 3 dernières tendances majeures en vidéo marketing et funnel de vente automatisé pour 2024-2025 ?"
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  async enhanceCopy(text: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Améliore ce texte marketing pour le rendre plus percutant, émotionnel et orienté conversion : "${text}"`
    });
    return response.text;
  }
};
