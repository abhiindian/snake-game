# Implementation Plan: Mobile-Friendly UI

**Branch**: `002-mobile-friendly-ui` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-mobile-friendly-ui/spec.md`

## Summary

Extend the existing browser-based Snake Game with a responsive, touch-friendly user interface for phones and tablets while preserving the existing desktop keyboard experience. This is a UI-only enhancement — no game engine, Redux store, or core gameplay logic changes are required. The implementation introduces three new UI components/hooks (`TouchControls`, `ActionBar`, `useViewport`), modifies existing layout components (`Game.tsx`, `GameBoard.tsx`), and adds responsive CSS using the existing CSS Modules pattern. No new dependencies are introduced.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x, ES2020

**Primary Dependencies**: 
- React 18 (UI framework)
- Redux Toolkit (state management)
- React Redux (React-Redux binding)
- React Router DOM (routing)
- Vite (build tool)
- Vitest + @testing-library/react + @testing-library/user-event (testing)

**Storage**: N/A — in-memory Redux state only, no persistence layer

**Testing**: Vitest + React Testing Library (existing setup)

**Target Platform**: Modern browsers — iOS Safari (15+), Chrome on Android, Firefox on Android, desktop Chrome/Firefox/Safari/Edge

**Project Type**: Single-page web application (browser-based game)

**Performance Goals**: 
- Touch input latency < 50ms (perceived instant)
- No layout shift during resize or orientation change
- Board rendering remains efficient at 60fps with 40x40 grid
- Debounced resize handler (200ms) to prevent excessive re-renders

**Constraints**: 
- No new dependencies (CSS-only responsive design)
- No changes to Redux store shape or game engine logic
- No replacement of Redux with another state system
- No movement of core game engine logic into UI components
- No heavy UI libraries
- Desktop keyboard gameplay must not be regressed
- Minimum supported viewport: 320px width
- Grid size remains 40x40 on all screens

**Scale/Scope**: 
- 3 new UI components/hooks
- 2 modified components (Game.tsx, GameBoard.tsx)
- 3 new CSS modules, 2 modified CSS modules
- ~3 new test files, ~2 modified test files
- No changes to backend, API, or data persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I — Architecture First
**PASS**: TouchControls, ActionBar, and useViewport are added as new feature components. Game engine (gameSlice, gameEngine, useGameLoop) remains strictly separate from UI rendering. Redux state remains serializable and minimal — no derived UI values are stored.

### Principle II — Deterministic Gameplay
**PASS**: Touch controls dispatch the same `changeDirection` Redux action as keyboard input. No direction validation logic is duplicated in UI components. The game loop and tick reducer remain the single source of truth for direction application.

### Principle III — Redux Discipline
**PASS**: No new state is added to the Redux store. `ViewportInfo` is computed via a React hook (not Redux). TouchControls and ActionBar are presentational components that derive everything from props/Redux.

### Principle IV — Routing and UX
**PASS**: Existing React Router routes are preserved. Keyboard-first gameplay continues to work identically. The UI clearly communicates score, state, and controls on mobile via the new ActionBar.

### Principle V — Quality and Maintainability
**PASS**: New components follow the existing feature-based folder structure. TypeScript is used throughout. Tests are added for new components. Components are small and focused.

### Principle VI — Performance
**PASS**: No unnecessary re-renders — TouchControls uses stable callbacks. Board rendering uses the existing efficient grid approach. CSS-based responsive design avoids JavaScript resize overhead. Debounced resize handler (200ms) prevents excessive updates.

### Principle VII — Accessibility
**PASS**: Touch controls use `<button>` elements with ARIA labels. Visible focus states are maintained. All action buttons are keyboard-accessible. Color is not the only indicator (icons + text).

### Principle VIII — Delivery Standards
**PASS**: The application runs locally via Vite dev server. Clean build expected. README.md update included to document mobile controls.

**No complexity justified** — all principles are satisfied without deviation.

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-friendly-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output — technical decisions and rationale
├── data-model.md        # Phase 1 output — UI-only types and interfaces
├── quickstart.md        # Phase 1 output — 10 validation scenarios
├── contracts/
│   └── internal-interfaces.md  # Phase 1 output — component contracts
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── game/
│       ├── components/
│       │   ├── GameBoard.tsx          # MODIFIED — responsive sizing
│       │   ├── GameBoard.module.css   # MODIFIED — responsive board
│       │   ├── GameControls.tsx       # UNCHANGED
│       │   ├── GameControls.module.css # UNCHANGED
│       │   ├── TouchControls.tsx      # NEW — D-pad directional buttons
│       │   └── TouchControls.module.css # NEW — D-pad layout, press states
│       ├── useGameLoop.ts             # UNCHANGED
│       └── useKeyboardInput.ts        # UNCHANGED
│   └── score/
│       └── components/
│           ├── Scoreboard.tsx         # UNCHANGED
│           └── Scoreboard.module.css  # UNCHANGED
├── pages/
│   ├── Game.tsx                       # MODIFIED — new layout with ActionBar + TouchControls
│   ├── Game.module.css                # MODIFIED — responsive grid layout
│   ├── Home.tsx                       # UNCHANGED
│   └── Home.module.css                # UNCHANGED
├── store/
│   └── gameSlice.ts                   # UNCHANGED
├── utils/
│   ├── constants.ts                   # UNCHANGED
│   └── gameEngine.ts                  # UNCHANGED
└── routes/
    └── Routes.tsx                     # UNCHANGED

tests/
├── integration/
│   └── gameFlow.test.tsx              # MODIFIED — add mobile touch flow
├── unit/
│   ├── gameEngine.test.ts             # UNCHANGED
│   └── gameSlice.test.ts              # UNCHANGED
└── features/
    └── game/
        └── components/
            └── TouchControls.test.tsx # NEW — touch dispatch, accessibility tests

public/
└── index.html                         # MODIFIED — add viewport-fit=cover meta tag
```

