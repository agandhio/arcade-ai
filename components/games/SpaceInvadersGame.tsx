'use client';

import { useEffect, useRef, useState } from 'react';

interface SpaceInvadersProps {
  inputs: Record<string, boolean>;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 15;
const ALIEN_SIZE = 20;

export function SpaceInvadersGame({ inputs }: SpaceInvadersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  const stateRef = useRef({
    player: { x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 30 },
    bullets: [] as { x: number, y: number }[],
    aliens: [] as { x: number, y: number, alive: boolean }[],
    alienDir: 1,
    alienSpeed: 1,
    score: 0,
    gameOver: false,
    victory: false,
    lastBulletFrame: 0,
    frameCount: 0
  });

  const inputsRef = useRef(inputs);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);

  const initAliens = () => {
    const aliens = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        aliens.push({
          x: 50 + col * 50,
          y: 40 + row * 40,
          alive: true
        });
      }
    }
    return aliens;
  };

  useEffect(() => {
    const keys = { ArrowLeft: false, ArrowRight: false, Space: false, a: false, d: false, w: false };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') keys.Space = true;
      if (keys.hasOwnProperty(e.key)) keys[e.key as keyof typeof keys] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') keys.Space = false;
      if (keys.hasOwnProperty(e.key)) keys[e.key as keyof typeof keys] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    stateRef.current.aliens = initAliens();
    let reqId: number;

    const update = () => {
      const state = stateRef.current;
      if (state.gameOver || state.victory) return;

      state.frameCount++;
      const curInputs = inputsRef.current;

      // Player limits
      if (curInputs.left || keys.ArrowLeft || keys.a) state.player.x -= 4;
      if (curInputs.right || keys.ArrowRight || keys.d) state.player.x += 4;
      state.player.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.player.x));

      // Shooting
      if ((curInputs.a || keys.Space || keys.w) && state.frameCount - state.lastBulletFrame > 20) {
        state.bullets.push({ x: state.player.x + PLAYER_WIDTH / 2, y: state.player.y });
        state.lastBulletFrame = state.frameCount;
      }

      // Update bullets
      state.bullets.forEach(b => b.y -= 7);
      state.bullets = state.bullets.filter(b => b.y > 0);

      // Update aliens logic
      let hitEdge = false;
      let lowestAlienY = 0;
      let aliveCount = 0;

      state.aliens.forEach(a => {
        if (!a.alive) return;
        aliveCount++;
        a.x += state.alienDir * state.alienSpeed;
        if (a.x <= 0 || a.x + ALIEN_SIZE >= CANVAS_WIDTH) {
          hitEdge = true;
        }
        if (a.y > lowestAlienY) lowestAlienY = a.y;
      });

      if (aliveCount === 0) {
        state.victory = true;
        setVictory(true);
        return;
      }

      if (hitEdge) {
        state.alienDir *= -1;
        state.aliens.forEach(a => { if (a.alive) a.y += 20; });
        state.alienSpeed += 0.2; // Speed up
      }

      if (lowestAlienY + ALIEN_SIZE >= state.player.y) {
        state.gameOver = true;
        setGameOver(true);
      }

      // Collision detection
      state.bullets.forEach((b, bIdx) => {
        state.aliens.forEach((a) => {
          if (a.alive && b.x > a.x && b.x < a.x + ALIEN_SIZE && b.y > a.y && b.y < a.y + ALIEN_SIZE) {
            a.alive = false;
            // Hacky remove bullet
            b.y = -100;
            state.score += 10;
            setScore(state.score);
          }
        });
      });
    };

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const state = stateRef.current;

      // Draw Player
      ctx.fillStyle = '#4af626';
      ctx.fillRect(state.player.x, state.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      ctx.fillRect(state.player.x + 10, state.player.y - 5, 10, 5);

      // Draw Bullets
      ctx.fillStyle = '#ffb000';
      state.bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, 4, 10);
      });

      // Draw Aliens
      ctx.fillStyle = '#ff3333';
      state.aliens.forEach(a => {
        if (a.alive) {
          ctx.fillRect(a.x, a.y, ALIEN_SIZE, ALIEN_SIZE);
          ctx.fillRect(a.x + 4, a.y + Math.sin(state.frameCount * 0.1) * 3, ALIEN_SIZE - 8, ALIEN_SIZE - 8);
        }
      });
    };

    const loop = () => {
      update();
      draw();
      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetGame = () => {
    stateRef.current = {
      player: { x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 30 },
      bullets: [],
      aliens: initAliens(),
      alienDir: 1,
      alienSpeed: 1,
      score: 0,
      gameOver: false,
      victory: false,
      lastBulletFrame: 0,
      frameCount: 0
    };
    setScore(0);
    setGameOver(false);
    setVictory(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-4 w-full flex justify-between px-8 text-retro-glow text-retro-amber md:text-xl font-bold pointer-events-none z-10">
        <span>SCORE: {score}</span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full object-contain"
      />

      {(gameOver || victory) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <h2 className={`text-2xl mb-4 text-retro-glow ${victory ? 'text-retro-green' : 'text-retro-amber'}`}>
            {victory ? 'SECTOR CLEARED!' : 'GAME OVER'}
          </h2>
          <button 
            onClick={resetGame}
            className="retro-border bg-gray-800 px-4 py-2 text-retro-green hover:bg-gray-700 active:bg-gray-600 cursor-pointer"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
