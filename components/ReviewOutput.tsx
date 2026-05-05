'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { exportToPDF } from '@/lib/pdfExport';
import { CodeReview } from '@/types';
import { Copy, Check, Save, FileDown, Bot, Zap } from 'lucide-react';

interface ReviewOutputProps {
  review: string;
  isLoading: boolean;
  tokensUsed?: number;
  onSave?: () => void;
  code?: string;
  language?: string;
  reviewType?: string;
}

export default function ReviewOutput({
  review,
  isLoading,
  tokensUsed,
  onSave,
  code,
  language,
  reviewType,
}: ReviewOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="h-full min-h-[28rem] bg-gray-900/50 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-gray-800 border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-gray-200 font-medium">Analyzing your code</p>
          <p className="text-xs text-gray-500">This may take 10–30 seconds</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="h-full min-h-[28rem] bg-gray-900/50 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 flex items-center justify-center">
          <Bot className="w-8 h-8 text-blue-400/70" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-gray-300 font-medium">Ready to Review</p>
          <p className="text-sm text-gray-600">Paste your code and click Review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bot className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-300">AI Review</label>
          {tokensUsed && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-900 border border-gray-800 text-gray-500">
              <Zap className="w-2.5 h-2.5" />
              {tokensUsed.toLocaleString()} tokens
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-700 transition-all"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          )}
          {code && language && reviewType && (
            <button
              onClick={() => {
                const reviewData: CodeReview = {
                  id: Date.now().toString(),
                  code,
                  language,
                  reviewType: reviewType as any,
                  aiResponse: review,
                  timestamp: Date.now(),
                };
                exportToPDF(reviewData);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all"
            >
              <FileDown className="w-3 h-3" />
              Export
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 max-h-[28rem] overflow-y-auto">
        <div className="max-w-none">
          <ReactMarkdown
            components={{
              code: ({ className, children, ...props }: any) => {
                const isBlock = className?.includes('language-');
                return isBlock ? (
                  <code
                    className="block bg-gray-800/80 border border-gray-700/50 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed text-gray-300 my-3"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-300 text-[0.82em] font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }: any) => <pre className="not-prose">{children}</pre>,
              h1: ({ ...props }: any) => (
                <h1
                  className="text-lg font-bold text-white mt-5 mb-2.5 pb-2 border-b border-gray-800"
                  {...props}
                />
              ),
              h2: ({ ...props }: any) => (
                <h2 className="text-base font-semibold text-gray-100 mt-4 mb-2" {...props} />
              ),
              h3: ({ ...props }: any) => (
                <h3 className="text-sm font-semibold text-gray-200 mt-3 mb-1.5" {...props} />
              ),
              p: ({ ...props }: any) => (
                <p className="text-gray-300 mb-3 leading-relaxed text-sm" {...props} />
              ),
              ul: ({ ...props }: any) => (
                <ul className="space-y-1 mb-3 ml-4 list-disc text-gray-300 text-sm" {...props} />
              ),
              ol: ({ ...props }: any) => (
                <ol
                  className="space-y-1 mb-3 ml-4 list-decimal text-gray-300 text-sm"
                  {...props}
                />
              ),
              li: ({ ...props }: any) => (
                <li className="text-gray-300 leading-relaxed" {...props} />
              ),
              strong: ({ ...props }: any) => (
                <strong className="text-white font-semibold" {...props} />
              ),
              blockquote: ({ ...props }: any) => (
                <blockquote
                  className="border-l-2 border-blue-500/50 pl-4 my-3 text-gray-400 italic"
                  {...props}
                />
              ),
              hr: () => <hr className="border-gray-800 my-4" />,
            }}
          >
            {review}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