**Structure Decision**: The existing feature-based structure is extended with new components in `src/features/game/components/`. The Game page (`src/pages/Game.tsx`) is the composition root that wires together Scoreboard, ActionBar (new), GameBoard, TouchControls (new), and GameControls. No new directories or project structures are introduced — this avoids unnecessary complexity and aligns with Constitution Principle I.

## Complexity Tracking

No violations of the Constitution. No complexity tracking required.

## Implementation Strategy

### Phase 0: Foundation

1. **Update `public/index.html`** — Add `viewport-fit=cover` meta tag for safe area support on notched devices.

2. **Create `TouchControls` component** — New D-pad directional buttons that dispatch `changeDirection` via Redux.

3. **Create `useViewport` hook** — Computes viewport info (width, height, orientation, breakpoint) with debounced resize handling.

### Phase 1: Layout Integration

4. **Create `ActionBar` component** — Top action bar with score, status, pause/resume, restart, and home buttons.

5. **Modify `Game.tsx`** — Update layout to include ActionBar above GameBoard, conditionally render TouchControls based on viewport.

6. **Modify `Game.module.css`** — Implement responsive CSS Grid layout: vertical stack (portrait) → side-by-side (landscape).

7. **Modify `GameBoard.tsx`** — Replace inline width/height styles with responsive CSS classes. Use `aspect-ratio: 1/1` and relative sizing.

8. **Modify `GameBoard.module.css`** — Update board styles for responsive sizing. Change cell sizing from fixed pixels to proportional (percentage-based).

### Phase 2: Polish & Testing

9. **Update `Scoreboard.module.css`** — Ensure score and status text remain legible on 320px viewports.

10. **Modify `gameFlow.test.tsx`** — Add integration test for touch control flow.

11. **Create `TouchControls.test.tsx`** — Unit tests for touch dispatch, accessibility, and 180° reversal consistency.

12. **Update `README.md`** — Document mobile controls, responsive behavior, and testing instructions.

13. **Manual validation** — Test all 10 scenarios in `quickstart.md` across device breakpoints.

## Detailed Component Design

### TouchControls Component

**File**: `src/features/game/components/TouchControls.tsx`

```typescript
interface TouchControlsProps {
  onDirectionChange: (direction: Position) => void
  className?: string
}
```

**D-Pad Layout** (CSS Grid):
```
    [↑]
[←] [↓] [→]
```

**Key behaviors**:
- Each button is a `<button>` element with `aria-label`
- `touchstart` and `touchend` call `e.preventDefault()`
- Dispatches `changeDirection` via `onDirectionChange` prop
- No internal direction validation — delegates to Redux reducer
- Visual feedback via CSS `:active` state (scale + color change)
- Minimum 44x44px tappable area
- Keyboard-focusable with visible `:focus-visible` outline

**Direction mapping**:
```typescript
const DIRECTION_MAP: Record<string, Position> = {
  up:    { x:  0, y: -1 },
  down:  { x:  0, y:  1 },
  left:  { x: -1, y:  0 },
  right: { x:  1, y:  0 },
}
```

