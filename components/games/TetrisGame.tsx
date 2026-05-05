'use client';

import { useEffect, useRef, useState } from 'react';

interface TetrisProps {
  inputs: Record<string, boolean>;
}

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

// Tetromino shapes
const SHAPES = [
  [], // 0 placeholder
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]], // J
  [[0,1,1],[1,1,0]], // S
  [[1,1,0],[0,1,1]]  // Z
];

const COLORS = [
  '#000', '#00f0f0', '#f0f000', '#a000f0', 
  '#f0a000', '#0000f0', '#00f000', '#f00000'
];

export function TetrisGame({ inputs }: TetrisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // We use refs to avoid closing over stale state in game loop
  const stateRef = useRef({
    grid: Array.from({length: ROWS}, () => Array(COLS).fill(0)),
    piece: { type: 1, x: 3, y: 0, matrix: SHAPES[1] },
    dropCounter: 0,
    dropInterval: 1000,
    score: 0,
    gameOver: false,
    lastTime: 0
  });

  const inputsRef = useRef(inputs);
  const prevInputsRef = useRef({ ...inputs });

  useEffect(() => { inputsRef.current = inputs; }, [inputs]);

  useEffect(() => {
    const keys = { ArrowLeft: false, ArrowRight: false, ArrowDown: false, ArrowUp: false, Space: false, a: false, d: false, s: false, w: false };
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

    let reqId: number;
    let lastKeyFrame = 0;

    const collide = (grid: number[][], p: any) => {
      const m = p.matrix;
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (m[y][x] !== 0 &&
             (grid[y + p.y] && grid[y + p.y][x + p.x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    };

    const merge = (grid: number[][], p: any) => {
      p.matrix.forEach((row: number[], y: number) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            grid[y + p.y][x + p.x] = p.type;
          }
        });
      });
    };

    const rotate = (matrix: number[][]) => {
      for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
      matrix.forEach(row => row.reverse());
    };

    const playerDrop = () => {
      const state = stateRef.current;
      state.piece.y++;
      if (collide(state.grid, state.piece)) {
        state.piece.y--;
        merge(state.grid, state.piece);
        resetPiece();
        sweep();
      }
      state.dropCounter = 0;
    };

    const playerMove = (offset: number) => {
      const state = stateRef.current;
      state.piece.x += offset;
      if (collide(state.grid, state.piece)) {
        state.piece.x -= offset;
      }
    };

    const playerRotate = () => {
      const state = stateRef.current;
      const pos = state.piece.x;
      let offset = 1;
      rotate(state.piece.matrix);
      while (collide(state.grid, state.piece)) {
        state.piece.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > state.piece.matrix[0].length) {
          // undo if can't rotate
          rotate(state.piece.matrix);
          rotate(state.piece.matrix);
          rotate(state.piece.matrix);
          state.piece.x = pos;
          return;
        }
      }
    };

    const resetPiece = () => {
      const state = stateRef.current;
      const type = (Math.floor(Math.random() * 7) + 1) % SHAPES.length;
      state.piece = {
        type,
        matrix: JSON.parse(JSON.stringify(SHAPES[type])), // Deep copy
        x: Math.floor(COLS / 2) - 1,
        y: 0
      };
      if (collide(state.grid, state.piece)) {
        state.grid = Array.from({length: ROWS}, () => Array(COLS).fill(0));
        state.gameOver = true;
        setGameOver(true);
      }
    };

    const sweep = () => {
      const state = stateRef.current;
      let rowCount = 1;
      outer: for (let y = state.grid.length - 1; y > 0; --y) {
        for (let x = 0; x < state.grid[y].length; ++x) {
          if (state.grid[y][x] === 0) continue outer;
        }
        const row = state.grid.splice(y, 1)[0].fill(0);
        state.grid.unshift(row);
        ++y;
        state.score += rowCount * 10;
        rowCount *= 2;
        setScore(state.score);
      }
    };

    const update = (time = 0) => {
      const state = stateRef.current;
      if (state.gameOver) return;

      const deltaTime = time - state.lastTime;
      state.lastTime = time;
      state.dropCounter += deltaTime;

      if (state.dropCounter > state.dropInterval) {
        playerDrop();
      }

      // Input polling
      const curInputs = inputsRef.current;
      const prevInputs = prevInputsRef.current;
      
      const isDown = (key: string, vkey: string) => {
        return (keys[key as keyof typeof keys] || curInputs[vkey]);
      };
      
      const isJustDown = (key: string, vkey: string) => {
        return (keys[key as keyof typeof keys] || (curInputs[vkey] && !prevInputs[vkey]));
      };

      // We use timestamps for keyboard to not flutter, but edge detection for virtual
      if (Date.now() - lastKeyFrame > 100) {
        if (isJustDown('ArrowLeft', 'left') || isJustDown('a', 'left')) playerMove(-1);
        if (isJustDown('ArrowRight', 'right') || isJustDown('d', 'right')) playerMove(1);
        if (isDown('ArrowDown', 'down') || isDown('s', 'down')) playerDrop();
        
        // Rotate
        if (isJustDown('ArrowUp', 'up') || isJustDown('w', 'up') || isJustDown('Space', 'a') || isJustDown('', 'b')) {
          playerRotate();
        }
        
        lastKeyFrame = Date.now();
      }

      prevInputsRef.current = { ...curInputs };
    };

    const drawMatrix = (matrix: number[][], offset: {x: number, y: number}) => {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = COLORS[value] || '#fff';
            // Scale by BLOCK_SIZE
            ctx.fillRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
    };

    const draw = () => {
      const state = stateRef.current;
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawMatrix(state.grid, { x: 0, y: 0 });
      drawMatrix(state.piece.matrix, { x: state.piece.x, y: state.piece.y });
    };

    const loop = (time = 0) => {
      update(time);
      draw();
      reqId = requestAnimationFrame(loop);
    };

    // Initialize first piece
    if (stateRef.current.piece.matrix.length === 0 || stateRef.current.piece.type === 1) { // 1 is default
       resetPiece();
    }

    loop();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetGame = () => {
    const type = (Math.floor(Math.random() * 7) + 1) % SHAPES.length;
    stateRef.current = {
      grid: Array.from({length: ROWS}, () => Array(COLS).fill(0)),
      piece: { type, x: 3, y: 0, matrix: JSON.parse(JSON.stringify(SHAPES[type])) },
      dropCounter: 0,
      dropInterval: 1000,
      score: 0,
      gameOver: false,
      lastTime: performance.now()
    };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-2 w-[200px] flex justify-between text-retro-glow text-retro-amber font-bold pointer-events-none z-10 text-[10px]">
        <span>SCORE</span>
        <span>{score}</span>
      </div>
      
      <div className="relative border-4 border-retro-amber/20 bg-black/50" style={{ width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE }}>
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="absolute inset-0"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <h2 className="text-retro-amber text-lg mb-4 text-retro-glow">
              GAME OVER
            </h2>
            <button 
              onClick={resetGame}
              className="retro-border bg-gray-800 px-2 py-1 text-[10px] text-retro-green hover:bg-gray-700 active:bg-gray-600 cursor-pointer"
            >
              RESTART
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
