import { NextRequest, NextResponse } from 'next/server';
import { getModel, MODELS } from '@/lib/gemini';
import { getReviewPrompt } from '@/lib/prompts';
import { ReviewRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequest = await request.json();
    const { code, language, reviewType } = body;

    // Validation
    if (!code || !language || !reviewType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (code.length > 10000) {
      return NextResponse.json(
        { error: 'Code exceeds maximum length (10,000 characters)' },
        { status: 400 }
      );
    }

    // Call Gemini
    const model = getModel(MODELS.SMART); // Use FAST for quicker responses
    const prompt = getReviewPrompt(code, language, reviewType);
    
    const systemInstruction = 'You are an expert code reviewer with years of experience across multiple programming languages and frameworks. Provide detailed, actionable feedback in a well-structured format using markdown.';
    
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    // Gemini doesn't return token count in the same way, but we can estimate
    const estimatedTokens = Math.ceil((code.length + aiResponse.length) / 4);

    return NextResponse.json({
      success: true,
      review: aiResponse,
      tokensUsed: estimatedTokens,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle Gemini-specific errors
    let errorMessage = 'Failed to generate review';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your Gemini API key in .env.local';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: 500 }
    );
  }
}