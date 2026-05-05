'use client';

import { ReactNode } from 'react';
import { GameInfo, GAMES, GameId } from '@/lib/types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

interface ArcadeProps {
  currentGame: GameInfo;
  onGameChange: (id: GameId) => void;
  children: ReactNode; // The game canvas/component
  onButtonDown: (btn: string) => void;
  onButtonUp: (btn: string) => void;
}

export function Arcade({ currentGame, onGameChange, children, onButtonDown, onButtonUp }: ArcadeProps) {
  const gameOptions = Object.values(GAMES);

  return (
    <main className="flex-1 flex flex-col border-4 border-[#444] bg-[#1a1a1a] relative h-full">
      {/* Screen Reflection/Glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent z-10" />
      
      {/* Game Header / Selector */}
      <nav className="flex overflow-x-auto bg-[#111] border-b-4 border-[#333] shrink-0 custom-scrollbar z-20">
        {gameOptions.map((g, index) => (
          <button
            key={g.id}
            onClick={() => onGameChange(g.id)}
            className={`px-4 py-3 font-bold uppercase text-xs whitespace-nowrap min-w-max transition-colors ${
              currentGame.id === g.id 
                ? 'bg-[#4af626] text-black' 
                : 'text-[#4af626] opacity-70 border-r border-[#333] hover:opacity-100 hover:bg-[#222]'
            }`}
          >
            0{index + 1} {g.name}
          </button>
        ))}
      </nav>

      {/* Main Screen Viewport */}
      <div className="flex-1 bg-black m-2 md:m-6 border-4 border-[#222] shadow-[inset_0_0_40px_rgba(74,246,38,0.15)] relative flex items-center justify-center overflow-hidden min-h-[300px] z-20">
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none z-10" 
          style={{
            backgroundImage: 'linear-gradient(#4af626 1px, transparent 1px), linear-gradient(90deg, #4af626 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} 
        />
        
        {/* CRT Scanline overlay from old arcade */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20" />

        {children}
      </div>

      {/* Physical Controls Area */}
      <section className="bg-[#111] border-t-4 border-[#444] p-4 md:p-6 flex justify-between items-center relative shrink-0 z-20">
         {/* D-Pad */}
        <div className="grid grid-cols-3 gap-1">
          <div />
          <ControllerButton id="up" onDown={onButtonDown} onUp={onButtonUp}><ChevronUp size={24} className="md:w-8 md:h-8" /></ControllerButton>
          <div />
          <ControllerButton id="left" onDown={onButtonDown} onUp={onButtonUp}><ChevronLeft size={24} className="md:w-8 md:h-8" /></ControllerButton>
          <div className="bg-[#333] rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-[#222] rounded-full shadow-inner" />
          </div>
          <ControllerButton id="right" onDown={onButtonDown} onUp={onButtonUp}><ChevronRight size={24} className="md:w-8 md:h-8" /></ControllerButton>
          <div />
          <ControllerButton id="down" onDown={onButtonDown} onUp={onButtonUp}><ChevronDown size={24} className="md:w-8 md:h-8" /></ControllerButton>
          <div />
        </div>

         {/* Logo / Brand */}
         <div className="text-center hidden sm:block">
           <div className="text-xl md:text-2xl font-bold italic tracking-tighter text-white">ARCADE<span className="text-[#4af626]">AI</span></div>
           <p className="text-[8px] tracking-[0.3em] uppercase opacity-40 text-[#4af626]">Developer Edition v1.0</p>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-4 md:gap-8">
           <div className="text-center">
              <button
                onPointerDown={(e) => { e.preventDefault(); onButtonDown('b'); }}
                onPointerUp={(e) => { e.preventDefault(); onButtonUp('b'); }}
                onPointerLeave={(e) => { e.preventDefault(); onButtonUp('b'); }}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-600 border-b-8 border-red-800 shadow-lg flex items-center justify-center active:translate-y-1 active:border-b-4 transition-all"
              >
                <span className="text-white font-black text-lg md:text-xl font-sans">B</span>
              </button>
              <span className="text-[10px] uppercase mt-2 block opacity-50 text-[#4af626]">ACTION</span>
           </div>
           <div className="text-center">
              <button
                onPointerDown={(e) => { e.preventDefault(); onButtonDown('a'); }}
                onPointerUp={(e) => { e.preventDefault(); onButtonUp('a'); }}
                onPointerLeave={(e) => { e.preventDefault(); onButtonUp('a'); }}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-500 border-b-8 border-amber-700 shadow-lg flex items-center justify-center active:translate-y-1 active:border-b-4 transition-all"
              >
                <span className="text-black font-black text-lg md:text-xl font-sans">A</span>
              </button>
              <span className="text-[10px] uppercase mt-2 block opacity-50 text-[#4af626]">START</span>
           </div>
         </div>
      </section>
    </main>
  );
}

function ControllerButton({ 
  id, 
  children, 
  label,
  className = "text-[#888] bg-[#333] border-b-4 border-[#222]", 
  onDown, 
  onUp 
}: { 
  id: string, 
  children?: ReactNode, 
  label?: string,
  className?: string,
  onDown: (id: string) => void,
  onUp: (id: string) => void
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onPointerDown={(e) => { e.preventDefault(); onDown(id); }}
        onPointerUp={(e) => { e.preventDefault(); onUp(id); }}
        onPointerLeave={(e) => { e.preventDefault(); onUp(id); }}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-sm flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all ${className}`}
      >
        {children || <Circle className="fill-current" size={24} />}
      </button>
      {label && <span className="text-[10px] text-gray-500 font-bold">{label}</span>}
    </div>
  );
}
