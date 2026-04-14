'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AppleStickyNavProps {
  title: string;
}

export default function AppleStickyNav({ title }: AppleStickyNavProps) {
  // Opcjonalnie: można ukrywać paski przy przewijaniu w dół i pokazywać w górę,
  // ale Apple stosuje prosty lepki (sticky) blur.
  
  return (
    <div className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#161617]/70 backdrop-blur-xl border-b-[0.5px] border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 h-[52px] flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-gray-500 font-medium">
            Od 12 999 zł
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full font-medium transition-colors">
            Kup
          </button>
        </div>
      </div>
    </div>
  );
}
