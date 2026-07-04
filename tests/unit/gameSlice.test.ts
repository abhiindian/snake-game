import { describe, it, expect } from 'vitest'
import gameReducer, {
  startGame,
  pauseGame,
  resumeGame,
  togglePause,
  changeDirection,
  tick,
  restartGame,
} from '@/store/gameSlice'
import { INITIAL_SNAKE, INITIAL_DIRECTION } from '@/utils/constants'
import type { GameState } from '@/store/gameSlice'

const initialState: GameState = {
  status: 'idle',
  score: 0,
  gridSize: { width: 40, height: 40 },
  snake: [...INITIAL_SNAKE],
  direction: { ...INITIAL_DIRECTION },
  nextDirection: { ...INITIAL_DIRECTION },
  food: { x: 10, y: 10 },
  tickSpeed: 120,
}

describe('gameSlice', () => {
  it('has initial state', () => {
    const state = gameReducer(undefined, { type: 'undefined' })
    expect(state.status).toBe('idle')
    expect(state.score).toBe(0)
    expect(state.snake.length).toBe(3)
  })

  it('startGame sets status to running', () => {
    const state = gameReducer(initialState, startGame())
    expect(state.status).toBe('running')
  })

  it('pauseGame changes status to paused', () => {
    const runningState = { ...initialState, status: 'running' }
    const state = gameReducer(runningState, pauseGame())
    expect(state.status).toBe('paused')
  })

  it('pauseGame does nothing when already paused', () => {
    const pausedState = { ...initialState, status: 'paused' }
    const state = gameReducer(pausedState, pauseGame())
    expect(state.status).toBe('paused')
  })

  it('resumeGame changes status to running', () => {
    const pausedState = { ...initialState, status: 'paused' }
    const state = gameReducer(pausedState, resumeGame())
    expect(state.status).toBe('running')
  })

  it('togglePause switches from running to paused', () => {
    const runningState = { ...initialState, status: 'running' }
    const state = gameReducer(runningState, togglePause())
    expect(state.status).toBe('paused')
  })

  it('togglePause switches from paused to running', () => {
    const pausedState = { ...initialState, status: 'paused' }
    const state = gameReducer(pausedState, togglePause())
    expect(state.status).toBe('running')
  })

  it('changeDirection updates nextDirection', () => {
    const state = gameReducer(initialState, changeDirection({ x: 0, y: -1 }))
    expect(state.nextDirection).toEqual({ x: 0, y: -1 })
  })

  it('changeDirection prevents 180° reversal', () => {
    const state = gameReducer(
      initialState,
      changeDirection({ x: -1, y: 0 })
    )
    // Initial direction is { x: 1, y: 0 }, so { x: -1, y: 0 } should be rejected
    expect(state.nextDirection).toEqual(INITIAL_DIRECTION)
  })

  it('changeDirection allows perpendicular direction', () => {
    const state = gameReducer(
      initialState,
      changeDirection({ x: 0, y: -1 })
    )
    expect(state.nextDirection).toEqual({ x: 0, y: -1 })
  })

  it('tick moves snake when running', () => {
    const runningState: GameState = {
      ...initialState,
      status: 'running',
      snake: [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 6, y: 5 },
    }
    const state = gameReducer(runningState, tick())
    expect(state.snake[0]).toEqual({ x: 6, y: 5 })
    expect(state.score).toBe(10)
    expect(state.status).toBe('running')
  })

  it('tick ends game on wall collision', () => {
    const wallState: GameState = {
      ...initialState,
      status: 'running',
      snake: [{ x: 39, y: 0 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 0, y: 0 },
    }
    const state = gameReducer(wallState, tick())
    expect(state.status).toBe('gameOver')
  })

  it('tick ends game on self collision', () => {
    const selfState: GameState = {
      ...initialState,
      status: 'running',
      snake: [
        { x: 0, y: 0 }, // head
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 0 }, // tail
      ],
      direction: { x: -1, y: 0 },
      nextDirection: { x: -1, y: 0 },
      food: { x: 5, y: 5 },
    }
    // Next head = {x:-1, y:0} — wall collision, not self
    const state = gameReducer(selfState, tick())
    expect(state.status).toBe('gameOver')
  })

  it('tick does nothing when paused', () => {
    const pausedState: GameState = {
      ...initialState,
      status: 'paused',
      snake: [{ x: 5, y: 5 }],
    }
    const state = gameReducer(pausedState, tick())
    expect(state.status).toBe('paused')
  })

  it('restartGame resets all state', () => {
    const gameOverState: GameState = {
      ...initialState,
      status: 'gameOver',
      score: 100,
      snake: [{ x: 10, y: 10 }],
    }
    const state = gameReducer(gameOverState, restartGame())
    expect(state.status).toBe('running')
    expect(state.score).toBe(0)
    expect(state.snake).toEqual(INITIAL_SNAKE)
    expect(state.direction).toEqual(INITIAL_DIRECTION)
    expect(state.nextDirection).toEqual(INITIAL_DIRECTION)
  })
})
