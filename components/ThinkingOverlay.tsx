import React, { useState, useEffect } from 'react';
import { BrainIcon } from './Icons';

export const ThinkingOverlay: React.FC = () => {
  const [stage, setStage] = useState(0);
  const stages = [
    "Analyzing global market trends...",
    "Identifying low-competition niches...",
    "Synthesizing business model architecture...",
    "Drafting technical requirements...",
    "Finalizing strategic roadmap..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % stages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
        <BrainIcon className="w-24 h-24 text-brand-400 animate-bounce relative z-10" />
      </div>
      
      <h3 className="mt-8 text-2xl font-display font-bold text-white tracking-tight">
        Deep Reasoning Active
      </h3>
      
      <div className="mt-4 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 animate-shimmer bg-[linear-gradient(90deg,transparent,#38bdf8,transparent)] w-full"></div>
      </div>

      <p className="mt-4 text-slate-400 font-light text-lg animate-pulse">
        {stages[stage]}
      </p>

      <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-lg max-w-md text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Why is this taking time?</p>
        <p className="text-sm text-slate-400">
          We are using the <strong>Gemini 3.0 Pro</strong> model with an extended thinking budget (32k tokens) to ensure your business plan is based on deep, multi-step strategic reasoning, not just surface-level generation.
        </p>
      </div>
    </div>
  );
};
