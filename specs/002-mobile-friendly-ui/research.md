# Research: Mobile-Friendly UI

**Feature**: 002-mobile-friendly-ui
**Date**: 2026-07-05
**Status**: Complete

## Technical Decisions

### 1. Responsive Layout Strategy — CSS Media Queries + CSS Grid/Flexbox

**Decision**: Use CSS media queries with a mobile-first approach, leveraging the existing CSS Modules pattern (`*.module.css`).

**Rationale**: 
- The project already uses CSS Modules extensively (`GameBoard.module.css`, `GameControls.module.css`, `Game.module.css`, etc.)
- No new dependencies are needed — aligns with Constitution Principle VI (minimize dependencies)
- Media queries are universally supported on all target browsers (iOS Safari, Chrome Android, Firefox Android)
- The spec explicitly states "No new build tools or dependencies are required"

**Alternatives considered**:
- CSS-in-JS (emotion/styled-components): Rejected — adds dependency, overkill for responsive layout
- Tailwind CSS: Rejected — adds significant dependency, existing CSS Modules pattern is well-established
- JavaScript-based resize listeners: Rejected — CSS is more performant for layout changes, adds unnecessary JS overhead

### 2. Game Board Responsiveness — CSS `aspect-ratio` + `max-width`/`max-height`

**Decision**: Make the board container responsive using CSS `aspect-ratio: 1/1`, `max-width: 100%`, and viewport-relative sizing. The internal 40x40 grid remains unchanged.

**Rationale**:
- CSS `aspect-ratio` property is well-supported in modern browsers (iOS 15+, Chrome 88+, Firefox 89+)
- `max-width: 100%` prevents horizontal overflow on narrow screens
- The spec confirms: "Keep the 40x40 grid on all screens; board scales to fit"
- The existing `GameBoard` component uses inline styles for width/height — these will be replaced with CSS classes

**Implementation approach**:
- Replace inline `style={{ width, height }}` on the board with CSS classes
- Use `width: 100%; max-width: min(90vw, 80vh); aspect-ratio: 1/1;` for responsive sizing
- The grid cells will use `width: 100%; height: 100%;` (no fixed pixel sizes) to scale proportionally

**Alternatives considered**:
- JavaScript-based resize observer: Rejected — CSS is more performant and declarative
- Fixed pixel sizes with scaling transform: Rejected — causes blurriness on high-DPI screens

### 3. Touch Controls — New `TouchControls` Component

**Decision**: Create a new `TouchControls` component (`src/features/game/components/TouchControls.tsx`) with a D-pad layout positioned below the game board.

**Rationale**:
- Spec confirms: "D-pad layout positioned below the game board"
- D-pad is the most ergonomic and recognizable pattern for mobile Snake games
- Each button meets 44x44px minimum tappable area (FR-005)
- Uses `e.preventDefault()` on `touchstart`/`touchend` to prevent browser behaviors (per spec clarification)
- Reuses the same `changeDirection` Redux action as keyboard input for consistency

**Component structure**:
```
TouchControls/
├── Component: TouchControls.tsx
├── Styles: TouchControls.module.css
└── Hook: useTouchControls.ts (optional, for touch event handling)
```

**D-pad layout** (portrait):
```
    [↑]
[←] [↓] [→]
```

**D-pad layout** (landscape):
```
    [↑]
[←] [↓] [→]
```
(Controls move to right side of screen, board on left)

**Alternatives considered**:
- Swipe gestures: Rejected — explicitly out of scope per spec
- Joystick: Rejected — overengineered for Snake, D-pad is simpler and more familiar
- Edge swipes: Rejected — less discoverable, harder to implement reliably

### 4. Shared Input Model — Common Redux Action

**Decision**: Both keyboard and touch controls dispatch the same `changeDirection` Redux action. No duplication of direction validation logic.

**Rationale**:
- Aligns with Constitution Principle II (deterministic gameplay, no hidden side effects)
- The `changeDirection` reducer already prevents 180° reversals
- Single source of truth for direction changes ensures consistent behavior
- `useKeyboardInput` hook will continue to dispatch `changeDirection` via the existing `dispatch` call
- `TouchControls` component will also dispatch `changeDirection` directly

