import React from 'react';
import { Citrus, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-taiwaka-500 p-1.5 rounded-lg text-white">
             <Citrus size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Taiwaka</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-taiwaka-50 text-taiwaka-600 rounded-full border border-taiwaka-100">
            <Sparkles size={14} />
            <span>基于 Gemini 2.5 Flash 构建</span>
          </div>
        </div>
      </div>
    </header>
  );
};