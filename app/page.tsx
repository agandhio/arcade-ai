'use client';

import { useState, useCallback } from 'react';
import { GAMES, GameId } from '@/lib/types';
import { Terminal } from '@/components/Terminal';
import { Arcade } from '@/components/Arcade';
import { PongGame } from '@/components/games/PongGame';
import { SnakeGame } from '@/components/games/SnakeGame';
import { TicTacToeGame } from '@/components/games/TicTacToeGame';
import { SpaceInvadersGame } from '@/components/games/SpaceInvadersGame';
import { TetrisGame } from '@/components/games/TetrisGame';

export default function Home() {
  const [currentGameId, setCurrentGameId] = useState<GameId>('pong');
  
  // Expose virtual controller states
  const [inputs, setInputs] = useState<Record<string, boolean>>({
    up: false, down: false, left: false, right: false, a: false, b: false
  });

  const handleButtonDown = useCallback((btn: string) => {
    setInputs(prev => ({ ...prev, [btn]: true }));
  }, []);

  const handleButtonUp = useCallback((btn: string) => {
    setInputs(prev => ({ ...prev, [btn]: false }));
  }, []);

  const renderGame = () => {
    switch (currentGameId) {
      case 'pong': return <PongGame inputs={inputs} />;
      case 'snake': return <SnakeGame inputs={inputs} />;
      case 'tic_tac_toe': return <TicTacToeGame inputs={inputs} />;
      case 'space_invaders': return <SpaceInvadersGame inputs={inputs} />;
      case 'tetris': return <TetrisGame inputs={inputs} />;
      default: return <div className="text-white">Game Not Found</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] lg:h-screen w-full bg-[#0d0d0d] font-mono lg:p-4 lg:gap-4 lg:overflow-hidden relative">
      
      {/* Terminal Panel - Mobile bottom, Desktop left */}
      <div className="order-2 lg:order-1 w-full lg:w-[360px] lg:flex-none flex flex-col p-4 lg:p-0 gap-4 min-h-[400px] lg:h-full lg:min-h-0">
        <Terminal currentGame={GAMES[currentGameId]} />
      </div>

      {/* Arcade Panel - Mobile top, Desktop right */}
      <div className="order-1 lg:order-2 w-full flex-1 flex flex-col p-2 lg:p-0 min-h-[600px] lg:h-full lg:min-h-0">
        <Arcade 
          currentGame={GAMES[currentGameId]} 
          onGameChange={setCurrentGameId}
          onButtonDown={handleButtonDown}
          onButtonUp={handleButtonUp}
        >
          {renderGame()}
        </Arcade>
      </div>

    </div>
  );
}
