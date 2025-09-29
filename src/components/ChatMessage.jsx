import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 w-full fade-in ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="size-8 rounded-full bg-brand-600 flex items-center justify-center text-white shrink-0 shadow-md">
          <Bot size={18} />
        </div>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-glow whitespace-pre-wrap ${isUser ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-slate-800/70 backdrop-blur border border-slate-700/60 rounded-tl-none'}`}>
        {message.content}
      </div>
      {isUser && (
        <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 shadow-md">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
