import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import OnboardingContent from './OnboardingContent.jsx';
import ChatInterface from './ChatInterface.jsx';
import { getFloatChatResponse } from '../utils/getFloatChatResponse.js';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('standard');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [introData, setIntroData] = useState(null);

  useEffect(() => {
    // pre-load a mock insight for each mode for instant feel later (not used directly yet)
    ['standard','visual','deep'].forEach(m => {
      getFloatChatResponse({ mode: m, prompt: 'preload sample' }).then(r => {/* ignore */});
    });
  }, []);

  const handleSelectMode = useCallback(m => {
    setMode(m);
    setShowOnboarding(false);
  }, []);

  return (
    <div className="h-full flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar currentMode={mode} onModeChange={handleSelectMode} />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800/60 flex items-center px-6 gap-4 bg-slate-900/40 backdrop-blur">
          <Sparkles className="text-brand-500" />
          <h1 className="font-semibold tracking-wide text-sm">FloatChat – Multi-Modal Ocean AI Interface</h1>
          <div className="ml-auto flex gap-2 text-[10px] uppercase tracking-wide text-slate-500">
            <span>{mode} mode</span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 flex flex-col">
            {showOnboarding ? (
              <div className="p-10 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-semibold mb-2">Welcome to FloatChat</h2>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-prose">
                    Explore marine data modalities. Choose a mode to begin interacting with synthetic analysis services. This prototype demonstrates structured responses and multi-modal UI components without external APIs.
                  </p>
                  <OnboardingContent onSelect={handleSelectMode} />
                </div>
              </div>
            ) : (
              <ChatInterface mode={mode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
