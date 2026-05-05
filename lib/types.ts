export type GameId = 'pong' | 'snake' | 'tetris' | 'space_invaders' | 'tic_tac_toe';

export interface GameInfo {
  id: GameId;
  name: string;
  description: string;
  snippet: string;
}

export const GAMES: Record<GameId, GameInfo> = {
  pong: {
    id: 'pong',
    name: 'Pong',
    description: 'A classic table tennis arcade game. Defeat the AI by scoring 5 points.',
    snippet: `// Vector reflection logic:
ball.vx = -ball.vx;
// Slight y angle change based on hit position
let hitPoint = (ball.y - paddle.y) / paddle.height;
ball.vy = hitPoint * MAX_ANGLE;`,
  },
  snake: {
    id: 'snake',
    name: 'Snake',
    description: "Eat the apples to grow longer, but don't bite your own tail!",
    snippet: `// Body update logic
const newHead = { x: head.x + dir.x, y: head.y + dir.y };
snake.unshift(newHead);
if (ateApple) {
  generateApple();
} else {
  snake.pop(); // Remove tail
}`,
  },
  tetris: {
    id: 'tetris',
    name: 'Tetris',
    description: 'Clear lines by forming complete solid rows without empty spaces.',
    snippet: `// Line clearing logic
grid.forEach((row, y) => {
  if (row.every(cell => cell !== 0)) {
    grid.splice(y, 1);
    grid.unshift(new Array(width).fill(0));
    score += 100;
  }
});`,
  },
  space_invaders: {
    id: 'space_invaders',
    name: 'Space Invaders',
    description: 'Shoot the descending aliens before they reach the bottom of the screen.',
    snippet: `// Bullet collision
bullets.forEach(b => {
  aliens.forEach(a => {
    if (collide(b, a)) {
      a.alive = false;
      b.active = false;
      score += 10;
    }
  });
});`,
  },
  tic_tac_toe: {
    id: 'tic_tac_toe',
    name: 'Tic-Tac-Toe',
    description: 'Get three in a row to win against the CPU.',
    snippet: `// Win checking logic
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // Rows
  [0,3,6],[1,4,7],[2,5,8], // Cols
  [0,4,8],[2,4,6]          // Diags
];
return winPatterns.find(p => 
  board[p[0]] && board[p[0]] === board[p[1]] && board[p[0]] === board[p[2]]
);`,
  }
};
