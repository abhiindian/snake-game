import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  TICK_SPEED,
} from '@/utils/constants'
import { generateFood, processTick, type Position } from '@/utils/gameEngine'

export type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver'

export interface GameState {
  status: GameStatus
  score: number
  gridSize: { width: number; height: number }
  snake: Position[]
  direction: Position
  nextDirection: Position
  food: Position
  tickSpeed: number
}

const initialState: GameState = {
  status: 'idle',
  score: 0,
  gridSize: { width: GRID_WIDTH, height: GRID_HEIGHT },
  snake: [...INITIAL_SNAKE],
  direction: { ...INITIAL_DIRECTION },
  nextDirection: { ...INITIAL_DIRECTION },
  food: generateFood(INITIAL_SNAKE),
  tickSpeed: TICK_SPEED,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.status = 'running'
    },
    pauseGame: (state) => {
      if (state.status === 'running') {
        state.status = 'paused'
      }
    },
    resumeGame: (state) => {
      if (state.status === 'paused') {
        state.status = 'running'
      }
    },
    togglePause: (state) => {
      if (state.status === 'running') {
        state.status = 'paused'
      } else if (state.status === 'paused') {
        state.status = 'running'
      }
    },
    changeDirection: (state, action: PayloadAction<Position>) => {
      const newDir = action.payload
      // Prevent 180° reversal
      if (
        newDir.x !== -state.direction.x ||
        newDir.y !== -state.direction.y
      ) {
        state.nextDirection = newDir
      }
    },
    tick: (state) => {
      if (state.status !== 'running') return

      // Apply buffered direction
      state.direction = { ...state.nextDirection }

      // head already available via state.snake[0]
      const result = processTick(state.snake, state.direction, state.food)

      if (result.collided) {
        state.status = 'gameOver'
        return
      }

      state.snake = result.newSnake
      if (result.ateFood) {
        state.food = result.newFood
        state.score += 10
      }
    },
    restartGame: (state) => {
      state.snake = [...INITIAL_SNAKE]
      state.direction = { ...INITIAL_DIRECTION }
      state.nextDirection = { ...INITIAL_DIRECTION }
      state.food = generateFood(INITIAL_SNAKE)
      state.score = 0
      state.tickSpeed = TICK_SPEED
      state.status = 'running'
    },
  },
})

export const {
  startGame,
  pauseGame,
  resumeGame,
  togglePause,
  changeDirection,
  tick,
  restartGame,
} = gameSlice.actions

export default gameSlice.reducer
