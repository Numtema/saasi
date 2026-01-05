
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { QuizConfig } from '@/types/funnel';

export const aiService = {
  async generateFunnel(prompt: string, model: string = 'gemini-3-flash-preview'): Promise<QuizConfig> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert marketing funnel creator. Output ONLY a valid JSON following the QuizConfig structure.",
        responseMimeType: "application/json"
      }
    });

    const content = response.text;
    return JSON.parse(content || '{}');
  },

  async suggestText(field: string, currentValue: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve this marketing ${field}: "${currentValue}". Be persuasive and concise.`,
    });
    return response.text || currentValue;
  },

  async generateImage(prompt: string, model: string = 'gemini-2.5-flash-image'): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: `High-quality professional marketing image: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Aucune image n'a été générée par le modèle.");
  },

  async generateVideo(prompt: string, onProgress?: (status: string) => void): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    if (onProgress) onProgress("Initialisation de Veo 3.1...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic professional commercial video: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      if (onProgress) onProgress("L'IA façonne votre vidéo (cela peut prendre 1-2 min)...");
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
};
