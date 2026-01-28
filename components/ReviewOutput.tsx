'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ReviewOutputProps {
  review: string;
  isLoading: boolean;
  tokensUsed?: number;
  onSave?: () => void;
  onExport?: () => void;
}

export default function ReviewOutput({
  review,
  isLoading,
  tokensUsed,
  onSave,
  onExport,
}: ReviewOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Analyzing your code...</p>
          <p className="text-xs text-gray-500">This may take 10-30 seconds</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-3">🤖</div>
          <p>Your AI code review will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          AI Review
        </label>
        <div className="flex items-center gap-2">
          {tokensUsed && (
            <span className="text-xs text-gray-500">
              {tokensUsed} tokens used
            </span>
          )}
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-3 py-1.5 bg-blue-600 border border-blue-500 rounded-lg text-xs text-white hover:bg-blue-700 transition-colors"
            >
              💾 Save
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-1.5 bg-green-600 border border-green-500 rounded-lg text-xs text-white hover:bg-green-700 transition-colors"
            >
              📄 Export PDF
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-h-96 overflow-y-auto">
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code: ({ node, inline, ...props }) => (
                inline ? (
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-400" {...props} />
                ) : (
                  <code className="block bg-gray-800 p-3 rounded-lg overflow-x-auto" {...props} />
                )
              ),
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-100 mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-gray-200 mt-3 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-gray-300 mt-2 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-gray-300 mb-3 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-3" {...props} />,
              li: ({ node, ...props }) => <li className="ml-4" {...props} />,
            }}
          >
            {review}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}