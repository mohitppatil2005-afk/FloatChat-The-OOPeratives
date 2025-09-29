import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function GraphVisualizer({ block }) {
  if (!block) return null;
  return (
    <div className="mt-4 p-5 bg-slate-800/70 backdrop-blur rounded-xl border border-slate-700/60 shadow-glow">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-brand-600 text-white shadow">
          <BarChart3 size={18} />
        </div>
        <div>
          <h4 className="font-semibold text-sm">{block.title}</h4>
          <p className="text-xs text-slate-300">{block.description}</p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={block.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: '12px' }} />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} name="Temp (°C)" />
            <Line type="monotone" dataKey="salinity" stroke="#a855f7" strokeWidth={2} dot={false} name="Salinity (PSU)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
