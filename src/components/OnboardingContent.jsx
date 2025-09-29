import React from 'react';
import { Compass, BarChart3, Globe2 } from 'lucide-react';

const cards = [
  {
    icon: Compass,
    title: 'Standard Query',
    mode: 'standard',
    desc: 'Ask about currents, temperature anomalies, oxygen trends and more using natural language.'
  },
  {
    icon: BarChart3,
    title: 'Visual Discovery',
    mode: 'visual',
    desc: 'Generate quick exploratory charts for model outputs and station time series.'
  },
  {
    icon: Globe2,
    title: 'Deep Search',
    mode: 'deep',
    desc: 'Probe bathymetry & geospatial patterns with synthetic sampling overlays.'
  }
];

export default function OnboardingContent({ onSelect }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5 mt-8">
      {cards.map(c => (
        <button
          key={c.mode}
            onClick={() => onSelect(c.mode)}
          className="group relative p-5 rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur hover:border-brand-500 hover:bg-slate-800/70 transition shadow-glow text-left"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white inline-flex shadow mb-4">
            <c.icon size={20} />
          </div>
          <h3 className="font-semibold mb-1 text-sm">{c.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
          <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-brand-400/40 pointer-events-none" />
        </button>
      ))}
    </div>
  );
}