**Input flow**:
```
Keyboard (useKeyboardInput)  →  dispatch(changeDirection(direction))
Touch (TouchControls)        →  dispatch(changeDirection(direction))
                                      ↓
                        Redux reducer (changeDirection)
                                      ↓
                        Validates direction (no 180° reversal)
                                      ↓
                        Updates state.nextDirection
                                      ↓
                        Game loop (tick) applies direction
```

**Alternatives considered**:
- Custom hook that wraps both inputs: Rejected — adds unnecessary abstraction layer, direct dispatch is simpler
- Event-based communication: Rejected — Redux actions are already the established pattern

### 5. Action Buttons — Top Action Bar Component

**Decision**: Create a new `ActionBar` component positioned above the game board, visible on all screen sizes.

**Rationale**:
- Spec confirms: "Top action bar above the board"
- Keeps critical actions (pause, resume, restart, home) within thumb reach on mobile
- Reuses existing `Scoreboard` component for score/status display
- Adds action buttons (pause/resume, restart, home) that are touch-friendly

**Component structure**:
```
ActionBar/
├── Component: ActionBar.tsx
└── Styles: ActionBar.module.css
```

**Layout** (portrait):
```
[Score: 120] [▶ Playing] [⏸] [↻] [🏠]
```

**Layout** (landscape):
```
[Score: 120] [▶ Playing] [⏸] [↻] [🏠]
```
(Action bar spans full width above board)

### 6. Landscape Layout — Side-by-Side with CSS Grid

**Decision**: Use CSS Grid for the main game layout container. Portrait: vertical stack. Landscape: board left, controls right.

**Rationale**:
- CSS Grid is ideal for 2D layouts like this
- Well-supported in all target browsers
- No JavaScript required for layout switching
- Media query at ~768px breakpoint triggers layout change

**Grid layout** (landscape):
```css
.gameLayout {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
}
```

**Alternatives considered**:
- JavaScript-based layout switching: Rejected — CSS Grid is more performant
- Flexbox with flex-direction: Rejected — CSS Grid provides better 2D control

### 7. Overlays — Responsive Modal with CSS

**Decision**: Enhance existing overlay in `GameBoard.module.css` to be responsive. No new library.

**Rationale**:
- The game already has an overlay for "Game Over" in `GameBoard.tsx`
- Pause overlay can be added similarly
- CSS-only approach aligns with "no new dependencies" constraint
- `backdrop-filter: blur()` is well-supported on modern mobile browsers

**Enhancements**:
- Use relative units (rem, vw, vh) instead of fixed pixels
- Ensure buttons meet 44x44px minimum
- Add `touch-action: manipulation` to prevent double-tap zoom

### 8. Accessibility — Preserve and Extend

**Decision**: Maintain keyboard accessibility for all touch controls. Add ARIA labels and focus states.

**Rationale**:
- Constitution Principle VII (Accessibility) mandates keyboard interaction support
- FR-012 requires visible focus states
- Touch controls must be keyboard-accessible (NFR-006)
- Use `<button>` elements (not `<div>`) for touch controls to ensure native keyboard support

### 9. Testing Strategy

**Decision**: Add unit tests for touch control dispatch behavior and integration tests for responsive rendering.

**Approach**:
- Use existing Vitest + React Testing Library setup
- Mock touch events with `@testing-library/user-event` (already available)
- Test that `TouchControls` dispatches `changeDirection` on tap
- Test that `ActionBar` renders correctly at different viewport widths (using CSS media query classes)
- Manual testing on device/browser devtools for responsive behavior

**Unit tests**:
- `TouchControls.test.tsx`: Dispatches correct direction on tap
- `TouchControls.test.tsx`: Prevents 180° reversal (same as keyboard)
- `TouchControls.test.tsx`: Calls `e.preventDefault()` on touch events

**Integration tests**:
- `gameFlow.test.tsx`: Existing tests continue to pass (keyboard)
- New flow: Start game → Tap touch controls → Snake moves correctly

## Research Conclusions

All technical decisions align with:
- Existing codebase patterns (CSS Modules, Redux Toolkit, feature-based structure)
- Constitution principles (separation of concerns, no heavy dependencies, keyboard-first accessibility)
- Spec requirements (mobile-first, responsive, touch-friendly, no desktop regression)
- No new dependencies required
- Minimal changes to game engine (UI-only enhancement)
