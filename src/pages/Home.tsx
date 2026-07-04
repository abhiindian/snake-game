import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { startGame } from '@/store/gameSlice'
import styles from './Home.module.css'

export function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleStart = () => {
    dispatch(startGame())
    navigate('/game')
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Snake Game</h1>
        <p className={styles.subtitle}>
          Use Arrow keys or WASD to control the snake. Eat food to grow and
          score points. Avoid walls and your own body!
        </p>
        <button className={styles.button} onClick={handleStart} autoFocus>
          Start Game
        </button>
        <div className={styles.controls}>
          <h2>Controls</h2>
          <ul>
            <li>
              <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or{' '}
              <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> — Move
            </li>
            <li>
              <kbd>Space</kbd> — Pause / Resume
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
