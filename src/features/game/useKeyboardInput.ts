import { useEffect, useCallback } from 'react'
import { changeDirection, togglePause } from '@/store/gameSlice'
import { useDispatch } from 'react-redux'

type Direction = { x: number; y: number }

const DIRECTION_MAP: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
}

export function useKeyboardInput() {
  const dispatch = useDispatch()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        dispatch(togglePause())
        return
      }

      const direction = DIRECTION_MAP[e.key]
      if (direction) {
        e.preventDefault()
        dispatch(changeDirection(direction))
      }
    },
    [dispatch]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
