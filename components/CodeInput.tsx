'use client';

import { FileCode2 } from 'lucide-react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

const languages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
];

export default function CodeInput({
  value,
  onChange,
  language,
  onLanguageChange,
  disabled,
}: CodeInputProps) {
  const charCount = value.length;
  const isOverLimit = charCount > 10000;
  const percent = Math.min((charCount / 10000) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-300">Your Code</label>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs tabular-nums ${
                isOverLimit ? 'text-red-400' : 'text-gray-500'
              }`}
            >
              {charCount.toLocaleString()} / 10,000
            </span>
            <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverLimit
                    ? 'bg-red-500'
                    : percent > 80
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={disabled}
            className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 disabled:opacity-50 cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste your code here..."
        className="w-full h-96 px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-300 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 resize-none disabled:opacity-50 placeholder:text-gray-600 transition-all"
        spellCheck={false}
      />

      {isOverLimit && (
        <p className="text-xs text-red-400">
          Code exceeds the 10,000 character limit. Please trim it down.
        </p>
      )}
    </div>
  );
}
