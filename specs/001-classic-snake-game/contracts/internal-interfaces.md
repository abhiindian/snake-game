# Interface Contracts: Classic Snake Game

**Feature**: [001-classic-snake-game](/Users/abhishek/ProofOfConcepts/snake-game/specs/001-classic-snake-game/plan.md)

## Internal Component Contracts (Redux Actions)

The following actions are dispatched via the `gameSlice` to manage the game engine state.

### Action: `tick`
**Purpose**: Triggers a single step in the game loop.
**Payload**: `null`
**Effect**: 
- Calculates next snake head position.
- Checks for collisions (walls/self).
- Checks for food consumption.
- Updates snake body, score, and status.

### Action: `changeDirection`
**Purpose**: Updates the buffered direction for the next tick.
**Payload**: `{ x: number, y: number }` (Movement vector)
**Effect**: 
- Validates that the new direction is not a 180° reversal of the current `direction`.
- Sets `nextDirection` in state.

### Action: `togglePause`
**Purpose**: Switches between `running` and `paused` states.
**Payload**: `null`
**Effect**: Updates `status`.

### Action: `restartGame`
**Purpose**: Resets the game to initial values.
**Payload**: `null`
**Effect**: Sets snake, food, score, and status to initial defaults.

---

## UI Component Props (Contract Definitions)

### `GameBoard` Component
**Responsibility**: Renders the visual grid and handles user interaction.

| Prop | Type | Description |
|------|------|-------------|
| `gridSize` | `{ width: number, height: number }` | The dimensions of the playable area. |
| `snakeBody` | `Array<{ x: number, y: number }>` | Coordinates of all snake segments. |
| `foodPosition`| `{ x: number, y: number }` | Current position of the food. |
| `onDirectionChange` | `(dir: { x: number, y: number }) => void` | Callback for input handling. |

### `Scoreboard` Component
**Responsibility**: Displays the current score and game status.

| Prop | Type | Description |
|------|------|-------------|
| `score` | `number` | The current score. |
| `status` | `'idle' | 'running' | 'paused' | 'gameOver'` | The current game state. |

---

## External Interface (Optional/Future)

While currently a self-contained SPA, the following interface is considered for future extensibility (e.g., high score service):

### `HighscoreAPI`
**Endpoint**: `POST /api/highscores`
**Payload**: `{ username: string, score: number }`
**Response**: `201 Created`
