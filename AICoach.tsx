import React, { useState } from 'react';
import { Habit } from '../types';
import { generateHabitInsights } from '../services/geminiService';
import { Sparkles, Bot, AlertCircle } from 'lucide-react';

interface AICoachProps {
  habits: Habit[];
}

const AICoach: React.FC<AICoachProps> = ({ habits }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      if (habits.length === 0) {
        setAdvice("Track some habits first so I can analyze your progress!");
      } else {
        const result = await generateHabitInsights(habits);
        setAdvice(result);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
      
      {!advice && !loading && !error && (
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30">
            <Sparkles size={40} className="text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Gemini Coach</h2>
            <p className="text-gray-400">
              I can analyze your habit data locally and use Google's Gemini AI to provide personalized tips to keep you on track.
            </p>
          </div>
          <button
            onClick={handleGenerateAdvice}
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center mx-auto space-x-2"
          >
            <Sparkles size={18} />
            <span>Analyze My Habits</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 animate-pulse">Consulting the AI...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-sm text-center">
            <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
            <h3 className="text-red-400 font-bold mb-1">Connection Error</h3>
            <p className="text-red-300/80 text-sm mb-4">{error}</p>
            <button 
                onClick={handleGenerateAdvice}
                className="text-white bg-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-500"
            >
                Try Again
            </button>
        </div>
      )}

      {advice && !loading && (
        <div className="w-full max-w-lg bg-android-surface border border-gray-800 rounded-3xl p-6 shadow-2xl relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-[#121212]">
            <Bot size={24} className="text-white" />
          </div>
          
          <div className="mt-4 prose prose-invert max-w-none">
             <div className="whitespace-pre-line text-gray-200 leading-relaxed text-sm md:text-base">
               {advice}
             </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
             <span className="text-xs text-gray-500">Powered by Gemini 2.5 Flash</span>
             <button 
                onClick={() => setAdvice(null)}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
             >
                Close
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
