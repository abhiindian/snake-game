import { useSelector } from 'react-redux'
import type { GameStatus } from '@/store/gameSlice'
import type { RootState } from '@/store'
import styles from './Scoreboard.module.css'

interface ScoreboardProps {
  onRestart?: () => void
}

export function Scoreboard(_props: ScoreboardProps) {
  const score = useSelector((state: RootState) => state.game.score)
  const status = useSelector((state: RootState) => state.game.status)

  const statusLabels: Record<GameStatus, string> = {
    idle: '',
    running: '▶ Playing',
    paused: '⏸ Paused',
    gameOver: 'Game Over',
  }

  return (
    <div className={styles.scoreboard} role="status" aria-live="polite">
      <div className={styles.scoreSection}>
        <span className={styles.label}>Score</span>
        <span className={styles.value}>{score}</span>
      </div>
      <div className={styles.statusSection}>
        <span
          className={`${styles.status} ${
            status === 'paused'
              ? styles.paused
              : status === 'gameOver'
              ? styles.gameOver
              : ''
          }`}
        >
          {statusLabels[status]}
        </span>
      </div>
    </div>
  )
}
