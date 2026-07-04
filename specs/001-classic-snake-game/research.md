# Research: Classic Snake Game Implementation

**Feature**: [001-classic-snake-game](/Users/abhishek/ProofOfConcepts/snake-game/specs/001-classic-snake-game/plan.md)

## Decisions & Findings

### Game Engine Logic (Pure Utilities)
- **Decision**: Implement all movement, collision, and food logic as pure functions in `src/utils/gameEngine.ts`.
- **Rationale**: Ensures determinism, testability (unit tests), and separation from React/Redux.
- **Alternatives considered**: Putting logic inside Redux reducers. *Rejected because* complex game state transitions (like collision detection) can make reducers bloated and harder to test in isolation.

### Game Loop Strategy
- **Decision**: Use a `setInterval` based approach managed within a React custom hook or a Redux middleware/thunk, triggered by the 'Running' status.
- **Rationale**: Simple to implement for a fixed-interval game like Snake. A `requestAnimationFrame` approach was considered for higher precision, but `setInterval` is sufficient and easier to control for a grid-based game with discrete ticks.
- **Alternatives considered**: `requestAnimationFrame`. *Rejected because* it's better for continuous smooth motion, whereas Snake relies on discrete time steps (ticks).

### State Management (Redux Toolkit)
- **Decision**: Use a single `gameSlice` to manage the primary game state.
- **Rationale**: Minimizes complexity for a single-feature app and keeps the "source of truth" centralized.
- **Alternatives considered**: Multiple slices (e.g., `snakeSlice`, `foodSlice`). *Rejected because* these states are highly interdependent (e.g., food depends on snake position).

### Rendering Strategy
- **Decision**: Render the grid using a 2D array based on the snake and food positions stored in Redux, mapped to individual `Cell` components.
- **Rationale**: Highly declarative and leverages React's reconciliation. Use CSS Grid for efficient layout.
- **Alternatives considered**: HTML5 Canvas. *Rejected because* while Canvas is more performant for thousands of objects, React + CSS Grid is easier to develop, style with CSS Modules, and test for this scale of game.

### Input Handling
- **Decision**: Global `keydown` event listener attached to the window/document, filtered for valid direction changes.
- **Rationale**: Ensures responsive controls regardless of where focus is on the page (within reason). Use a "direction queue" to prevent rapid-fire input from causing invalid 180-degree turns within a single tick.

## Research Tasks Completed
- [x] Best practices for deterministic game loops in React.
- [x] Separation of concerns between Redux and pure logic.
- [x] Efficient grid rendering in React.
