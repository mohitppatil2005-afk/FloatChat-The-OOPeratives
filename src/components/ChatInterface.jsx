import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendHorizonal, Loader2, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import GraphVisualizer from './GraphVisualizer.jsx';
import MockMap from './MockMap.jsx';
import { getFloatChatResponse } from '../utils/getFloatChatResponse.js';

export default function ChatInterface({ mode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [structuredBlock, setStructuredBlock] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, structuredBlock]);

  useEffect(() => {
    // reset structured block when switching modes
    setStructuredBlock(null);
  }, [mode]);

  const submit = useCallback(async () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    setInput('');
    setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content: prompt }]);
    setLoading(true);
    try {
      const res = await getFloatChatResponse({ mode, prompt });
      if (res.type === 'text') {
        setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: res.content }]);
      } else {
        setStructuredBlock(res);
        setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `${res.title}: ${res.description}` }]);
      }
    } catch (e) {
      setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: 'Error: failed to generate response.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, mode]);

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-6 p-6 pr-3">
        {messages.length === 0 && (
          <div className="mt-10 mx-auto max-w-md text-center text-slate-400 text-sm">
            <Sparkles className="mx-auto mb-4 text-brand-500" />
            <p className="leading-relaxed">Ask anything about ocean data. Try: "Explain El Niño impacts on Pacific thermocline" or switch modes for charts and geospatial exploration.</p>
          </div>
        )}
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        {structuredBlock?.type === 'visual' && <GraphVisualizer block={structuredBlock} />}
        {structuredBlock?.type === 'deep' && <MockMap block={structuredBlock} />}
      </div>
      <div className="border-t border-slate-800/60 p-4">
        <div className="flex gap-3 items-end">
          <textarea
            rows={1}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={e => setInput(e.target.value)}
            placeholder={`Enter ${mode} query...`}
            className="flex-1 resize-none rounded-xl bg-slate-800/70 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-500/50 px-4 py-3 text-sm shadow-inner placeholder-slate-500"
          />
          <button
            onClick={submit}
            disabled={loading || !input.trim()}
            className="h-11 px-5 rounded-xl font-medium text-sm flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-glow transition"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <SendHorizonal size={18} />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-wide text-slate-500 flex gap-4">
          <span>Mode: {mode}</span>
          <span>Mock AI latency active</span>
        </div>
      </div>
    </div>
  );
}
