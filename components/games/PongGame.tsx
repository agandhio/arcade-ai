'use client';

import { useEffect, useRef, useState } from 'react';

interface PongGameProps {
  inputs: Record<string, boolean>;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 8;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;

export function PongGame({ inputs }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, cpu: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Use refs for game state to avoid dependency issues in animation frame
  const stateRef = useRef({
    p1Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    cpuY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVX: BALL_SPEED,
    ballVY: BALL_SPEED * 0.5,
    score: { p1: 0, cpu: 0 },
    gameOver: false,
  });

  const inputsRef = useRef(inputs);
  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  useEffect(() => {
    // Keyboard listener
    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };
    const handleKeyDown = (e: KeyboardEvent) => { if (keys.hasOwnProperty(e.key)) keys[e.key as keyof typeof keys] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { if (keys.hasOwnProperty(e.key)) keys[e.key as keyof typeof keys] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;

    const resetBall = () => {
      stateRef.current.ballX = CANVAS_WIDTH / 2;
      stateRef.current.ballY = CANVAS_HEIGHT / 2;
      stateRef.current.ballVX = -stateRef.current.ballVX;
      stateRef.current.ballVY = (Math.random() > 0.5 ? 1 : -1) * (BALL_SPEED * 0.5);
    };

    const update = () => {
      if (stateRef.current.gameOver) return;

      const state = stateRef.current;
      const curInputs = inputsRef.current;

      // Player Movement (Virtual + Keyboard)
      if (curInputs.up || curInputs.a || keys.w || keys.ArrowUp) {
        state.p1Y = Math.max(0, state.p1Y - PADDLE_SPEED);
      }
      if (curInputs.down || curInputs.b || keys.s || keys.ArrowDown) {
        state.p1Y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.p1Y + PADDLE_SPEED);
      }

      // CPU Movement (Simple AI tracking ball)
      const cpuCenter = state.cpuY + PADDLE_HEIGHT / 2;
      if (cpuCenter < state.ballY - 10) {
        state.cpuY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.cpuY + PADDLE_SPEED * 0.8);
      } else if (cpuCenter > state.ballY + 10) {
        state.cpuY = Math.max(0, state.cpuY - PADDLE_SPEED * 0.8);
      }

      // Ball Movement
      state.ballX += state.ballVX;
      state.ballY += state.ballVY;

      // Ceiling and Floor collision
      if (state.ballY <= 0 || state.ballY + BALL_SIZE >= CANVAS_HEIGHT) {
        state.ballVY = -state.ballVY;
      }

      // Paddle collision
      // P1 Paddle
      if (
        state.ballX <= PADDLE_WIDTH * 2 &&
        state.ballY + BALL_SIZE >= state.p1Y &&
        state.ballY <= state.p1Y + PADDLE_HEIGHT
      ) {
        state.ballVX = Math.abs(state.ballVX);
        const hitPoint = (state.ballY - (state.p1Y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        state.ballVY = hitPoint * BALL_SPEED; // Max speed based on hit point
      }

      // CPU Paddle
      if (
        state.ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH * 2 &&
        state.ballY + BALL_SIZE >= state.cpuY &&
        state.ballY <= state.cpuY + PADDLE_HEIGHT
      ) {
        state.ballVX = -Math.abs(state.ballVX);
        const hitPoint = (state.ballY - (state.cpuY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        state.ballVY = hitPoint * BALL_SPEED;
      }

      // Scoring
      if (state.ballX < 0) {
        state.score.cpu += 1;
        setScore({ ...state.score });
        if (state.score.cpu >= 5) {
          state.gameOver = true;
          setGameOver(true);
        } else {
          resetBall();
        }
      } else if (state.ballX > CANVAS_WIDTH) {
        state.score.p1 += 1;
        setScore({ ...state.score });
        if (state.score.p1 >= 5) {
          state.gameOver = true;
          setGameOver(true);
        } else {
          resetBall();
        }
      }
    };

    const draw = () => {
      const state = stateRef.current;
      
      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Center Line
      ctx.fillStyle = '#333';
      for (let i = 0; i < CANVAS_HEIGHT; i += 20) {
        ctx.fillRect(CANVAS_WIDTH / 2 - 1, i, 2, 10);
      }

      ctx.fillStyle = '#4af626';

      // Paddles
      ctx.fillRect(PADDLE_WIDTH, state.p1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH * 2, state.cpuY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillRect(state.ballX, state.ballY, BALL_SIZE, BALL_SIZE);
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
      p1Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      cpuY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVX: BALL_SPEED,
      ballVY: BALL_SPEED * 0.5,
      score: { p1: 0, cpu: 0 },
      gameOver: false,
    };
    setScore({ p1: 0, cpu: 0 });
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-4 w-full flex justify-between px-16 text-retro-glow text-retro-amber md:text-2xl font-bold pointer-events-none">
        <span>{score.p1}</span>
        <span>{score.cpu}</span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full object-contain"
      />

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <h2 className="text-retro-amber text-2xl mb-4 text-retro-glow">
            {score.p1 >= 5 ? 'YOU WIN!' : 'CPU WINS!'}
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
