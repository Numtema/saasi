
import { GoogleGenAI, Type } from "@google/genai";
import { StepType } from "../types";

export const geminiService = {
  // Génération de contenu d'étape
  async generateStrategy(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
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
      contents: `Crée une stratégie "Lead Generation Machine" complète. Analyse en profondeur les points de douleur et génère 9 étapes (Attract -> Convert). Produit uniquement du JSON. Contexte : ${prompt}`
    });
    return JSON.parse(response.text || '{}');
  },

  // Génération d'image avec Gemini 2.5 Flash Image
  async generateImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: `Generate a high-quality professional marketing image for: ${prompt}. Aspect ratio 16:9.` }],
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  },

  // Génération de vidéo avec Veo
  async generateVideo(prompt: string, onStatus: (msg: string) => void): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Vérifier la clé API Studio d'abord
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    onStatus("Initialisation de Veo...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Professional business marketing cinematic clip, 4k, smooth lighting, ${prompt}`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      onStatus("Rendu des pixels par l'IA Veo (cela peut prendre 1-2 min)...");
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
    return finalUrl;
  },

  async enhanceCopy(text: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Améliore ce texte marketing pour le rendre plus percutant : "${text}"`
    });
    return response.text;
  }
};
