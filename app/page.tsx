'use client';

import { useState, useEffect } from 'react';
import { ReviewType, CodeReview } from '@/types';
import CodeInput from '@/components/CodeInput';
import ReviewOutput from '@/components/ReviewOutput';
import ReviewTypeSelector from '@/components/ReviewTypeSelector';
import Link from 'next/link';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [reviewType, setReviewType] = useState<ReviewType>('general');
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number>();
  const [error, setError] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const saved = JSON.parse(localStorage.getItem('code-reviews') || '[]');
      setSavedCount(saved.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
  }, []);

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    if (code.length > 10000) {
      setError('Code exceeds maximum length of 10,000 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setReview('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          reviewType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate review');
      }

      setReview(data.review);
      setTokensUsed(data.tokensUsed);
    } catch (err: any) {
      let errorMessage = err.message || "Something went wrong. Please try again.";

      if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        errorMessage = "⏱️ Rate limit exceeded. Please wait 60 seconds and try again."
      }

      setError(errorMessage);
      console.error('Review error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const reviewData: CodeReview = {
      id: Date.now().toString(),
      code,
      language,
      reviewType,
      aiResponse: review,
      timestamp: Date.now(),
      title: `${language} - ${reviewType} review`,
    };

    const saved = JSON.parse(localStorage.getItem('code-reviews') || '[]');
    saved.unshift(reviewData);
    localStorage.setItem('code-reviews', JSON.stringify(saved.slice(0, 50))); // Keep last 50

    alert('Review saved to workspace! 💾');
  };

  const handleExport = () => {
    // We'll implement this in the next sprint
    alert('PDF export coming in next sprint! 📄');
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          🤖 AI Code Review Assistant
        </h1>
        <p className="text-gray-400 text-lg">
          Get instant, expert-level code reviews powered by AI
        </p>
        <Link
          href="/workspace"
          className="inline-block mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition-colors"
        >
          💾 View Workspace ({savedCount} saved)
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          <CodeInput
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            disabled={isLoading}
          />
          
          <ReviewTypeSelector
            selected={reviewType}
            onChange={setReviewType}
            disabled={isLoading}
          />

          <button
            onClick={handleReview}
            disabled={isLoading || !code.trim() || code.length > 10000}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? 'Analyzing...' : '🚀 Review My Code'}
          </button>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right Column - Output */}
        <div>
          <ReviewOutput
            review={review}
            isLoading={isLoading}
            tokensUsed={tokensUsed}
            onSave={review ? handleSave : undefined}
            onExport={review ? handleExport : undefined}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-12">
        <p>Built with Next.js, React, and OpenAI • By [Your Name]</p>
      </div>
    </main>
  );
}