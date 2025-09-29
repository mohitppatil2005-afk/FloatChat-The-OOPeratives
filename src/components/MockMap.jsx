import React from 'react';
import { Globe2 } from 'lucide-react';

export default function MockMap({ block }) {
  if (!block) return null;
  return (
    <div className="mt-4 p-5 bg-slate-800/70 backdrop-blur rounded-xl border border-slate-700/60 shadow-glow">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-brand-600 text-white shadow">
          <Globe2 size={18} />
        </div>
        <div>
          <h4 className="font-semibold text-sm">{block.title}</h4>
          <p className="text-xs text-slate-300">{block.description}</p>
        </div>
      </div>
      <div className="relative h-64 rounded-lg overflow-hidden border border-slate-700/60 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #3b82f6 0, transparent 60%)' }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
          {block.features.map(f => (
            <g key={f.id}>
              <circle cx={(f.lon + 180) / 360 * 800} cy={(200 - (f.lat / 90) * 180)} r={5} fill="#3b82f6" fillOpacity={0.85} />
              <text x={(f.lon + 180) / 360 * 800 + 8} y={(200 - (f.lat / 90) * 180) + 4} fontSize={10} fill="#e2e8f0">{f.depth}m</text>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-2 right-2 text-[10px] px-2 py-1 bg-slate-900/70 rounded">
          Synthetic Map Layer
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {block.features.slice(0,4).map(f => (
          <div key={f.id} className="rounded-lg border border-slate-700/60 p-2 bg-slate-900/50">
            <div className="font-medium">{f.lat},{f.lon}</div>
            <div className="text-slate-400">Depth: {f.depth} m</div>
            <div className="text-slate-400">Val: {f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