### ActionBar Component

**File**: `src/features/game/components/ActionBar.tsx`

```typescript
interface ActionBarProps {
  score: number
  status: GameStatus
  onPause: () => void
  onRestart: () => void
  onHome: () => void
}
```

**Layout** (horizontal, wraps on narrow screens):
```
[Score: 120] [▶ Playing] [⏸] [↻] [🏠]
```

**Key behaviors**:
- Score always visible
- Status text with icon (▶/⏸/Game Over)
- Pause/Resume toggle button
- Restart button (visible when running or paused)
- Home button (always visible)
- All buttons meet 44x44px minimum
- Uses relative units (rem, vw) for responsive sizing

### useViewport Hook

**File**: `src/features/game/useViewport.ts`

```typescript
interface ViewportInfo {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  breakpoint: 'phone' | 'tablet' | 'desktop'
  isMobile: boolean
  isLandscape: boolean
}
```

**Key behaviors**:
- Debounced resize handler (200ms)
- Breakpoint thresholds: phone < 768px, tablet 768-1024px, desktop >= 1024px
- Orientation based on width vs height
- Cleanup event listener on unmount
- Not stored in Redux — computed per-render

### Responsive Layout Strategy

**Breakpoints**:
- **Phone**: width < 768px — vertical stack
- **Tablet**: 768px <= width < 1024px — vertical stack or side-by-side depending on orientation
- **Desktop**: width >= 1024px — vertical stack (existing layout)

**Portrait Layout** (default):
```
┌─────────────────────────────┐
│         ActionBar           │
├─────────────────────────────┤
│                           │ │
│        GameBoard          │ │
│                           │ │
├─────────────────────────────┤
│    [↑]                      │
│  [←] [↓] [→]               │
│    TouchControls            │
├─────────────────────────────┤
│       GameControls          │
├─────────────────────────────┤
│       Instructions          │
└─────────────────────────────┘
```

**Landscape Layout** (width >= 768px AND orientation = landscape):
```
┌─────────────────────────────────────────────────┐
│                    ActionBar                    │
├───────────────────────┬─────────────────────────┤
│                       │  [↑]                    │
│     GameBoard         │  [←][↓][→]             │
│                       │  TouchControls          │
│                       │  GameControls           │
└───────────────────────┴─────────────────────────┘
```

**CSS Grid implementation**:
```css
/* Portrait (default) */
.gameLayout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Landscape */
@media (min-width: 768px) and (orientation: landscape) {
  .gameLayout {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    align-items: start;
  }
  
  .gameLayout .actionBar {
    grid-column: 1 / -1;
  }
  
  .gameLayout .gameBoard {
    grid-row: 2;
    grid-column: 1;
  }
  
  .gameLayout .controls {
    grid-row: 2;
    grid-column: 2;
  }
}
```

### Game Board Responsiveness

**Current** (inline styles):
```tsx
<div
  className={styles.board}
  style={{
    width: GRID_WIDTH * CELL_SIZE,  // 40 * 14 = 560px
    height: GRID_HEIGHT * CELL_SIZE, // 40 * 14 = 560px
  }}
>
```

**Proposed** (CSS classes):
```tsx
<div className={`${styles.board} ${styles['board--responsive']}`}>
```

```css
.board--responsive {
  width: 100%;
  max-width: min(90vw, 80vh);
  aspect-ratio: 1 / 1;
}

.cell {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.03);
}
```

**Rationale**: The board container scales fluidly to fit the viewport while the internal CSS Grid (`grid-template-columns: repeat(40, 1fr)`) automatically distributes space evenly across all 40 columns. Cells use `width: 100%` to fill their grid cell, eliminating the need for fixed pixel sizes.

### Shared Input Model

Both keyboard and touch inputs route through the same Redux action:

```
Keyboard Input          Touch Input
    │                       │
    ▼                       ▼
dispatch(               dispatch(
  changeDirection)        changeDirection)
    │                       │
    └──────────┬────────────┘
               ▼
    Redux reducer
    (180° reversal check)
               ▼
    state.nextDirection
               ▼
    Game loop (tick)
               ▼
    processTick()
```

**No duplication**: The `useKeyboardInput` hook continues to dispatch `changeDirection` directly. The `TouchControls` component receives `onDirectionChange` as a prop, which is wired to `dispatch(changeDirection)` in the parent `Game` component.

