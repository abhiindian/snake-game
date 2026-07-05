# Data Model: Mobile-Friendly UI

**Feature**: 002-mobile-friendly-ui
**Date**: 2026-07-05

## Overview

This feature does not introduce new data entities or modify the existing Redux state shape. All changes are UI/presentation-layer only. The data model section documents the existing entities and how they are consumed by the new UI components.

## Existing Entities (Unchanged)

### GameState (Redux Store)

Defined in `src/store/gameSlice.ts`. No modifications required.

```typescript
interface GameState {
  status: 'idle' | 'running' | 'paused' | 'gameOver'
  score: number
  gridSize: { width: number; height: number }  // 40x40, unchanged
  snake: Position[]
  direction: Position
  nextDirection: Position
  food: Position
  tickSpeed: number
}
```

### Position

Defined in `src/utils/gameEngine.ts`. No modifications required.

```typescript
type Position = { x: number; y: number }
```

### GameStatus

```typescript
type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver'
```

## New UI-Only Types (No State Changes)

### TouchDirection

Represents a touch button press. Dispatched as a Redux `Position` action.

```typescript
type TouchDirection = 'up' | 'down' | 'left' | 'right'

const DIRECTION_MAP: Record<TouchDirection, Position> = {
  up:    { x:  0, y: -1 },
  down:  { x:  0, y:  1 },
  left:  { x: -1, y:  0 },
  right: { x:  1, y:  0 },
}
```

### TouchControlButton

Describes a single touch control button for rendering and interaction.

```typescript
interface TouchControlButton {
  direction: TouchDirection
  label: string           // "↑", "↓", "←", "→"
  position: 'top' | 'bottom' | 'left' | 'right'  // for D-pad layout
  ariaLabel: string       // e.g., "Move snake up"
  minSize: number         // 44 (CSS pixels, per FR-005)
}
```

### LayoutBreakpoint

Tracks the current layout mode for conditional rendering.

```typescript
type LayoutBreakpoint = 'phone' | 'tablet' | 'desktop'

// Thresholds (approximate, based on CSS media queries)
// phone:   width < 768px
// tablet:  768px <= width < 1024px
// desktop: width >= 1024px
```

### ViewportInfo

Derived UI state — NOT stored in Redux. Computed via `useViewport` hook.

```typescript
interface ViewportInfo {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  breakpoint: LayoutBreakpoint
  isMobile: boolean
  isLandscape: boolean
}
```

## Component Props (New)

### TouchControlsProps

```typescript
interface TouchControlsProps {
  onDirectionChange: (direction: Position) => void
  className?: string
}
```

### ActionBarProps

```typescript
interface ActionBarProps {
  score: number
  status: GameStatus
  onPause: () => void
  onRestart: () => void
  onHome: () => void
}
```

### ResponsiveBoardProps

```typescript
interface ResponsiveBoardProps {
  onRestart?: () => void
  className?: string
}
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Input Layer                         │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │ Keyboard     │              │ Touch Controls           │ │
│  │ (useKeyboard │              │ (TouchControls component)│ │
│  │  Input hook) │              │                          │ │
│  └──────┬───────┘              └──────────┬───────────────┘ │
│         │                                 │                 │
│         └─────────→ dispatch(             ─┘
│                    changeDirection(dir))  │
└──────────────────────────────────────────┼──────────────────┘
                                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      Redux Store                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ changeDirection reducer:                               │ │
│  │  - Validates no 180° reversal                          │ │
│  │  - Updates state.nextDirection                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ tick reducer (called by game loop):                    │ │
│  │  - Applies nextDirection → direction                   │ │
│  │  - Calls processTick() from gameEngine                 │ │
│  │  - Updates snake, food, score, status                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     UI Rendering Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Scoreboard   │  │ GameBoard    │  │ TouchControls    │  │
│  │ (existing)   │  │ (existing)   │  │ (new)            │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ ActionBar    │  │ GameControls │                        │
│  │ (new)        │  │ (existing)   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Notes

- No new database, API, or persistence layer changes.
- All new types are UI-only and do not affect game logic.
- The `ViewportInfo` type is computed at runtime and not persisted.
