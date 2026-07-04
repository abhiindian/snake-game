import { useSelector } from 'react-redux'
import { CELL_SIZE, GRID_WIDTH, GRID_HEIGHT } from '@/utils/constants'
import type { Position } from '@/utils/gameEngine'
import type { RootState } from '@/store'
import styles from './GameBoard.module.css'

interface GameBoardProps {
  onRestart: () => void
}

type CellType = 'empty' | 'snake' | 'food' | 'snake-head'

function getCellType(
  x: number,
  y: number,
  snake: Position[],
  food: Position
): CellType {
  if (snake.length === 0) return 'empty'

  const head = snake[0]
  if (head.x === x && head.y === y) return 'snake-head'

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) return 'snake'
  }

  if (food.x === x && food.y === y) return 'food'

  return 'empty'
}

export function GameBoard({ onRestart }: GameBoardProps) {
  const snake = useSelector((state: RootState) => state.game.snake)
  const food = useSelector((state: RootState) => state.game.food)
  const status = useSelector((state: RootState) => state.game.status)

  const cells = []
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const cellType = getCellType(x, y, snake, food)
      cells.push(
        <div
          key={`${x}-${y}`}
          className={`${styles.cell} ${styles[cellType]}`}
          aria-label={
            cellType === 'snake-head'
              ? 'Snake head'
              : cellType === 'snake'
              ? 'Snake body'
              : cellType === 'food'
              ? 'Food'
              : 'Empty cell'
          }
        />
      )
    }
  }

  return (
    <div
      className={styles.board}
      style={{
        width: GRID_WIDTH * CELL_SIZE,
        height: GRID_HEIGHT * CELL_SIZE,
      }}
      role="grid"
      aria-label="Snake game board"
    >
      {cells}
      {status === 'gameOver' && (
        <div className={styles.overlay} role="alert" aria-label="Game Over" aria-live="assertive">
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button className={styles.restartBtn} onClick={onRestart}>
            Restart
          </button>
        </div>
      )}
    </div>
  )
}
