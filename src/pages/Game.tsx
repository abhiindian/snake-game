import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { restartGame } from '@/store/gameSlice'
import { useGameLoop } from '@/features/game/useGameLoop'
import { GameBoard } from '@/features/game/components/GameBoard'
import { Scoreboard } from '@/features/score/components/Scoreboard'
import { GameControls } from '@/features/game/components/GameControls'
import type { RootState } from '@/store'
import styles from './Game.module.css'

export function Game() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector((state: RootState) => state.game.status)

  // Redirect to home if game hasn't started
  useEffect(() => {
    if (status === 'idle') {
      navigate('/')
    }
  }, [status, navigate])

  // Initialize the game loop
  useGameLoop()

  const handleRestart = () => {
    dispatch(restartGame())
  }

  if (status === 'idle') {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>
        <Scoreboard onRestart={handleRestart} />
        <GameControls onRestart={handleRestart} />
        <GameBoard onRestart={handleRestart} />
        <div className={styles.instructions} aria-label="Game instructions">
          <p>
            <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or{' '}
            <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move
          </p>
          <p>
            <kbd>Space</kbd> to pause/resume
          </p>
        </div>
      </div>
    </div>
  )
}
