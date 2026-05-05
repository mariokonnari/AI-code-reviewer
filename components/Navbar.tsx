'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, BookMarked } from 'lucide-react';

interface NavbarProps {
  savedCount?: number;
}

export default function Navbar({ savedCount }: NavbarProps) {
  const pathname = usePathname();
  const isWorkspace = pathname === '/workspace';

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
            CodeReview <span className="text-blue-400 group-hover:text-blue-300">AI</span>
          </span>
        </Link>

        <Link
          href="/workspace"
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
            isWorkspace
              ? 'text-white bg-white/[0.08] border border-white/[0.10]'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          Workspace
          {savedCount !== undefined && savedCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20 leading-none">
              {savedCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
