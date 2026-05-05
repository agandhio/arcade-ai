'use client';

import { useState } from 'react';

interface TicTacToeProps {
  inputs: Record<string, boolean>; // Ignored for tic tac toe, better to use clicks
}

type Player = 'X' | 'O' | null;

export function TicTacToeGame({ inputs }: TicTacToeProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  // We don't really use virtual inputs here, just direct click/tap.
  // We COULD wire up D-pad, but mouse/touch is much simpler and valid.

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const minimax = (newBoard: Player[], player: 'O' | 'X') => {
    // Basic AI could go here, or just random
    const emptySpots = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (emptySpots.length === 0) return -1;
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
  };

  const handleClick = (i: number) => {
    if (board[i] || gameOver || !xIsNext) return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    
    let winner = calculateWinner(newBoard);
    if (winner || !newBoard.includes(null)) {
      setGameOver(true);
      return;
    }

    setXIsNext(false);

    // CPU Move
    setTimeout(() => {
      const cpuMove = minimax(newBoard, 'O');
      if (cpuMove !== -1) {
        newBoard[cpuMove] = 'O';
        setBoard([...newBoard]);
        winner = calculateWinner(newBoard);
        if (winner || !newBoard.includes(null)) {
          setGameOver(true);
        }
        setXIsNext(true);
      }
    }, 500);
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `WINNER: ${winner}`;
  } else if (!board.includes(null)) {
    status = "DRAW!";
  } else {
    status = `PLAYER: X`;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-retro-amber text-xl mb-4 text-retro-glow">
        {status}
      </div>
      
      <div className="grid grid-cols-3 gap-2 bg-retro-green/20 p-2 retro-border aspect-square w-full max-w-[300px]">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={gameOver || cell !== null}
            className="bg-black border border-retro-green/50 text-4xl sm:text-6xl text-retro-green flex items-center justify-center hover:bg-gray-900 transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <h2 className="text-retro-amber text-2xl mb-6 text-retro-glow">
            {winner ? `${winner} WINS!` : 'DRAW!'}
          </h2>
          <button 
            onClick={() => {
              setBoard(Array(9).fill(null));
              setXIsNext(true);
              setGameOver(false);
            }}
            className="retro-border bg-gray-800 px-6 py-3 text-retro-green hover:bg-gray-700 active:bg-gray-600 cursor-pointer"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
