# Data Model: Classic Snake Game

**Feature**: [001-classic-snake-game](/Users/abhishek/ProofOfConcepts/snake-game/specs/001-classic-snake-game/plan.md)

## Entities

### Game State (Redux Store)

**Entity**: `GameState`
- **Fields**:
    - `status`: `idle | running | paused | gameOver` (Enum)
    - `score`: `number`
    - `gridSize`: `{ width: number, height: number }` (e.g., 40x40)
    - `snake`: `Array<{ x: number, y: number }>` (Ordered list of coordinates representing the body)
    - `direction`: `{ x: number, y: number }` (Current movement vector)
    - `nextDirection`: `{ x: number, y: number }` (Buffered direction for the next tick)
    - `food`: `{ x: number, y: number }` (Current food position)
    - `tickSpeed`: `number` (Interval in ms)

**Validation Rules**:
- `snake` must contain at least one element.
- `food` position must not overlap with any `snake` body coordinate.
- `direction` and `nextDirection` must be one of: `[{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}]`.

---

### Score (Derived/Redux)

**Entity**: `Score`
- **Fields**:
    - `current`: `number` (Current session score)
    - `highScore`: `number` (Persistent high score - *planned for future enhancement*)

---

## Relationships

- **Game State** contains the current **Snake** body, **Food** position, and active **Direction**.
- **Score** is a property of the current **Game State**.

## State Transitions

| Current Status | Action/Event | New Status | Side Effects |
|----------------|--------------|------------|--------------|
| `idle`         | `START_GAME` | `running`  | Reset snake, food, score; set direction. |
| `running`      | `PAUSE_GAME` | `paused`   | Stop timer/interval. |
| `paused`       | `RESUME_GAME`| `running`  | Restart timer/interval. |
| `running`      | `TICK_EVENT` | `running`  | Move snake, check collision/food. |
| `running`      | `COLLISION`  | `gameOver` | Stop timer; calculate final score. |
| `gameOver`     | `RESTART`    | `running`  | Reset all game state. |

## Implementation Notes

- **Snake Head**: Derived as `snake[0]`.
- **Occupied Cells Lookup**: A Set or boolean grid derived from `snake` coordinates for O(1) collision checks.
- **Direction Buffering**: To prevent invalid 180-degree turns (e.g., moving Right, then pressing Left before the next tick), `nextDirection` is updated on keydown but only applied to the main `direction` during a `TICK_EVENT`.
