import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { restartGame, togglePause, changeDirection } from '@/store/gameSlice'
import { useGameLoop } from '@/features/game/useGameLoop'
import { GameBoard } from '@/features/game/components/GameBoard'
import { Scoreboard } from '@/features/score/components/Scoreboard'
import { ActionBar } from '@/features/game/components/ActionBar'
import { TouchControls } from '@/features/game/components/TouchControls'
import { useViewport } from '@/features/game/useViewport'
import type { RootState } from '@/store'
import styles from './Game.module.css'

export function Game() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector((state: RootState) => state.game.status)
  const score = useSelector((state: RootState) => state.game.score)
  const { isLandscape, isMobile } = useViewport()

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

  const handlePause = () => {
    dispatch(togglePause())
  }

  const handleDirectionChange = (direction: { x: number; y: number }) => {
    dispatch(changeDirection(direction))
  }

  if (status === 'idle') {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.gameArea} ${isLandscape ? styles['gameArea--landscape'] : styles['gameArea--portrait']}`}>
        <ActionBar
          score={score}
          status={status}
          onPause={handlePause}
          onRestart={handleRestart}
        />
        <Scoreboard onRestart={handleRestart} />
        <GameBoard onRestart={handleRestart} />
        {isMobile && (
          <TouchControls onDirectionChange={handleDirectionChange} />
        )}
        {!isMobile && (
          <div className={styles.instructions} aria-label="Game instructions">
            <p>
              <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or{' '}
              <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move
            </p>
            <p>
              <kbd>Space</kbd> to pause/resume
            </p>
          </div>
        )}
        {isMobile && (
          <div className={styles.instructions} aria-label="Mobile control instructions" style={{ fontSize: '0.85rem', color: '#888' }}>
            <p>Use on-screen buttons to control the snake</p>
          </div>
        )}
      </div>
    </div>
  )
}
