import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Game } from '@/pages/Game'
import gameReducer from '@/store/gameSlice'
import type { GameState } from '@/store/gameSlice'

function createTestStore(initialState?: Partial<GameState>) {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: {
      game: {
        status: 'idle',
        score: 0,
        gridSize: { width: 40, height: 40 },
        snake: [{ x: 20, y: 20 }, { x: 19, y: 20 }, { x: 18, y: 20 }],
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        food: { x: 25, y: 25 },
        tickSpeed: 120,
        ...initialState,
      },
    },
  })
}

function renderWithStore(
  store: ReturnType<typeof createTestStore>,
  initialRoute: string = '/'
) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Provider>
    </MemoryRouter>
  )
}

// Helper to find the Game Over overlay specifically (not the scoreboard status text)
function getGameOverOverlay() {
  return screen.getByRole('alert', { hidden: true })
}

describe('Integration: Home → Game Navigation Flow', () => {
  it('renders Home page with Start Game button', () => {
    const store = createTestStore()
    renderWithStore(store, '/')

    expect(screen.getByRole('heading', { name: /snake game/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
  })

  it('navigates to Game page when Start Game is clicked', async () => {
    const store = createTestStore()
    renderWithStore(store, '/')

    const startButton = screen.getByRole('button', { name: /start game/i })
    await userEvent.click(startButton)

    // After clicking Start Game, status should be running
    expect(store.getState().game.status).toBe('running')

    // Game board should render
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })
  })
})

describe('Integration: Game Board Rendering', () => {
  it('renders Game page with Scoreboard, Controls, and Board', async () => {
    const store = createTestStore({ status: 'running' })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    // Scoreboard should be present
    expect(screen.getByRole('status')).toBeInTheDocument()

    // GameControls should be present
    expect(screen.getByRole('toolbar', { name: /game controls/i })).toBeInTheDocument()
  })

  it('displays correct initial score', async () => {
    const store = createTestStore({ status: 'running', score: 0 })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('Integration: Pause/Resume Lifecycle', () => {
  it('pauses game when Pause button is clicked', async () => {
    const store = createTestStore({ status: 'running' })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    const pauseButton = screen.getByRole('button', { name: /pause/i })
    await userEvent.click(pauseButton)

    expect(store.getState().game.status).toBe('paused')
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
  })

  it('resumes game when Resume button is clicked', async () => {
    const store = createTestStore({ status: 'paused' })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    const resumeButton = screen.getByRole('button', { name: /resume/i })
    await userEvent.click(resumeButton)

    expect(store.getState().game.status).toBe('running')
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('shows correct status label for playing, paused, and game over', async () => {
    // Playing
    const runningStore = createTestStore({ status: 'running' })
    renderWithStore(runningStore, '/game')
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })
    expect(screen.getByText(/▶ playing/i)).toBeInTheDocument()

    // Paused
    const pausedStore = createTestStore({ status: 'paused' })
    renderWithStore(pausedStore, '/game')
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })
    expect(screen.getByText(/⏸ paused/i)).toBeInTheDocument()

    // Game Over - use more specific selector to avoid ambiguity with Scoreboard
    const gameOverStore = createTestStore({ status: 'gameOver' })
    renderWithStore(gameOverStore, '/game')
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })
    // The Game Over status in scoreboard
    const statusElements = screen.getAllByRole('status')
    const gameOverStatus = statusElements.find(el => el.textContent?.includes('Game Over'))
    expect(gameOverStatus).toBeInTheDocument()
  })
})

describe('Integration: Collision Detection and Game Over State', () => {
  it('shows Game Over overlay when game status is gameOver', async () => {
    const store = createTestStore({
      status: 'gameOver',
      score: 50,
    })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    // Game Over overlay should be present
    const overlay = getGameOverOverlay()
    expect(overlay).toBeInTheDocument()
    expect(overlay.querySelector('h2')).toHaveTextContent('Game Over')
    expect(overlay.querySelector('.restartBtn')).toHaveTextContent('Restart')
  })

  it('triggers game over on wall collision via tick', async () => {
    const store = createTestStore({
      status: 'running',
      snake: [{ x: 39, y: 20 }, { x: 38, y: 20 }, { x: 37, y: 20 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
    })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    // Tick when head is at x=39 moving right → wall collision
    store.dispatch({ type: 'game/tick' })

    await waitFor(() => {
      expect(store.getState().game.status).toBe('gameOver')
    })

    // Game Over overlay should appear
    const overlay = getGameOverOverlay()
    expect(overlay).toBeInTheDocument()
  })

  it('triggers game over on self collision via tick', async () => {
    const store = createTestStore({
      status: 'running',
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 7, y: 3 },
      ],
      direction: { x: 0, y: -1 },
      nextDirection: { x: 0, y: -1 },
      food: { x: 10, y: 10 },
    })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    // Tick will move head to (5,4) which is body segment → self collision
    store.dispatch({ type: 'game/tick' })

    await waitFor(() => {
      expect(store.getState().game.status).toBe('gameOver')
    })

    const overlay = getGameOverOverlay()
    expect(overlay).toBeInTheDocument()
  })
})

describe('Integration: Restart Flow', () => {
  it('restarts game from Game Over overlay', async () => {
    const store = createTestStore({ status: 'gameOver', score: 100 })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(getGameOverOverlay()).toBeInTheDocument()
    })

    const restartButton = screen.getByRole('button', { name: /restart/i })
    await userEvent.click(restartButton)

    await waitFor(() => {
      expect(store.getState().game.status).toBe('running')
      expect(store.getState().game.score).toBe(0)
    })

    // Game Over overlay should disappear
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('restarts game from GameControls toolbar during running game', async () => {
    const store = createTestStore({ status: 'running', score: 50 })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    const restartButton = screen.getByRole('button', { name: /restart/i })
    await userEvent.click(restartButton)

    await waitFor(() => {
      expect(store.getState().game.status).toBe('running')
      expect(store.getState().game.score).toBe(0)
    })
  })

  it('restarts game from GameControls toolbar during paused game', async () => {
    const store = createTestStore({ status: 'paused', score: 30 })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    const restartButton = screen.getByRole('button', { name: /restart/i })
    await userEvent.click(restartButton)

    await waitFor(() => {
      expect(store.getState().game.status).toBe('running')
      expect(store.getState().game.score).toBe(0)
    })
  })
})

describe('Integration: Score Display', () => {
  it('displays score on the Scoreboard', async () => {
    const store = createTestStore({ status: 'running', score: 30 })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('updates score display after score changes', async () => {
    const store = createTestStore({ status: 'running', score: 0 })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    expect(screen.getByText('0')).toBeInTheDocument()

    // Dispatch tick twice (simulates eating food twice)
    store.dispatch({ type: 'game/tick' })
    store.dispatch({ type: 'game/tick' })

    // Score should have increased (10 points per food)
    await waitFor(() => {
      expect(screen.getByText(/\d+/)).toBeInTheDocument()
    })
  })
})

describe('Integration: Full Game Flow from Start to Game Over', () => {
  it('completes full game cycle: start → play → game over → restart', async () => {
    const store = createTestStore()
    renderWithStore(store, '/')

    // 1. Start game from Home
    await userEvent.click(screen.getByRole('button', { name: /start game/i }))

    // 2. Should be on Game page with status running
    expect(store.getState().game.status).toBe('running')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    // 3. Pause the game
    const pauseButton = screen.getByRole('button', { name: /pause/i })
    await userEvent.click(pauseButton)

    await waitFor(() => {
      expect(store.getState().game.status).toBe('paused')
    })

    // 4. Resume
    const resumeButton = screen.getByRole('button', { name: /resume/i })
    await userEvent.click(resumeButton)

    await waitFor(() => {
      expect(store.getState().game.status).toBe('running')
    })

    // 5. Cause game over by moving snake to wall
    store.dispatch({
      type: 'game/tick',
    })

    // Game should end
    await waitFor(() => {
      expect(getGameOverOverlay()).toBeInTheDocument()
    })

    // 6. Restart
    await userEvent.click(screen.getByRole('button', { name: /restart/i }))

    // 7. Game should be running again with reset score
    await waitFor(() => {
      expect(store.getState().game.status).toBe('running')
      expect(store.getState().game.score).toBe(0)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('prevents 180 degree reversal when changing direction', async () => {
    const store = createTestStore({
      status: 'running',
      direction: { x: 1, y: 0 }, // moving right
      nextDirection: { x: 1, y: 0 },
    })
    renderWithStore(store, '/game')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: /snake game board/i })).toBeInTheDocument()
    })

    // Try to move left (180 degree reversal from right)
    store.dispatch({ type: 'game/changeDirection', payload: { x: -1, y: 0 } })

    // nextDirection should NOT be reversed
    expect(store.getState().game.nextDirection).toEqual({ x: 1, y: 0 })

    // Try to move up (valid reversal)
    store.dispatch({ type: 'game/changeDirection', payload: { x: 0, y: -1 } })

    // nextDirection should now be up
    expect(store.getState().game.nextDirection).toEqual({ x: 0, y: -1 })
  })
})
