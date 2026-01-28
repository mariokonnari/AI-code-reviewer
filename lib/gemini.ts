import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getModel = (modelName: string) => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const MODELS = {
  FAST: 'gemini-2.5-flash',      // Fast and efficient
  SMART: 'gemini-2.5-pro',       // Higher quality
} as const;