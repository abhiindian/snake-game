import type { Position } from '@/utils/gameEngine'
import styles from './TouchControls.module.css'

interface TouchControlsProps {
  onDirectionChange: (direction: Position) => void
}

const DIRECTION_BUTTONS = [
  { direction: { x: 0, y: -1 } as Position, label: 'Up', className: styles['dpad__button--up'], aria: 'Move up', icon: '▲' },
  { direction: { x: -1, y: 0 } as Position, label: 'Left', className: styles['dpad__button--left'], aria: 'Move left', icon: '◀' },
  { direction: { x: 0, y: 1 } as Position, label: 'Down', className: styles['dpad__button--down'], aria: 'Move down', icon: '▼' },
  { direction: { x: 1, y: 0 } as Position, label: 'Right', className: styles['dpad__button--right'], aria: 'Move right', icon: '▶' },
]

export function TouchControls({ onDirectionChange }: TouchControlsProps) {
  const handleTouchStart = (direction: Position, e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    onDirectionChange(direction)
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className={styles.dpad} role="group" aria-label="Directional controls">
      {DIRECTION_BUTTONS.map(({ direction, aria, icon }) => (
        <button
          key={direction.x + direction.y}
          className={`${styles.dpad__button} ${
            direction.y === -1
              ? styles['dpad__button--up']
              : direction.x === -1
              ? styles['dpad__button--left']
              : direction.y === 1
              ? styles['dpad__button--down']
              : styles['dpad__button--right']
          }`}
          onTouchStart={(e) => handleTouchStart(direction, e)}
          onTouchEnd={handleTouchEnd}
          onMouseDown={(e) => handleTouchStart(direction, e)}
          aria-label={aria}
          tabIndex={0}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
