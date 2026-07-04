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

| Key | Action |
|-----|--------|
| `↑` / `W` | Move Up |
| `↓` / `S` | Move Down |
| `←` / `A` | Move Left |
| `→` / `D` | Move Right |
| `Space` | Pause / Resume |

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

## Game Specifications

- **Grid Size**: 40x40 cells
- **Initial Snake Length**: 3 segments (center of board)
- **Initial Direction**: Moving right
- **Tick Speed**: 120ms
- **Score Per Food**: 10 points
- **Cell Size**: 14px

## License

MIT
