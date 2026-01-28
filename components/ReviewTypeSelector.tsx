'use client';

import { ReviewType } from '@/types';

interface ReviewTypeSelectorProps {
  selected: ReviewType;
  onChange: (type: ReviewType) => void;
  disabled?: boolean;
}

const reviewTypes = [
  { value: 'general' as ReviewType, label: 'General', icon: '🔍', description: 'Comprehensive review' },
  { value: 'security' as ReviewType, label: 'Security', icon: '🔒', description: 'Find vulnerabilities' },
  { value: 'performance' as ReviewType, label: 'Performance', icon: '⚡', description: 'Optimize speed' },
  { value: 'readability' as ReviewType, label: 'Readability', icon: '📖', description: 'Improve clarity' },
  { value: 'testing' as ReviewType, label: 'Testing', icon: '🧪', description: 'Test coverage' },
];

export default function ReviewTypeSelector({ selected, onChange, disabled }: ReviewTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Review Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {reviewTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            disabled={disabled}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${selected === type.value
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className="font-semibold text-sm">{type.label}</div>
            <div className="text-xs mt-1 opacity-75">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}