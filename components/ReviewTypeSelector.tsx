'use client';

import { Search, Shield, Zap, BookOpen, FlaskConical } from 'lucide-react';
import { ReviewType } from '@/types';

interface ReviewTypeSelectorProps {
  selected: ReviewType;
  onChange: (type: ReviewType) => void;
  disabled?: boolean;
}

const reviewTypes = [
  {
    value: 'general' as ReviewType,
    label: 'General',
    Icon: Search,
    description: 'Full review',
    gradient: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-500/30',
    glow: 'bg-blue-500/10',
  },
  {
    value: 'security' as ReviewType,
    label: 'Security',
    Icon: Shield,
    description: 'Vulnerabilities',
    gradient: 'from-red-500 to-rose-600',
    ring: 'ring-red-500/30',
    glow: 'bg-red-500/10',
  },
  {
    value: 'performance' as ReviewType,
    label: 'Performance',
    Icon: Zap,
    description: 'Optimize speed',
    gradient: 'from-amber-500 to-orange-500',
    ring: 'ring-amber-500/30',
    glow: 'bg-amber-500/10',
  },
  {
    value: 'readability' as ReviewType,
    label: 'Readability',
    Icon: BookOpen,
    description: 'Improve clarity',
    gradient: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-500/30',
    glow: 'bg-emerald-500/10',
  },
  {
    value: 'testing' as ReviewType,
    label: 'Testing',
    Icon: FlaskConical,
    description: 'Test coverage',
    gradient: 'from-purple-500 to-violet-600',
    ring: 'ring-purple-500/30',
    glow: 'bg-purple-500/10',
  },
];

export default function ReviewTypeSelector({
  selected,
  onChange,
  disabled,
}: ReviewTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Review Type</label>
      <div className="grid grid-cols-5 gap-2">
        {reviewTypes.map(({ value, label, Icon, description, gradient, ring, glow }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              disabled={disabled}
              className={`
                relative p-3 rounded-xl border transition-all duration-200 text-center group overflow-hidden
                ${
                  isSelected
                    ? `border-white/10 bg-gray-900 shadow-lg ring-1 ${ring}`
                    : 'border-gray-800 bg-gray-900/30 hover:border-gray-700 hover:bg-gray-900/60'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSelected && (
                <div className={`absolute inset-0 ${glow} pointer-events-none`} />
              )}
              <div
                className={`
                  relative w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center
                  bg-gradient-to-br ${gradient}
                  ${isSelected ? 'shadow-lg' : 'opacity-50 group-hover:opacity-75'}
                  transition-opacity
                `}
              >
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div
                className={`relative font-semibold text-xs ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`}
              >
                {label}
              </div>
              <div
                className={`relative text-[10px] mt-0.5 ${
                  isSelected ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
