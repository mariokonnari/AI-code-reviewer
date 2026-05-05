'use client';

import { useState, useEffect } from 'react';
import { CodeReview } from '@/types';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { exportToPDF } from '@/lib/pdfExport';
import Navbar from '@/components/Navbar';
import Toaster from '@/components/Toaster';
import { useToast } from '@/hooks/useToast';
import {
  Search,
  Shield,
  Zap,
  BookOpen,
  FlaskConical,
  Trash2,
  FileDown,
  Inbox,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

const reviewTypeConfig: Record<
  string,
  { Icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  general: { Icon: Search, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  security: { Icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10' },
  performance: { Icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  readability: { Icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  testing: { Icon: FlaskConical, color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

export default function WorkspacePage() {
  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<CodeReview | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('code-reviews');
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    localStorage.setItem('code-reviews', JSON.stringify(updated));
    if (selectedReview?.id === id) setSelectedReview(null);
    addToast('Review deleted', 'info');
  };

  const clearAll = () => {
    if (confirmClear) {
      setReviews([]);
      setSelectedReview(null);
      localStorage.removeItem('code-reviews');
      setConfirmClear(false);
      addToast('All reviews deleted', 'info');
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Workspace</h1>
            <p className="text-sm text-gray-500">
              {reviews.length} saved review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {reviews.length > 0 && (
              <button
                onClick={clearAll}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all ${
                  confirmClear
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : 'bg-transparent border-gray-800 text-gray-500 hover:border-red-500/40 hover:text-red-400'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {confirmClear ? 'Click again to confirm' : 'Clear All'}
              </button>
            )}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              New Review
            </Link>
          </div>
        </div>

        {reviews.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-5">
              <Inbox className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">No saved reviews</h2>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Reviews you save from the editor will appear here for easy access.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create Your First Review
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sidebar list */}
            <div className="md:col-span-1 space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
                Saved Reviews
              </p>
              <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
                {reviews.map((review) => {
                  const config = reviewTypeConfig[review.reviewType] ?? reviewTypeConfig.general;
                  const { Icon } = config;
                  const isSelected = selectedReview?.id === review.id;

                  return (
                    <button
                      key={review.id}
                      onClick={() => setSelectedReview(review)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20'
                          : 'border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-900/70'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-md ${config.bg} flex items-center justify-center`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                          </div>
                          <span
                            className={`text-sm font-medium capitalize ${
                              isSelected ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {review.reviewType}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReview(review.id);
                          }}
                          className="p-1 text-gray-600 hover:text-red-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-gray-500 mb-1.5">
                        <span className="capitalize">{review.language}</span>
                        {' · '}
                        {formatDate(review.timestamp)}
                      </div>
                      <div className="text-xs text-gray-600 font-mono truncate">
                        {review.code.substring(0, 55)}…
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail panel */}
            <div className="md:col-span-2">
              {selectedReview ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  {/* Detail header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const config =
                          reviewTypeConfig[selectedReview.reviewType] ??
                          reviewTypeConfig.general;
                        const { Icon } = config;
                        return (
                          <div
                            className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}
                          >
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                        );
                      })()}
                      <div>
                        <h2 className="text-sm font-semibold text-white capitalize">
                          {selectedReview.reviewType} Review
                        </h2>
                        <p className="text-xs text-gray-500">
                          {selectedReview.language} · {formatDate(selectedReview.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportToPDF(selectedReview)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      <FileDown className="w-3 h-3" />
                      Export PDF
                    </button>
                  </div>

                  {/* Code block */}
                  <div className="px-6 py-4 border-b border-gray-800">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Original Code
                    </p>
                    <pre className="bg-[#0a0e1a] border border-gray-800 rounded-lg p-4 overflow-x-auto text-xs text-gray-300 font-mono leading-relaxed max-h-48">
                      {selectedReview.code}
                    </pre>
                  </div>

                  {/* AI Review */}
                  <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                      AI Review
                    </p>
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
                            className="text-base font-bold text-white mt-4 mb-2 pb-2 border-b border-gray-800"
                            {...props}
                          />
                        ),
                        h2: ({ ...props }: any) => (
                          <h2
                            className="text-sm font-semibold text-gray-100 mt-3 mb-1.5"
                            {...props}
                          />
                        ),
                        h3: ({ ...props }: any) => (
                          <h3
                            className="text-sm font-medium text-gray-200 mt-2 mb-1"
                            {...props}
                          />
                        ),
                        p: ({ ...props }: any) => (
                          <p className="text-gray-300 mb-2.5 leading-relaxed text-sm" {...props} />
                        ),
                        ul: ({ ...props }: any) => (
                          <ul
                            className="space-y-1 mb-3 ml-4 list-disc text-gray-300 text-sm"
                            {...props}
                          />
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
                        hr: () => <hr className="border-gray-800 my-3" />,
                      }}
                    >
                      {selectedReview.aiResponse}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] bg-gray-900/30 border border-gray-800 rounded-xl flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500">Select a review to see the details</p>
                </div>
              )}
            </div>
          </div>
        )}
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
