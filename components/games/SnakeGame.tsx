'use client';

import { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
  inputs: Record<string, boolean>;
}

const GRID_SIZE = 20;
const TILE_COUNT = 20;

export function SnakeGame({ inputs }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Snake starting state
  const stateRef = useRef({
    snake: [
      { x: 10, y: 10 },
    ],
    dir: { x: 0, y: 0 }, // Not moving initially
    apple: { x: 15, y: 10 },
    gameOver: false,
    score: 0,
    lastTick: 0
  });

  const inputsRef = useRef(inputs);
  
  // Track previous inputs to detect edge triggers for virtual buttons
  const prevInputsRef = useRef({ ...inputs });

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  useEffect(() => {
    const state = stateRef.current;
    
    // Keyboard listener
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (state.dir.y !== 1) state.dir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (state.dir.y !== -1) state.dir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (state.dir.x !== 1) state.dir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (state.dir.x !== -1) state.dir = { x: 1, y: 0 };
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;

    const generateApple = () => {
      let nx = 0, ny = 0;
      while (true) {
        nx = Math.floor(Math.random() * TILE_COUNT);
        ny = Math.floor(Math.random() * TILE_COUNT);
        const onSnake = state.snake.some(segment => segment.x === nx && segment.y === ny);
        if (!onSnake) break;
      }
      state.apple = { x: nx, y: ny };
    };

    const update = (timestamp: number) => {
      if (state.gameOver) return;

      const curInputs = inputsRef.current;
      const prevInputs = prevInputsRef.current;

      // Only trigger on input DOWN edge
      if (curInputs.up && !prevInputs.up && state.dir.y !== 1) state.dir = { x: 0, y: -1 };
      if (curInputs.down && !prevInputs.down && state.dir.y !== -1) state.dir = { x: 0, y: 1 };
      if (curInputs.left && !prevInputs.left && state.dir.x !== 1) state.dir = { x: -1, y: 0 };
      if (curInputs.right && !prevInputs.right && state.dir.x !== -1) state.dir = { x: 1, y: 0 };

      // Make current inputs the prev inputs for next frame
      prevInputsRef.current = { ...curInputs };

      if (timestamp - state.lastTick > 100) { // 100ms per tick
        state.lastTick = timestamp;

        if (state.dir.x === 0 && state.dir.y === 0) return; // Don't move if dir is 0

        const head = state.snake[0];
        const newHead = { x: head.x + state.dir.x, y: head.y + state.dir.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= TILE_COUNT || newHead.y < 0 || newHead.y >= TILE_COUNT) {
          state.gameOver = true;
          setGameOver(true);
          return;
        }

        // Self collision
        if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          state.gameOver = true;
          setGameOver(true);
          return;
        }

        state.snake.unshift(newHead);

        // Apple collision
        if (newHead.x === state.apple.x && newHead.y === state.apple.y) {
          state.score += 10;
          setScore(state.score);
          generateApple();
        } else {
          state.snake.pop(); // Remove tail
        }
      }
    };

    const draw = () => {
      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apple
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(state.apple.x * GRID_SIZE, state.apple.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);

      // Snake
      ctx.fillStyle = '#4af626';
      state.snake.forEach(segment => {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
      });
    };

    const loop = (timestamp: number) => {
      update(timestamp);
      draw();
      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const resetGame = () => {
    stateRef.current = {
      snake: [
        { x: 10, y: 10 },
      ],
      dir: { x: 0, y: 0 },
      apple: { x: 15, y: 10 },
      gameOver: false,
      score: 0,
      lastTick: performance.now()
    };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-2 right-4 text-retro-glow text-retro-amber md:text-xl font-bold pointer-events-none z-10 w-full text-right px-4">
        SCORE: {score}
      </div>
      
      {/* Container to force aspect ratio for grid */}
      <div className="relative w-full max-w-[min(100%,_400px)] aspect-square self-center mx-auto">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * TILE_COUNT}
          height={GRID_SIZE * TILE_COUNT}
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <h2 className="text-retro-amber text-xl md:text-2xl mb-4 text-retro-glow">
              GAME OVER
            </h2>
            <button 
              onClick={resetGame}
              className="retro-border bg-gray-800 px-4 py-2 text-[10px] md:text-sm text-retro-green hover:bg-gray-700 active:bg-gray-600 cursor-pointer"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
