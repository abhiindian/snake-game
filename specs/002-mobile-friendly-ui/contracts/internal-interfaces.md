# Contracts: Mobile-Friendly UI

**Feature**: 002-mobile-friendly-ui
**Date**: 2026-07-05

## Overview

This contract documents the internal interfaces that new mobile UI components expose to the existing application. These are internal contracts — the project is a single-page application with no external APIs.

---

## TouchControls Component Contract

**File**: `src/features/game/components/TouchControls.tsx`

### Props Interface

```typescript
interface TouchControlsProps {
  /**
   * Callback invoked when a direction button is pressed.
   * Receives a Position {x, y} matching the direction vector.
   * The callback should dispatch the same changeDirection action
   * used by keyboard input for consistency.
   */
  onDirectionChange: (direction: Position) => void

  /** Optional CSS class name for the container */
  className?: string
}
```

### Behavior Contract

1. **Direction dispatch**: Each button press must call `onDirectionChange` with the correct direction vector:
   - Up: `{ x: 0, y: -1 }`
   - Down: `{ x: 0, y: 1 }`
   - Left: `{ x: -1, y: 0 }`
   - Right: `{ x: 1, y: 0 }`

2. **180° reversal protection**: The component must NOT validate direction — it delegates to the Redux reducer. This ensures consistency with keyboard input.

3. **Touch event handling**: Each button must call `e.preventDefault()` on `touchstart` and `touchend` events to prevent browser scrolling/zooming.

4. **Accessibility**: Each button must:
   - Be a `<button>` element (not `<div>`)
   - Have an `aria-label` describing the direction (e.g., "Move snake up")
   - Be keyboard-focusable with visible `:focus-visible` outline
   - Have minimum 44x44px tappable area

5. **Visual feedback**: Buttons must show visual feedback on press (scale, color change, or both) via CSS `:active` state.

### D-Pad Layout Contract

```
    [↑]
[←] [↓] [→]
```

- Portrait: Centered below the game board
- Landscape: Positioned on the right side of the screen
- Buttons arranged in a cross/D-pad pattern using CSS Grid
- Adequate spacing between buttons to prevent accidental taps (minimum 8px gap)

---

## ActionBar Component Contract

**File**: `src/features/game/components/ActionBar.tsx`

### Props Interface

```typescript
interface ActionBarProps {
  /** Current score from Redux */
  score: number

  /** Current game status from Redux */
  status: 'idle' | 'running' | 'paused' | 'gameOver'

  /** Called when pause/resume button is tapped */
  onPause: () => void

  /** Called when restart button is tapped */
  onRestart: () => void

  /** Called when home button is tapped */
  onHome: () => void
}
```

### Behavior Contract

1. **Score display**: Always visible, formatted as "Score: {score}"
2. **Status display**: Shows current status with appropriate icon:
   - Running: "▶ Playing"
   - Paused: "⏸ Paused"
   - Game Over: "Game Over"
   - Idle: hidden
3. **Pause/Resume toggle**: Single button that toggles between pause and resume states
4. **Restart button**: Always visible when status is 'running' or 'paused'
5. **Home button**: Always visible, navigates to `/` on tap
6. **Touch-friendly**: All buttons meet 44x44px minimum tappable area

### Layout Contract

- Positioned above the game board
- Horizontal layout: `[Score] [Status] [Pause/Resume] [Restart] [Home]`
- Wraps gracefully on narrow screens
- Uses relative units (rem, vw) for responsive sizing

---

## useViewport Hook Contract

**File**: `src/features/game/useViewport.ts`

### Return Type

```typescript
interface ViewportInfo {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  breakpoint: 'phone' | 'tablet' | 'desktop'
  isMobile: boolean
  isLandscape: boolean
}

function useViewport(): ViewportInfo
```

### Behavior Contract

1. **Reactivity**: Updates on window resize events
2. **Breakpoint thresholds**:
   - `phone`: width < 768px
   - `tablet`: 768px <= width < 1024px
   - `desktop`: width >= 1024px
3. **Orientation detection**: Based on width vs height comparison
4. **Performance**: Debounced resize handler (200ms) to prevent excessive re-renders
5. **Cleanup**: Removes event listener on unmount

### Usage Contract

```typescript
const viewport = useViewport()
// Used for:
// - Conditionally rendering TouchControls (mobile only)
// - Applying landscape-specific CSS classes
// - Determining layout mode
```

---

## Shared Input Contract

**File**: `src/features/game/useSharedInput.ts` (new)

### Purpose

Provides a unified interface for direction changes from both keyboard and touch inputs.

### Interface

```typescript
interface SharedInputHook {
  /** Dispatches a direction change through Redux */
  dispatchDirection: (direction: Position) => void
}

function useSharedInput(): SharedInputHook
```

### Behavior Contract

1. **Single dispatch path**: Both keyboard and touch inputs route through `dispatchDirection`
2. **Validation**: Direction validation (180° reversal prevention) is handled by the Redux reducer, not the hook
3. **Consistency**: Same action (`changeDirection`) is dispatched regardless of input source

---

## GameBoard Component Contract (Modified)

**File**: `src/features/game/components/GameBoard.tsx`

### Modified Behavior

1. **Responsive sizing**: Board container must scale to fit viewport while maintaining 1:1 aspect ratio
2. **Grid cells**: Must not use fixed pixel sizes — use proportional sizing (percentage or flex)
3. **Overlay**: Must be responsive and readable on all screen sizes
4. **No layout shift**: Board resizing must not cause visible layout jumps

### Props (Unchanged)

```typescript
interface GameBoardProps {
  onRestart: () => void
}
```

---

## Game Page Component Contract (Modified)

**File**: `src/pages/Game.tsx`

### Modified Layout Contract

1. **Portrait layout** (default):
   ```
   [ActionBar]
   [GameBoard]
   [TouchControls] (mobile only)
   [Instructions] (desktop only)
   ```

2. **Landscape layout** (width >= 768px and orientation = landscape):
   ```
   ┌─────────────────────────────────────────────┐
   │ [ActionBar (full width)]                    │
   ├──────────────────┬──────────────────────────┤
   │ [GameBoard]      │ [TouchControls]          │
   │                  │ [GameControls]           │
   └──────────────────┴──────────────────────────┘
   ```

3. **Component ordering**: Must allow CSS Grid reordering for landscape layout

---

## CSS Module Contracts

### TouchControls.module.css

```css
/* Required classes */
.controls { /* D-pad container layout */ }
.button { /* Base button styles */ }
.button:active { /* Pressed state */ }
.button:focus-visible { /* Focus state */ }
.up { /* Top position */ }
.down { /* Bottom position */ }
.left { /* Left position */ }
.right { /* Right position */ }

/* Landscape variant */
.controls--landscape { /* Landscape-specific layout */ }
```

### ActionBar.module.css

```css
/* Required classes */
.actionBar { /* Container layout */ }
.score { /* Score display */ }
.status { /* Status display */ }
.button { /* Button styles */ }
.button--primary { /* Primary action (pause/resume) */ }
.button--secondary { /* Secondary action (restart) */ }
.button--icon { /* Icon button (home) */ }

/* Responsive adjustments */
.actionBar--wrap { /* Wrapped layout for narrow screens */ }
```

### Game.module.css (Modified)

```css
/* New/modified classes */
.container { /* Responsive container */ }
.gameLayout { /* Main layout grid */ }
.gameLayout--portrait { /* Portrait layout */ }
.gameLayout--landscape { /* Landscape layout */ }
.instructions { /* Responsive instructions */ }
```
