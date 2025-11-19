import React from 'react';
import { RocketIcon } from './Icons';

interface ResultDisplayProps {
  content: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onReset }) => {
  // Simple markdown parser for display purposes since we can't use external deps easily
  // In a real app with deps, we would use react-markdown
  
  const renderContent = (text: string) => {
    // This splits the text by newlines to handle paragraphs, but lets CSS handle the heavy lifting
    // The CSS in index.html handles headers (h1, h2, h3) if we wrap them right, 
    // but pure raw text output from Gemini usually contains Markdown symbols.
    // We will rely on a wrapper with `white-space: pre-wrap` and some basic highlighting.
    
    // A rudimentary parsing to wrap headers for styling hooks defined in index.html
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index}>{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index}>{line.replace('## ', '')}</h2>;
      } else if (line.startsWith('# ')) {
        return <h1 key={index}>{line.replace('# ', '')}</h1>;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
         return <li key={index} className="ml-4">{line.replace(/^[-*]\s/, '')}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        // Bold text handling (simple)
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={index}>
                {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
        );
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/20">
        
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-slate-700 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <RocketIcon className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">Strategic Blueprint</h2>
              <p className="text-sm text-slate-400">Generated with Gemini 3.0 Pro Reasoning</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            New Strategy
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 overflow-y-auto max-h-[75vh]">
            <div className="markdown-body">
                {renderContent(content)}
            </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-6 border-t border-slate-800 flex justify-center">
            <p className="text-slate-500 text-sm">
                Disclaimer: This is an AI-generated business plan. Conduct independent market research before investing.
            </p>
        </div>
      </div>
    </div>
  );
};
