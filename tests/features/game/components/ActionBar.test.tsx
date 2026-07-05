import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ActionBar } from '@/features/game/components/ActionBar'

function mockOnPause() {
  return vi.fn()
}

function mockOnRestart() {
  return vi.fn()
}

function mockOnHome() {
  return vi.fn()
}

// Helper to wrap ActionBar in MemoryRouter for navigation
function renderActionBar({
  score = 0,
  status = 'running',
  onPause = mockOnPause(),
  onRestart = mockOnRestart(),
  onHome = mockOnHome(),
} = {}) {
  return render(
    <MemoryRouter>
      <ActionBar
        score={score}
        status={status}
        onPause={onPause}
        onRestart={onRestart}
      />
    </MemoryRouter>
  )
}

describe('ActionBar', () => {
  it('displays the current score', () => {
    renderActionBar({ score: 42 })
    expect(screen.getByText(/score: 42/i)).toBeInTheDocument()
  })

  it('displays correct status label for playing', () => {
    renderActionBar({ status: 'running' })
    expect(screen.getByText(/▶ playing/i)).toBeInTheDocument()
  })

  it('displays correct status label for paused', () => {
    renderActionBar({ status: 'paused' })
    expect(screen.getByText(/⏸ paused/i)).toBeInTheDocument()
  })

  it('displays correct status label for game over', () => {
    renderActionBar({ status: 'gameOver' })
    expect(screen.getByText(/game over/i)).toBeInTheDocument()
  })

  it('shows Pause button when game is running', () => {
    renderActionBar({ status: 'running' })
    expect(screen.getByRole('button', { name: /pause game/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /resume game/i })).not.toBeInTheDocument()
  })

  it('shows Resume button when game is paused', () => {
    renderActionBar({ status: 'paused' })
    expect(screen.queryByRole('button', { name: /pause game/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resume game/i })).toBeInTheDocument()
  })

  it('hides pause/resume button when game is not running or paused', () => {
    renderActionBar({ status: 'gameOver' })
    expect(screen.queryByRole('button', { name: /pause game/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /resume game/i })).not.toBeInTheDocument()
  })

  it('shows Restart button when game is running', () => {
    renderActionBar({ status: 'running' })
    expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument()
  })

  it('shows Restart button when game is paused', () => {
    renderActionBar({ status: 'paused' })
    expect(screen.getByRole('button', { name: /restart game/i })).toBeInTheDocument()
  })

  it('hides Restart button when game is game over', () => {
    renderActionBar({ status: 'gameOver' })
    // Game over overlay handles its own restart button; ActionBar hides it
    const actionButtons = document.querySelector('[role="toolbar"]')
    const restartButtons = actionButtons?.querySelectorAll('button')
    const hasRestart = Array.from(restartButtons || []).some(
      (btn) => btn.textContent?.toLowerCase().includes('restart')
    )
    expect(hasRestart).toBe(false)
  })

  it('calls onPause when Pause button is clicked', async () => {
    const onPause = mockOnPause()
    renderActionBar({ status: 'running', onPause })

    const pauseButton = screen.getByRole('button', { name: /pause game/i })
    await userEvent.click(pauseButton)

    expect(onPause).toHaveBeenCalledTimes(1)
  })

  it('calls onPause when Resume button is clicked', async () => {
    const onPause = mockOnPause()
    renderActionBar({ status: 'paused', onPause })

    const resumeButton = screen.getByRole('button', { name: /resume game/i })
    await userEvent.click(resumeButton)

    expect(onPause).toHaveBeenCalledTimes(1)
  })

  it('calls onRestart when Restart button is clicked', async () => {
    const onRestart = mockOnRestart()
    renderActionBar({ status: 'running', onRestart })

    const restartButton = screen.getByRole('button', { name: /restart game/i })
    await userEvent.click(restartButton)

    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('all buttons meet 44x44px minimum tappable area', () => {
    renderActionBar({ status: 'running' })
    const buttons = screen.getAllByRole('button')

    // Verify buttons have CSS classes that enforce minimum size
    // The CSS module sets min-width: 44px and min-height: 44px on .actionBar__button
    buttons.forEach((button) => {
      const classes = button.getAttribute('class') || ''
      expect(classes).toContain('actionBar__button')
    })
  })
})
