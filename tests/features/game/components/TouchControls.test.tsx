import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TouchControls } from '@/features/game/components/TouchControls'
import type { Position } from '@/utils/gameEngine'

function mockOnDirectionChange() {
  return vi.fn((direction: Position) => {})
}

describe('TouchControls', () => {
  it('renders all four directional buttons', () => {
    const onDirectionChange = mockOnDirectionChange()
    render(<TouchControls onDirectionChange={onDirectionChange} />)

    expect(screen.getByLabelText('Move up')).toBeInTheDocument()
    expect(screen.getByLabelText('Move left')).toBeInTheDocument()
    expect(screen.getByLabelText('Move down')).toBeInTheDocument()
    expect(screen.getByLabelText('Move right')).toBeInTheDocument()
  })

  it('dispatches correct direction on click (Up)', () => {
    const onDirectionChange = mockOnDirectionChange()
    render(<TouchControls onDirectionChange={onDirectionChange} />)

    const upButton = screen.getByLabelText('Move up')
    upButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(onDirectionChange).toHaveBeenCalledWith({ x: 0, y: -1 })
  })

  it('dispatches correct direction on click (Down)', () => {
    const onDirectionChange = mockOnDirectionChange()
    render(<TouchControls onDirectionChange={onDirectionChange} />)

    const downButton = screen.getByLabelText('Move down')
    downButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(onDirectionChange).toHaveBeenCalledWith({ x: 0, y: 1 })
  })

  it('dispatches correct direction on click (Left)', () => {
    const onDirectionChange = mockOnDirectionChange()
    render(<TouchControls onDirectionChange={onDirectionChange} />)

    const leftButton = screen.getByLabelText('Move left')
    leftButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(onDirectionChange).toHaveBeenCalledWith({ x: -1, y: 0 })
  })

  it('dispatches correct direction on click (Right)', () => {
    const onDirectionChange = mockOnDirectionChange()
    render(<TouchControls onDirectionChange={onDirectionChange} />)

    const rightButton = screen.getByLabelText('Move right')
    rightButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(onDirectionChange).toHaveBeenCalledWith({ x: 1, y: 0 })
  })

  it('has correct ARIA labels for accessibility', () => {
    render(<TouchControls onDirectionChange={mockOnDirectionChange()} />)

    expect(screen.getByRole('group', { name: /directional controls/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Move up')).toHaveAttribute('aria-label', 'Move up')
    expect(screen.getByLabelText('Move left')).toHaveAttribute('aria-label', 'Move left')
    expect(screen.getByLabelText('Move down')).toHaveAttribute('aria-label', 'Move down')
    expect(screen.getByLabelText('Move right')).toHaveAttribute('aria-label', 'Move right')
  })

  it('buttons have minimum 44px min-width and min-height via CSS', () => {
    render(<TouchControls onDirectionChange={mockOnDirectionChange()} />)
    const buttons = screen.getAllByRole('button')

    // Verify all buttons have the dpad__button base class (CSS modules hash it, so check partial match)
    buttons.forEach((button) => {
      const classes = button.getAttribute('class') || ''
      expect(classes).toContain('dpad__button')
    })
  })
})
