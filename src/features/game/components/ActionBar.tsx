import { useNavigate } from 'react-router-dom'
import type { GameStatus } from '@/store/gameSlice'
import styles from './ActionBar.module.css'

interface ActionBarProps {
  score: number
  status: GameStatus
  onPause: () => void
  onRestart: () => void
}

const STATUS_LABELS: Record<GameStatus, string> = {
  idle: '',
  running: '▶ Playing',
  paused: '⏸ Paused',
  gameOver: 'Game Over',
}

export function ActionBar({ score, status, onPause, onRestart }: ActionBarProps) {
  const navigate = useNavigate()

  const isActionable = status === 'running' || status === 'paused'

  return (
    <div className={styles.actionBar} role="toolbar" aria-label="Game actions">
      <span className={styles.score} aria-label={`Current score: ${score}`}>
        Score: {score}
      </span>

      <span
        className={`${styles.status} ${
          status === 'paused' ? styles['status--paused'] : status === 'gameOver' ? styles['status--gameOver'] : ''
        }`}
      >
        {STATUS_LABELS[status]}
      </span>

      <div className={styles.actionButtons}>
        {(status === 'running' || status === 'paused') && (
          <button
            className={styles.actionBar__button}
            onClick={onPause}
            aria-label={status === 'running' ? 'Pause game' : 'Resume game'}
          >
            {status === 'running' ? 'Pause' : 'Resume'}
          </button>
        )}

        {isActionable && (
          <button
            className={`${styles.actionBar__button} ${styles['actionBar__button--secondary']}`}
            onClick={onRestart}
            aria-label="Restart game"
          >
            Restart
          </button>
        )}

        <button
          className={`${styles.actionBar__button} ${styles['actionBar__button--icon']}`}
          onClick={() => navigate('/')}
          aria-label="Go to home"
          title="Home"
        >
          🏠
        </button>
      </div>
    </div>
  )
}
