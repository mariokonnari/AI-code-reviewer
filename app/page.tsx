'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReviewType, CodeReview } from '@/types';
import CodeInput from '@/components/CodeInput';
import ReviewOutput from '@/components/ReviewOutput';
import ReviewTypeSelector from '@/components/ReviewTypeSelector';
import Navbar from '@/components/Navbar';
import Toaster from '@/components/Toaster';
import { useToast } from '@/hooks/useToast';
import { ArrowRight, Loader2, Sparkles, XCircle } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [reviewType, setReviewType] = useState<ReviewType>('general');
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number>();
  const [error, setError] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    const updateCount = () => {
      const saved = JSON.parse(localStorage.getItem('code-reviews') || '[]');
      setSavedCount(saved.length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    if (code.length > 10000) {
      setError('Code exceeds the 10,000 character limit.');
      return;
    }

    setIsLoading(true);
    setError('');
    setReview('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, reviewType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate review');

      setReview(data.review);
      setTokensUsed(data.tokensUsed);
    } catch (err: any) {
      let msg = err.message || 'Something went wrong. Please try again.';
      if (msg.includes('quota') || msg.includes('rate limit')) {
        msg = 'Rate limit exceeded. Please wait 60 seconds and try again.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [code, language, reviewType]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isLoading && code.trim() && code.length <= 10000) {
          handleReview();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleReview, isLoading, code]);

  const handleSave = () => {
    const reviewData: CodeReview = {
      id: Date.now().toString(),
      code,
      language,
      reviewType,
      aiResponse: review,
      timestamp: Date.now(),
      title: `${language} — ${reviewType} review`,
    };

    const saved = JSON.parse(localStorage.getItem('code-reviews') || '[]');
    saved.unshift(reviewData);
    localStorage.setItem('code-reviews', JSON.stringify(saved.slice(0, 50)));
    setSavedCount(saved.length);
    addToast('Review saved to workspace', 'success');
  };

  const isReadyToReview = !isLoading && code.trim().length > 0 && code.length <= 10000;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar savedCount={savedCount} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-14 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5">
              <Sparkles className="w-3 h-3" />
              Powered by Google Gemini 2.5
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Code Review
              </span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
              Catch bugs, security issues, and performance bottlenecks instantly.
              Expert-level feedback in seconds.
            </p>
          </div>
        </section>

        {/* Editor */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left — Input */}
            <div className="space-y-5">
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
                disabled={!isReadyToReview}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/15 disabled:shadow-none group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Review My Code
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-600">
                Press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-500 font-mono text-[10px]">
                  Ctrl
                </kbd>{' '}
                +{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-500 font-mono text-[10px]">
                  Enter
                </kbd>{' '}
                to review
              </p>

              {error && (
                <div className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>

            {/* Right — Output */}
            <div>
              <ReviewOutput
                review={review}
                isLoading={isLoading}
                tokensUsed={tokensUsed}
                onSave={review ? handleSave : undefined}
                code={code}
                language={language}
                reviewType={reviewType}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>Built with Next.js &amp; Google Gemini</span>
          <span>By Marios Konnaris</span>
        </div>
      </footer>

      <Toaster toasts={toasts} />
    </div>
  );
}
