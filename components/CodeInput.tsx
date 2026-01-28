'use client';

import { useState } from 'react';

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
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Your Code
        </label>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${charCount > 10000 ? 'text-red-400' : 'text-gray-500'}`}>
            {charCount.toLocaleString()} / 10,000 characters
          </span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={disabled}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
        onChange={handleChange}
        disabled={disabled}
        placeholder="Paste your code here..."
        className="w-full h-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
        spellCheck={false}
      />
      
      {charCount > 10000 && (
        <p className="text-xs text-red-400">
          ⚠️ Code exceeds maximum length. Please reduce to 10,000 characters or less.
        </p>
      )}
    </div>
  );
}