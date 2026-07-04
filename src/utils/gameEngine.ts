import {
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
} from './constants'

export type Position = { x: number; y: number }

/**
 * Check if a position is within grid boundaries.
 */
export function isInsideGrid(pos: Position): boolean {
  return pos.x >= 0 && pos.x < GRID_WIDTH && pos.y >= 0 && pos.y < GRID_HEIGHT
}

/**
 * Check if a position overlaps with the snake body.
 */
export function isOnSnake(pos: Position, snake: Position[]): boolean {
  return snake.some((segment) => segment.x === pos.x && segment.y === pos.y)
}

/**
 * Check if two positions are the same.
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y
}

/**
 * Check if a direction is a 180° reversal of another direction.
 */
export function isReversal(dir1: Position, dir2: Position): boolean {
  return dir1.x === -dir2.x && dir1.y === -dir2.y
}

/**
 * Calculate the next head position given current head and direction vector.
 */
export function getNextHead(head: Position, direction: Position): Position {
  return { x: head.x + direction.x, y: head.y + direction.y }
}

/**
 * Generate a random food position that does not overlap with the snake.
 */
export function generateFood(snake: Position[]): Position {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`))
  const freeCells: Position[] = []

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (!occupied.has(`${x},${y}`)) {
        freeCells.push({ x, y })
      }
    }
  }

  if (freeCells.length === 0) {
    // Player wins — board is full (extremely unlikely)
    return { x: 0, y: 0 }
  }

  return freeCells[Math.floor(Math.random() * freeCells.length)]
}

/**
 * Process a single game tick: move snake, handle food, detect collision.
 * Returns new game state fragment.
 */
export function processTick(
  snake: Position[],
  direction: Position,
  food: Position
): {
  newSnake: Position[]
  ateFood: boolean
  newFood: Position
  collided: boolean
} {
  const head = snake[0]
  const nextHead = getNextHead(head, direction)

  // Check wall collision
  if (!isInsideGrid(nextHead)) {
    return { newSnake: snake, ateFood: false, newFood: food, collided: true }
  }

  // Check self collision (against body excluding tail, since tail will move)
  // But if we ate food, tail stays, so check against full body
  const willEat = positionsEqual(nextHead, food)
  const bodyToCheck = willEat ? snake : snake.slice(0, -1)

  if (isOnSnake(nextHead, bodyToCheck)) {
    return { newSnake: snake, ateFood: false, newFood: food, collided: true }
  }

  const newSnake = [nextHead, ...snake]

  if (willEat) {
    const newFood = generateFood(newSnake)
    return { newSnake, ateFood: true, newFood, collided: false }
  }

  // Remove tail
  newSnake.pop()
  return { newSnake, ateFood: false, newFood: food, collided: false }
}

/**
 * Create initial game state for Redux.
 */
export function createInitialState() {
  const snake = [...INITIAL_SNAKE]
  const food = generateFood(snake)

  return {
    snake,
    direction: { ...INITIAL_DIRECTION },
    nextDirection: { ...INITIAL_DIRECTION },
    food,
    score: 0,
    status: 'idle' as const,
    tickSpeed: 120,
  }
}
