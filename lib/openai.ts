import OpenAI from "openai";

export const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY,
});

export const MODELS ={
    FAST: 'gpt-3.5-turbo',
    SMART: 'gpt-4-turbo-preview',
} as const;