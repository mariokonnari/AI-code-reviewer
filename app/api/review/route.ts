import { NextRequest, NextResponse } from 'next/server';
import { openai, MODELS } from '@/lib/openai';
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

    // Call OpenAI
    const prompt = getReviewPrompt(code, language, reviewType);
    
    const completion = await openai.chat.completions.create({
      model: MODELS.FAST, // Use SMART for better quality but higher cost
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer with years of experience across multiple programming languages and frameworks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({
      success: true,
      review: aiResponse,
      tokensUsed: completion.usage?.total_tokens || 0,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate review',
        details: error.message 
      },
      { status: 500 }
    );
  }
}