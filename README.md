# Snake Game

A classic Snake Game built with React, TypeScript, Redux Toolkit, and Vite. Control the snake using keyboard inputs, eat food to grow and score points, and avoid hitting walls or your own body.

## Features

- **Classic Snake Gameplay**: Move a snake on a 40x40 grid, eat food to grow longer, and increase your score.
- **Keyboard Controls**: Arrow keys or WASD for movement, Space bar to pause/resume.
- **Collision Detection**: Wall and self-collision detection with Game Over state.
- **Pause & Resume**: Pause the game at any time and resume when ready.
- **Auto-Pause**: Game automatically pauses when you switch browser tabs.
- **Score Tracking**: Real-time score display that updates as you eat food.
- **Responsive UI**: Clean, accessible interface built with CSS Modules.
- **Type-Safe**: Full TypeScript coverage for maintainability.

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 5 |
| **State Management** | Redux Toolkit + React Redux |
| **Routing** | React Router DOM |
| **Testing** | Vitest, React Testing Library |
| **Styling** | CSS Modules |
| **Linting** | ESLint |
| **Formatting** | Prettier |

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/abhiindian/snake-game.git
cd snake-game

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to play.

## Controls

### Keyboard (Desktop)

| Key | Action |
|-----|--------|
| `↑` / `W` | Move Up |
| `↓` / `S` | Move Down |
| `←` / `A` | Move Left |
| `→` / `D` | Move Right |
| `Space` | Pause / Resume |

### Touch Controls (Mobile)

On phones and tablets, on-screen directional buttons appear below the game board:

- **D-Pad buttons**: Tap ▲ ▼ ◀ ▶ to control the snake
- **Action bar**: Use Pause/Resume, Restart, and Home buttons at the top of the screen
- All touch controls meet 44×44px minimum tappable area for comfortable one-handed play

## Responsive Design

The game is fully responsive and works across all screen sizes (320px minimum viewport):

- **Portrait mode**: Vertical stack layout (ActionBar → Scoreboard → Board → TouchControls)
- **Landscape mode** (768px+): Side-by-side grid layout (ActionBar on top, board and controls side by side)
- **Board scaling**: The game board maintains a perfect 1:1 aspect ratio and scales fluidly using CSS `aspect-ratio`
- **No horizontal scrolling**: Layout adapts to any viewport width without overflow

## Project Structure

```
src/
├── app/                 # App providers and root component
├── features/
│   ├── game/            # Game engine logic, hooks, and components
│   │   ├── components/  # GameBoard, GameControls
│   │   ├── useGameLoop.ts
│   │   └── useKeyboardInput.ts
│   └── score/           # Scoreboard component
├── pages/               # Page components (Home, Game)
├── routes/              # React Router configuration
├── store/               # Redux store and slices
│   └── gameSlice.ts     # Game state management
├── utils/               # Pure utility functions
│   ├── constants.ts     # Grid size, tick speed, initial state
│   └── gameEngine.ts    # Collision, movement, food logic
tests/
├── unit/                # Unit tests for utils and slices
└── integration/         # Component and flow tests
```

## Architecture

### State Management

The game uses **Redux Toolkit** for centralized state management:

- **`gameSlice`** manages all game state: status (`idle` | `running` | `paused` | `gameOver`), score, snake body, direction, food position, and tick speed.
- **`processTick()`** in `gameEngine.ts` is a pure function that deterministically computes the next state from the current one.
- **`useGameLoop`** hook orchestrates the game tick interval and dispatches actions to the store.

### Game Loop

The game loop uses `setInterval` with a configurable tick speed (120ms by default). The loop:

1. Applies the buffered direction (`nextDirection`)
2. Calls `processTick()` to compute movement, food consumption, and collision
3. Dispatches the `tick` action to update Redux state

### Separation of Concerns

- **Game Engine** (`utils/gameEngine.ts`): Pure functions with no UI or framework dependencies.
- **State Management** (`store/gameSlice.ts`): Redux reducers that handle state transitions.
- **Rendering** (`features/game/components/`): React components that read state and dispatch actions.
- **Hooks** (`features/game/`): Orchestrate side effects (keyboard input, game loop, visibility changes).

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint and fix code
npm run lint
npm run lint:fix

# Format code with Prettier
npm run format
```

## Testing

### Unit Tests

Unit tests cover core game logic and Redux reducers:

- **`tests/unit/gameEngine.test.ts`**: Tests for all game engine utilities (collision detection, food generation, movement, state factory).
- **`tests/unit/gameSlice.test.ts`**: Tests for all Redux reducers (start, pause, resume, toggle, direction, tick, restart).

### Integration Tests

Integration tests cover the full game flow across components:

- Navigation flow (Home → Game)
- Keyboard input and direction changes
- Food consumption and score increment
- Collision detection and game over state
- Pause/resume lifecycle
- Restart flow

Run all tests:

```bash
npm run test
```

### Manual QA for Mobile

Test the mobile-friendly UI in browser DevTools:

1. Open the dev server: `npm run dev`
2. Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
3. Select device presets: iPhone SE (375px), iPhone 12 Pro (390px), iPad (768px)
4. Verify:
   - Touch D-pad buttons appear below the board
   - Action bar shows at the top with score, status, and action buttons
   - Board scales to fit the viewport while maintaining square aspect ratio
   - No horizontal scrolling at any viewport width
   - Pause/Resume, Restart, and Home buttons function correctly
   - Game over overlay is readable and tappable
5. Rotate device to test landscape layout (side-by-side grid)
6. Verify keyboard controls still work by switching back to desktop viewport

## Game Specifications

- **Grid Size**: 40x40 cells
- **Initial Snake Length**: 3 segments (center of board)
- **Initial Direction**: Moving right
- **Tick Speed**: 120ms
- **Score Per Food**: 10 points
- **Cell Size**: 14px

## License

MIT
