'use client';

import { useState, useRef, useEffect } from 'react';
import { GameInfo } from '@/lib/types';

interface TerminalProps {
  currentGame: GameInfo;
}

export function Terminal({ currentGame }: TerminalProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `SYSTEM ONLINE.\nREADY TO PLAY ${currentGame.name}.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{ role: 'ai', text: `SWITCHED TO ${currentGame.name.toUpperCase()}.\nPRESS START TO BEGIN.` }]);
  }, [currentGame.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          gameContext: {
            gameName: currentGame.name,
            gameLogicSnippet: currentGame.snippet,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: `ERROR: ${data.error}` }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'ERROR: COMMUNICATION LINK BROKEN.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="flex flex-col gap-4 h-full w-full">
      {/* Code/Logic Panel */}
      <div className="flex-1 border-4 border-[#333] bg-black p-4 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center mb-2 border-b-2 border-[#333] pb-1 text-[10px] uppercase opacity-70 text-[#4af626]">
          <span>System: /code/explorer</span>
          <span className="animate-pulse">● ONLINE</span>
        </header>
        <div className="flex-1 text-[10px] md:text-[12px] leading-tight space-y-2 overflow-y-auto mt-2 text-[#4af626]">
          <p className="text-white">// {currentGame.name} Logic v1.0</p>
          <p className="text-gray-400">{currentGame.description}</p>
          <div className="mt-4 pt-2">
            <pre className="text-blue-300 whitespace-pre-wrap font-mono">
              <code>{currentGame.snippet}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="h-[50%] md:h-[300px] border-4 border-[#333] bg-black p-4 flex flex-col">
        <div className="flex-1 text-[11px] overflow-y-auto space-y-3 mb-2 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'ai' ? 'bg-[#1a1a1a] p-2 border-l-2 border-[#4af626]' : ''}`}>
              <span className={`text-xs ${msg.role === 'user' ? 'text-amber-400' : 'text-[#4af626]'}`}>
                {msg.role === 'user' ? '[USER]:' : '[AI]:'}
              </span>
              <p className={msg.role === 'user' ? 'text-gray-300' : 'text-gray-100 whitespace-pre-line'}>{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 bg-[#1a1a1a] p-2 border-l-2 border-[#4af626] animate-pulse">
              <span className="text-[#4af626] text-xs">[AI]:</span>
              <p className="text-gray-100">PROCESSING...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2 border-t-2 border-[#333] pt-3">
          <input
            className="flex-1 bg-[#111] border border-[#4af626] p-2 text-[10px] text-[#4af626] focus:outline-none focus:border-amber-400 placeholder-gray-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE COMMAND... _"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#4af626] text-black px-4 font-bold text-xs uppercase hover:bg-green-400 active:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </aside>
  );
}
