'use client';

import { useState, useEffect } from 'react';
import { CodeReview } from '@/types';
import Link from 'next/link';
import { exportToPDF } from '@/lib/pdfExport';

export default function WorkspacePage() {
    const [reviews, setReviews] = useState<CodeReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<CodeReview | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('code-reviews');
        if (saved) {
            setReviews(JSON.parse(saved));
        }
    }, []);

    const deleteReview = (id: string) => {
        const updated = reviews.filter(r => r.id !== id);
        setReviews(updated);
        localStorage.setItem('code-reviews', JSON.stringify(updated));
        if (selectedReview?.id === id) {
            setSelectedReview(null);
        }
    };

    const clearAll = () => {
        if (confirm('Are you sure you want to delete all saved reviews?')) {
            setReviews([]);
            setSelectedReview(null);
            localStorage.removeItem('code-reviews');
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getReviewIcon = (type: string) => {
        const icons: Record<string, string> = {
            general: '🔍',
            security: '🔒',
            performance: '⚡',
            readability: '📖',
            testing: '🧪',
        };
        return icons[type] || '🔍';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            💾 Workspace
                        </h1>
                        <p className="text-gray-400">
                            {reviews.length} saved review{reviews.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {reviews.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                🗑️ Clear All
                            </button>
                        )}
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            ← Back to Review
                        </Link>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">
                            No saved reviews yet
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Reviews you save will appear here for easy access
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Create Your First Review
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* List of Reviews */}
                        <div className="md:col-span-1 space-y-3">
                            <h2 className="text-lg font-semibold text-gray-300 mb-3">
                                Saved Reviews
                            </h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {reviews.map((review) => (
                                    <button
                                        key={review.id}
                                        onClick={() => setSelectedReview(review)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedReview?.id === review.id
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">
                                                    {getReviewIcon(review.reviewType)}
                                                </span>
                                                <span className="font-medium text-gray-300 capitalize">
                                                    {review.reviewType}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteReview(review.id);
                                                }}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {review.language} • {formatDate(review.timestamp)}
                                        </div>
                                        <div className="mt-2 text-sm text-gray-400 font-mono truncate">
                                            {review.code.substring(0, 50)}...
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review Detail */}
                        <div className="md:col-span-2">
                            {selectedReview ? (
                                <div className="space-y-4">
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-gray-300">
                                                {getReviewIcon(selectedReview.reviewType)}{' '}
                                                {selectedReview.reviewType.charAt(0).toUpperCase() +
                                                    selectedReview.reviewType.slice(1)}{' '}
                                                Review
                                            </h2>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(selectedReview.timestamp)}
                                                </span>
                                                <button
                                                    onClick={() => exportToPDF(selectedReview)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    📄 Export PDF
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">
                                                Original Code ({selectedReview.language})
                                            </h3>
                                            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
                                                {selectedReview.code}
                                            </pre>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">
                                                AI Review
                                            </h3>
                                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 prose prose-invert prose-sm max-w-none">
                                                {selectedReview.aiResponse}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                                    <div className="text-4xl mb-3">👈</div>
                                    <p className="text-gray-400">
                                        Select a review from the list to view details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}