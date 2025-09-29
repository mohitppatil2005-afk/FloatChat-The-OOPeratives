import React, { useState, useCallback } from 'react';
import { PanelsLeftRight, Pin, PinOff, Compass, BarChart3, Globe2 } from 'lucide-react';

const modes = [
  { key: 'standard', label: 'Standard', icon: Compass },
  { key: 'visual', label: 'Visual', icon: BarChart3 },
  { key: 'deep', label: 'Deep', icon: Globe2 }
];

export default function Sidebar({ currentMode, onModeChange }) {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);

  const toggle = useCallback(() => {
    if (pinned) return; // ignore toggle when pinned
    setExpanded(e => !e);
  }, [pinned]);

  return (
    <div
      onMouseEnter={() => !pinned && setExpanded(true)}
      onMouseLeave={() => !pinned && setExpanded(false)}
      className={`group relative h-full transition-all duration-300 ${expanded || pinned ? 'w-52' : 'w-16'} bg-slate-900/70 backdrop-blur border-r border-slate-800/60 flex flex-col`}
    >
      <div className="flex items-center justify-between px-3 h-14 border-b border-slate-800/60">
        <button
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300"
          onClick={() => setExpanded(e => !e)}
        >
          <PanelsLeftRight size={20} />
        </button>
        {(expanded || pinned) && (
          <button
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300"
            onClick={() => setPinned(p => !p)}
            title={pinned ? 'Unpin' : 'Pin sidebar'}
          >
            {pinned ? <PinOff size={18} /> : <Pin size={18} />}
          </button>
        )}
      </div>
      <div className="flex-1 py-4 space-y-2">
        {modes.map(m => {
          const active = currentMode === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onModeChange(m.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition rounded-xl border ${active ? 'bg-brand-600 text-white border-brand-500 shadow-glow' : 'border-transparent text-slate-300 hover:bg-slate-700/40 hover:text-white'} `}
            >
              <m.icon size={18} />
              {(expanded || pinned) && <span>{m.label}</span>}
            </button>
          );
        })}
      </div>
      <div className="p-3 text-[10px] text-slate-500 tracking-wide uppercase">
        {(expanded || pinned) ? 'FloatChat v0.1' : 'v0.1'}
      </div>
    </div>
  );
}
