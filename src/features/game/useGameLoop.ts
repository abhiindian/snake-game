import { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tick, togglePause } from '@/store/gameSlice'
import { useKeyboardInput } from '@/features/game/useKeyboardInput'
import type { RootState } from '@/store'

export function useGameLoop() {
  const dispatch = useDispatch()
  const status = useSelector((state: RootState) => state.game.status)
  const tickSpeed = useSelector((state: RootState) => state.game.tickSpeed)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearLoop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startLoop = useCallback(() => {
    clearLoop()
    intervalRef.current = setInterval(() => {
      dispatch(tick())
    }, tickSpeed)
  }, [clearLoop, dispatch, tickSpeed])

  useEffect(() => {
    if (status === 'running') {
      startLoop()
    } else {
      clearLoop()
    }

    return clearLoop
  }, [status, tickSpeed, startLoop, clearLoop])

  // Register keyboard input
  useKeyboardInput()

  // Pause on window focus loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && status === 'running') {
        dispatch(togglePause())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [status, dispatch])
}
