import { useSelector, useDispatch } from 'react-redux'
import { togglePause } from '@/store/gameSlice'
import type { RootState } from '@/store'
import styles from './GameControls.module.css'

interface GameControlsProps {
  onRestart: () => void
}

export function GameControls({ onRestart }: GameControlsProps) {
  const dispatch = useDispatch()
  const status = useSelector((state: RootState) => state.game.status)

  const handlePauseResume = () => {
    dispatch(togglePause())
  }

  if (status === 'idle' || status === 'gameOver') {
    return null
  }

  return (
    <div className={styles.controls} role="toolbar" aria-label="Game controls">
      {status === 'running' && (
        <button
          className={styles.button}
          onClick={handlePauseResume}
          aria-label="Pause game"
        >
          Pause
        </button>
      )}
      {status === 'paused' && (
        <button
          className={styles.button}
          onClick={handlePauseResume}
          aria-label="Resume game"
        >
          Resume
        </button>
      )}
      <button
        className={`${styles.button} ${styles.restart}`}
        onClick={onRestart}
        aria-label="Restart game"
      >
        Restart
      </button>
    </div>
  )
}
