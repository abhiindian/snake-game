import { describe, it, expect } from 'vitest'
import {
  isInsideGrid,
  isOnSnake,
  positionsEqual,
  isReversal,
  getNextHead,
  generateFood,
  processTick,
  createInitialState,
} from '@/utils/gameEngine'
import { GRID_WIDTH, GRID_HEIGHT } from '@/utils/constants'

describe('isInsideGrid', () => {
  it('returns true for positions within grid', () => {
    expect(isInsideGrid({ x: 0, y: 0 })).toBe(true)
    expect(isInsideGrid({ x: 19, y: 19 })).toBe(true)
    expect(isInsideGrid({ x: GRID_WIDTH - 1, y: GRID_HEIGHT - 1 })).toBe(true)
  })

  it('returns false for positions outside grid', () => {
    expect(isInsideGrid({ x: -1, y: 0 })).toBe(false)
    expect(isInsideGrid({ x: 0, y: -1 })).toBe(false)
    expect(isInsideGrid({ x: GRID_WIDTH, y: 0 })).toBe(false)
    expect(isInsideGrid({ x: 0, y: GRID_HEIGHT })).toBe(false)
  })
})

describe('isOnSnake', () => {
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]

  it('returns true if position is on snake', () => {
    expect(isOnSnake({ x: 5, y: 5 }, snake)).toBe(true)
    expect(isOnSnake({ x: 4, y: 5 }, snake)).toBe(true)
  })

  it('returns false if position is not on snake', () => {
    expect(isOnSnake({ x: 6, y: 6 }, snake)).toBe(false)
    expect(isOnSnake({ x: 0, y: 0 }, snake)).toBe(false)
  })
})

describe('positionsEqual', () => {
  it('returns true for equal positions', () => {
    expect(positionsEqual({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true)
  })

  it('returns false for different positions', () => {
    expect(positionsEqual({ x: 1, y: 2 }, { x: 2, y: 1 })).toBe(false)
    expect(positionsEqual({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(false)
  })
})

describe('isReversal', () => {
  it('returns true for opposite directions', () => {
    expect(isReversal({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(true)
    expect(isReversal({ x: 0, y: 1 }, { x: 0, y: -1 })).toBe(true)
  })

  it('returns false for same direction', () => {
    expect(isReversal({ x: 1, y: 0 }, { x: 1, y: 0 })).toBe(false)
  })

  it('returns false for perpendicular directions', () => {
    expect(isReversal({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false)
  })
})

describe('getNextHead', () => {
  it('moves right', () => {
    expect(getNextHead({ x: 5, y: 5 }, { x: 1, y: 0 })).toEqual({
      x: 6,
      y: 5,
    })
  })

  it('moves left', () => {
    expect(getNextHead({ x: 5, y: 5 }, { x: -1, y: 0 })).toEqual({
      x: 4,
      y: 5,
    })
  })

  it('moves up', () => {
    expect(getNextHead({ x: 5, y: 5 }, { x: 0, y: -1 })).toEqual({
      x: 5,
      y: 4,
    })
  })

  it('moves down', () => {
    expect(getNextHead({ x: 5, y: 5 }, { x: 0, y: 1 })).toEqual({
      x: 5,
      y: 6,
    })
  })
})

describe('generateFood', () => {
  it('generates food not on snake', () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ]
    const food = generateFood(snake)

    expect(isOnSnake(food, snake)).toBe(false)
    expect(isInsideGrid(food)).toBe(true)
  })

  it('handles empty snake', () => {
    const food = generateFood([])
    expect(isInsideGrid(food)).toBe(true)
  })
})

describe('processTick', () => {
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]
  const food = { x: 6, y: 5 }

  it('moves snake in direction', () => {
    const result = processTick(snake, { x: 1, y: 0 }, food)
    expect(result.newSnake[0]).toEqual({ x: 6, y: 5 })
    expect(result.collided).toBe(false)
    expect(result.ateFood).toBe(true)
  })

  it('detects wall collision', () => {
    const wallSnake = [{ x: GRID_WIDTH - 1, y: 0 }]
    const result = processTick(wallSnake, { x: 1, y: 0 }, { x: 0, y: 0 })
    expect(result.collided).toBe(true)
  })

  it('detects self collision', () => {
    // Snake: head at (1,0), body at (1,1), tail at (0,1)
    // Moving down: next head = (1,1) which is occupied by body segment (not tail)
    const snake = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    const result = processTick(snake, { x: 0, y: 1 }, { x: 0, y: 0 })
    expect(result.collided).toBe(true)
  })

  it('does not eat food when not on food position', () => {
    // Snake at {5,5},{4,5},{3,5} moving up to {5,4} - food is at {6,5}
    const result = processTick(
      [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ],
      { x: 0, y: -1 },
      { x: 6, y: 5 }
    )
    expect(result.ateFood).toBe(false)
    expect(result.collided).toBe(false)
  })
})

describe('createInitialState', () => {
  it('creates valid initial state', () => {
    const state = createInitialState()

    expect(state.snake.length).toBeGreaterThan(0)
    expect(state.score).toBe(0)
    expect(state.status).toBe('idle')
    expect(isInsideGrid(state.food)).toBe(true)
    expect(isOnSnake(state.food, state.snake)).toBe(false)
  })

  it('food does not overlap snake', () => {
    const state = createInitialState()
    const overlap = state.snake.some(
      (segment) => segment.x === state.food.x && segment.y === state.food.y
    )
    expect(overlap).toBe(false)
  })
})
