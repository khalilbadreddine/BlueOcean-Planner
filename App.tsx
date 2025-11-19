import React, { useState, useCallback } from 'react';
import { BusinessIdeaState, INITIAL_PREFERENCES, UserPreferences } from './types';
import { generateBlueOceanStrategy } from './services/geminiService';
import { SparklesIcon, BrainIcon, ChevronRightIcon, AlertTriangleIcon } from './components/Icons';
import { ThinkingOverlay } from './components/ThinkingOverlay';
import { ResultDisplay } from './components/ResultDisplay';

const App: React.FC = () => {
  const [state, setState] = useState<BusinessIdeaState>({
    status: 'idle',
    content: null,
    error: null,
  });
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);

  const handleGenerate = useCallback(async () => {
    if (!process.env.API_KEY) {
      setState({ ...state, status: 'error', error: 'API Key not found. Please set process.env.API_KEY.' });
      return;
    }

    setState({ status: 'generating', content: null, error: null });

    try {
      const plan = await generateBlueOceanStrategy(preferences);
      setState({ status: 'complete', content: plan, error: null });
    } catch (err: any) {
      setState({ 
        status: 'error', 
        content: null, 
        error: err.message || "An unexpected error occurred." 
      });
    }
  }, [preferences, state]);

  const handleInputChange = (field: keyof UserPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  if (state.status === 'generating') {
    return <ThinkingOverlay />;
  }

  if (state.status === 'complete' && state.content) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12">
        <ResultDisplay content={state.content} onReset={() => setState({ status: 'idle', content: null, error: null })} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl mb-6">
             <BrainIcon className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            BlueOcean <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Planner</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Generate high-demand, low-competition digital product strategies using 
            <span className="text-brand-300 font-medium"> Gemini 3.0 Reasoning</span>.
          </p>
        </div>

        {/* Error Banner */}
        {state.status === 'error' && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-200">
            <AlertTriangleIcon className="w-5 h-5 mt-0.5 shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="space-y-6">
            
            {/* Input Group 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Preferred Industry (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. FinTech, EdTech, Health..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  value={preferences.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Target Audience (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Remote workers, Students..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  value={preferences.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                />
              </div>
            </div>

            {/* Input Group 2 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Your Strengths / Assets (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. React developer, Marketing expert, Access to legal data..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  value={preferences.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                />
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Initial Idea Seed (Optional)</label>
                <textarea 
                  placeholder="Have a vague idea? Describe it here, or leave blank for the AI to invent something entirely new."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all min-h-[100px] resize-none"
                  value={preferences.initialIdea}
                  onChange={(e) => handleInputChange('initialIdea', e.target.value)}
                />
            </div>

            {/* Action Button */}
            <button 
              onClick={handleGenerate}
              className="group w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 mt-4"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Generate Strategic Plan</span>
              <ChevronRightIcon className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-4">
              Uses Gemini 3.0 Pro Preview (32k Thinking Budget). Expect ~30s generation time.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;