## Risks, Assumptions, and Migration Impact

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Touch controls overlapping game board on very small landscape screens | Medium | CSS Grid layout ensures controls stay in their column; `max-width` on board prevents overflow |
| `aspect-ratio` CSS property not supported on older browsers | Low | iOS 15+ and Chrome 88+ support it; fallback via `padding-bottom: 100%` technique if needed |
| Touch event `preventDefault` interfering with button focus/keyboard access | Low | Use `touchstart` and `touchend` only (not `click`); buttons remain keyboard-focusable as native `<button>` elements |
| Layout shift during orientation change causing visual glitch | Medium | Debounced resize handler (200ms) prevents mid-transition renders; CSS transitions on grid items |
| Game board cells becoming too small to see on very large screens | Low | `max-width` on board container prevents excessive scaling; cells scale proportionally |
| Touch controls visible on desktop when not needed | Low | `useViewport` hook determines `isMobile`; TouchControls rendered conditionally |

### Assumptions

- The existing game engine (gameSlice, gameEngine, useGameLoop) handles all core Snake logic and will be reused without modification.
- CSS `aspect-ratio` property is available in all target browsers (iOS Safari 15+, Chrome 88+, Firefox 89+).
- The `viewport-fit=cover` meta tag is safe to add (no known conflicts).
- Touch devices support CSS media queries (all modern browsers do).
- The existing Redux store shape is sufficient — no new state fields are needed for mobile UI.
- `@testing-library/user-event` is available for simulating touch events in tests.

### Migration Impact

**Zero breaking changes**:
- All existing props and interfaces on unchanged components remain identical.
- `useKeyboardInput` hook is not modified — keyboard behavior is 100% preserved.
- Redux store shape is not modified.
- Game engine functions are not modified.
- Existing routes and navigation are not modified.
- Home page is not modified.

**Modified files** (backward compatible):
- `Game.tsx` — Adds new child components, existing behavior preserved.
- `Game.module.css` — Adds responsive rules, existing styles preserved.
- `GameBoard.tsx` — Replaces inline styles with CSS classes, visual output identical at desktop sizes.
- `GameBoard.module.css` — Adds responsive rules, existing styles preserved.
- `public/index.html` — Adds one meta attribute.
- `README.md` — Adds mobile documentation.

**New files** (no conflicts):
- `src/features/game/components/TouchControls.tsx`
- `src/features/game/components/TouchControls.module.css`
- `src/features/game/components/ActionBar.tsx`
- `src/features/game/components/ActionBar.module.css`
- `src/features/game/useViewport.ts`
- `tests/features/game/components/TouchControls.test.tsx`

**Modified test files** (existing tests continue to pass):
- `tests/integration/gameFlow.test.tsx` — Appends new touch flow test.

## Testing Approach

### Unit Tests

| Test File | Tests |
|-----------|-------|
| `TouchControls.test.tsx` | Direction dispatch on tap, preventDefault on touch events, ARIA labels, keyboard focusability, 180° reversal consistency, visual feedback on `:active` |
| `ActionBar.test.tsx` | Score display, status text, pause/resume toggle, restart visibility, home navigation |
| `useViewport.test.tsx` | Breakpoint calculation, orientation detection, debounced resize, cleanup on unmount |

### Integration Tests

| Test File | Tests |
|-----------|-------|
| `gameFlow.test.tsx` (modified) | Existing keyboard flow (unchanged) + new touch control flow: start → tap direction → snake moves → pause → resume → restart |

### Manual Testing

- All 10 scenarios in `quickstart.md`
- Device testing on iOS Safari and Chrome Android where possible
- Browser DevTools device emulation for additional breakpoints
- Orientation change testing (portrait ↔ landscape)
- Horizontal scrolling verification at all breakpoints
- Touch target size verification (44x44px minimum)

## Success Criteria Mapping

| Spec Criteria | Implementation Approach |
|---------------|------------------------|
| SC-001: Full game session on phone without keyboard | TouchControls + ActionBar provide complete control set |
| SC-002: Readable on 320px viewport | Responsive CSS with relative units, min font sizes, wrapped layout |
| SC-003: No horizontal scrolling at any viewport | `max-width: 100%`, CSS Grid layout, `viewport-fit=cover` |
| SC-004: No desktop keyboard regression | `useKeyboardInput` unchanged, TouchControls hidden on desktop |
| SC-005: Perfect square board at all sizes | `aspect-ratio: 1/1`, CSS Grid with `1fr` columns |
| SC-006: 44x44px touch targets, visible feedback | TouchControls CSS enforces min-size, `:active` state for feedback |
