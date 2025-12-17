import React from 'react';
import { Region } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  region: Region;
  onRegionChange: (region: Region) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, region, onRegionChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed w-full top-0 z-50 transition-all duration-300 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          {/* Logo Area */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200 transition-transform group-hover:scale-105 group-hover:rotate-3">
              {region === Region.SRI_LANKA ? '🇱🇰' : '🌎'}
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                LankaFit
              </h1>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Smart Diet AI</p>
            </div>
          </div>
          
          {/* Controls Area */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onRegionChange(Region.SRI_LANKA)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  region === Region.SRI_LANKA 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                }`}
              >
                Sri Lanka
              </button>
              <button
                onClick={() => onRegionChange(Region.WORLDWIDE)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  region === Region.WORLDWIDE 
                    ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                }`}
              >
                Worldwide
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="text-emerald-600 font-bold text-lg mb-2">LankaFit</div>
          <p className="text-slate-600 text-sm max-w-md mx-auto font-medium">
            © {new Date().getFullYear()}. Personalized nutrition powered by Gemini AI. 
            Currently serving <span className="font-bold text-emerald-700">{region}</span> context.
          </p>
          <p className="mt-6 text-xs text-slate-400">
            Disclaimer: This is an AI-generated plan. Please consult a healthcare professional before making drastic changes to your diet.
          </p>
        </div>
      </footer>
    </div>
  );
};