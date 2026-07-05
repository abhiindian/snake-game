# Tasks: Mobile-Friendly UI

**Input**: Design documents from `/specs/002-mobile-friendly-ui/`

**Branch**: `002-mobile-friendly-ui` | **Date**: 2026-07-05

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

**Tests**: Unit and integration tests included for new components and workflows.

---

## Phase 1: Setup (Infrastructure)

**Purpose**: Prepare the project for mobile UI development.

- [ ] T001 Add `viewport-fit=cover` attribute to `public/index.html` meta viewport tag for safe area support on notched devices

**Checkpoint**: Project infrastructure ready for mobile development.

---

## Phase 2: Foundational — Viewport Detection & Layout Skeleton

**Purpose**: Core infrastructure that both touch controls and responsive layout depend on. No other feature work can proceed until this phase is complete.

**⚠️ CRITICAL**: TouchControls and ActionBar both depend on `useViewport` for conditional rendering. Game.tsx layout depends on this phase.

- [ ] T002 [P] Create `src/features/game/useViewport.ts` hook that computes width, height, orientation, breakpoint (phone/tablet/desktop), isMobile, isLandscape with debounced resize handler (200ms)
  - Breakpoint thresholds: phone < 768px, tablet 768-1024px, desktop >= 1024px
  - Orientation based on width vs height comparison
  - Cleanup event listener on unmount
  - **Acceptance**: Hook returns correct values at each breakpoint; resize is debounced; listener removed on unmount

**Checkpoint**: Foundation ready — all feature components can now be built on top of `useViewport`.

---

## Phase 3: User Story 1 — Play on Phone Without Keyboard (Priority: P1) 🎯 MVP

**Goal**: Mobile player can control the snake using on-screen D-pad touch buttons without a keyboard.

**Independent Test**: Open the game on a mobile device (or DevTools device emulation at 375px), tap the D-pad buttons, and observe the snake responds to each tap.

### Tests for User Story 1

- [ ] T003 [P] [US1] Create `tests/features/game/components/TouchControls.test.tsx` with tests for:
  - Direction dispatch on tap (each button dispatches correct Position vector)
  - `e.preventDefault()` called on touchstart and touchend events
  - Buttons have correct ARIA labels
  - 180° reversal consistency with keyboard behavior
  - Visual `:active` state renders

### Implementation for User Story 1

- [ ] T004 [P] [US1] Create `src/features/game/components/TouchControls.module.css` with:
  - D-pad container layout using CSS Grid (cross pattern)
  - Button styles with minimum 44x44px tappable area
  - `:active` state for visual feedback (scale + color change)
  - `:focus-visible` outline for keyboard accessibility
  - Adequate spacing (8px minimum gap) between adjacent buttons
  - Portrait layout class (centered below board)

- [ ] T005 [P] [US1] Create `src/features/game/components/TouchControls.tsx` with:
  - D-pad layout: Up centered above, Left/Down/Right in a row below
  - Each button is a `<button>` element with `aria-label` and `onTouchStart`/`onTouchEnd` handlers
  - `onDirectionChange` prop wired to `dispatch(changeDirection(direction))`
  - Direction mapping: Up `{x:0,y:-1}`, Down `{x:0,y:1}`, Left `{x:-1,y:0}`, Right `{x:1,y:0}`
  - `e.preventDefault()` on touchstart/touchend events
  - No internal direction validation — delegates to Redux reducer
  - **Acceptance**: Component renders D-pad, dispatches correct direction on tap, prevents default browser behavior

- [ ] T006 [US1] Wire `TouchControls` into `src/pages/Game.tsx`:
  - Import and render `TouchControls` below `GameBoard`
  - Pass `onDirectionChange={dispatch(changeDirection)}` as prop
  - Conditionally render: show on mobile (useViewport.isMobile), hide on desktop
  - **Acceptance**: Touch controls visible on mobile viewport, hidden on desktop, snake responds to taps

**Checkpoint**: User Story 1 is fully functional — a mobile player can control the snake using touch buttons alone.

---

## Phase 4: User Story 2 — Responsive Layout Fits Any Screen (Priority: P1)

**Goal**: Game layout automatically resizes and fits any screen without horizontal scrolling or cramped elements.

**Independent Test**: Open the game at 320px, 375px, 414px, 768px, and 1024px viewports — all UI elements remain visible and properly contained with no horizontal scrolling.

### Tests for User Story 2

- [ ] T007 [P] [US2] Add responsive layout verification to `tests/integration/gameFlow.test.tsx`:
  - Verify no horizontal overflow at narrow viewport widths
  - Verify all UI sections (ActionBar, GameBoard, TouchControls) render within viewport

### Implementation for User Story 2

- [ ] T008 [P] [US2] Modify `src/pages/Game.module.css`:
  - Container: `min-height: 100vh`, `padding: 1rem` (reduced from 2rem for mobile), `overflow-x: hidden`
  - Game area flex container: `flex-direction: column`, `align-items: center`, `gap: 0.75rem` (tighter on mobile)
  - Portrait layout: vertical stack with flexible gaps
  - Landscape layout (`@media (min-width: 768px) and (orientation: landscape)`):
    - Grid layout: `grid-template-columns: 1fr auto`, `grid-template-rows: auto 1fr`
    - ActionBar spans full width (`grid-column: 1 / -1`)
    - GameBoard in column 1, controls in column 2
  - Instructions: hidden on mobile (`display: none` below 768px), visible on desktop
  - **Acceptance**: No horizontal scrolling at any breakpoint; portrait = vertical stack, landscape = side-by-side

- [ ] T009 [P] [US2] Modify `src/pages/Game.tsx`:
  - Import `useViewport` hook
  - Add `className={styles.gameLayout}` wrapper div
  - Apply conditional classes: `styles['gameLayout--portrait']` or `styles['gameLayout--landscape']`
  - Conditionally render TouchControls only when `isMobile` is true
  - Conditionally render instructions only when `!isMobile`
  - **Acceptance**: Layout switches between portrait/landscape based on viewport

**Checkpoint**: User Story 2 is fully functional — the game layout fits any screen size without scrolling or overflow.

---

## Phase 5: User Story 3 — Game Board Scales and Remains Square (Priority: P1)

**Goal**: Game board scales proportionally to any screen while always maintaining a perfect square-grid appearance.

**Independent Test**: Resize the browser window or rotate the device — the board stays square and grid cells remain uniform without distortion or pixelation.

### Implementation for User Story 3

- [ ] T010 [P] [US3] Modify `src/features/game/components/GameBoard.module.css`:
  - Add `--board-max-width: min(90vw, 80vh)` CSS custom property
  - Board container: `width: 100%`, `max-width: var(--board-max-width)`, `aspect-ratio: 1 / 1`
  - Remove fixed pixel dimensions from `.board` class
  - Cells: `width: 100%`, `height: 100%` (proportional, no fixed 14px size)
  - Grid: `grid-template-columns: repeat(40, 1fr)`, `grid-template-rows: repeat(40, 1fr)` (unchanged)
  - **Acceptance**: Board scales fluidly, maintains 1:1 aspect ratio, cells remain uniform

- [ ] T011 [P] [US3] Modify `src/features/game/components/GameBoard.tsx`:
  - Remove inline `style={{ width, height }}` from board div
  - Apply responsive class: `${styles.board} ${styles['board--responsive']}`
  - Keep overlay, scoring, and all existing functionality unchanged
  - **Acceptance**: Board renders at responsive size, visual output identical to pre-mobile at desktop sizes

**Checkpoint**: User Story 3 is fully functional — the game board scales proportionally while maintaining square aspect ratio.

---

## Phase 6: User Story 4 — Touch-Friendly Actions (Priority: P2)

**Goal**: Mobile player can tap large, easy-to-reach buttons for pause, resume, restart, and home.

**Independent Test**: Tap each action button on a mobile device — they respond to taps, are clearly labeled, and are large enough for comfortable one-handed use.

### Tests for User Story 4

- [ ] T012 [P] [US4] Create `tests/features/game/components/ActionBar.test.tsx` with tests for:
  - Score displays correctly from Redux state
  - Status text shows correct label for each game state
  - Pause button toggles to Resume when game is paused
  - Restart button is visible when running or paused
  - Home button dispatches navigation to `/`
  - All buttons meet 44x44px minimum (visual/size assertion)

### Implementation for User Story 4

- [ ] T013 [P] [US4] Create `src/features/game/components/ActionBar.module.css` with:
  - Container: `display: flex`, `flex-wrap: wrap`, `gap: 0.5rem`, `justify-content: center`, `align-items: center`
  - Score section: `font-size: 1.1rem`, `font-weight: 700`, `color: #00b894`
  - Status section: `font-size: 0.95rem`, color-coded by state
  - Buttons: `min-width: 44px`, `min-height: 44px`, `padding: 0.5rem 1rem`, `font-size: 0.95rem`
  - Button variants: primary (pause/resume), secondary (restart), icon (home)
  - `:focus-visible` outline identical to existing button styles
  - **Acceptance**: Action bar renders at all screen sizes, buttons meet minimum tappable area

- [ ] T014 [P] [US4] Create `src/features/game/components/ActionBar.tsx` with:
  - Props: `score: number`, `status: GameStatus`, `onPause: () => void`, `onRestart: () => void`, `onHome: () => void`
  - Score display: "Score: {score}"
  - Status text with icons: ▶ Playing / ⏸ Paused / Game Over
  - Pause/Resume toggle button (single button, label changes based on status)
  - Restart button (visible when status is 'running' or 'paused')
  - Home button (always visible, navigates to `/`)
  - All buttons use `<button>` elements with `aria-label`
  - **Acceptance**: ActionBar renders correctly, all actions dispatch correctly

- [ ] T015 [US4] Integrate `ActionBar` into `src/pages/Game.tsx`:
  - Import `ActionBar` component
  - Render above `GameBoard`: `<ActionBar score={score} status={status} onPause={handlePause} onRestart={handleRestart} onHome={() => navigate('/')} />`
  - Pass Redux `score` and `status` via `useSelector`
  - Wire `onPause` to `dispatch(togglePause())`
  - **Acceptance**: Action bar appears above game board, all buttons function correctly

**Checkpoint**: User Story 4 is fully functional — mobile player has touch-friendly action buttons in a top action bar.

---

## Phase 7: User Story 5 — Score and Status Remain Legible on Small Screens (Priority: P2)

**Goal**: Score and status text remain clearly readable at 320px viewport width without zooming.

**Independent Test**: View the game at 320px width — score and status text is legible without zooming or straining.

### Implementation for User Story 5

- [ ] T016 [P] [US5] Modify `src/features/score/components/Scoreboard.module.css`:
  - Scoreboard container: `padding: 0.5rem 1rem` (reduced from 0.75rem/1.5rem for mobile)
  - Score value: `font-size: clamp(1.5rem, 4vw, 2rem)` for responsive sizing
  - Label: `font-size: clamp(0.75rem, 2vw, 0.9rem)` (minimum 14px equivalent on mobile)
  - Status text: `font-size: clamp(0.8rem, 2.5vw, 0.95rem)`
  - Ensure `white-space: nowrap` for score value to prevent wrapping
  - **Acceptance**: Score and status legible at 320px, no text overflow or wrapping

- [ ] T017 [US5] Verify `src/features/game/components/ActionBar.tsx` status text uses `clamp()` sizing for responsive legibility

**Checkpoint**: User Story 5 is fully functional — score and status remain legible on the smallest supported screen.

---

## Phase 8: User Story 6 — Mobile-Friendly Overlays (Priority: P2)

**Goal**: Pause and game-over overlays are fully readable and actionable on small screens.

**Independent Test**: Open the game on mobile, trigger pause or game over — overlay is readable, buttons are tappable, and content fits within the viewport.

### Implementation for User Story 6

- [ ] T018 [P] [US6] Modify `src/features/game/components/GameBoard.module.css`:
  - Overlay: ensure `position: absolute`, `inset: 0` (not fixed pixel dimensions)
  - Overlay background: `background-color: rgba(0, 0, 0, 0.75)`, `backdrop-filter: blur(4px)`
  - Overlay h2: `font-size: clamp(1.5rem, 5vw, 2.5rem)` (responsive)
  - Overlay p: `font-size: clamp(1rem, 3vw, 1.3rem)` (responsive)
  - Restart button: `min-width: 44px`, `min-height: 44px`, `padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1.5rem, 4vw, 2rem)`
  - Ensure overlay text has sufficient contrast (already `#e74c3c` on dark background)
  - **Acceptance**: Overlay content is readable and tappable at all screen sizes

- [ ] T019 [US6] Verify pause overlay (if separate from game over) follows same responsive patterns
  - Note: Current implementation uses a single overlay for game over; pause uses GameControls button
  - If pause overlay is added, ensure it follows the same responsive patterns as game over overlay

**Checkpoint**: User Story 6 is fully functional — overlays are mobile-friendly and actionable.

---

## Phase 9: User Story 7 — Desktop Keyboard Controls Continue to Work (Priority: P2)

**Goal**: Existing desktop keyboard controls work identically to the pre-mobile version.

**Independent Test**: Play the game on a desktop browser with a keyboard — all arrow keys, WASD, and spacebar function identically to the pre-mobile version.

### Tests for User Story 7

- [ ] T020 [P] [US7] Verify existing tests in `tests/unit/gameSlice.test.ts` and `tests/unit/gameEngine.test.ts` still pass (no regressions)
- [ ] T021 [P] [US7] Add regression test to `tests/integration/gameFlow.test.tsx`:
  - Simulate keyboard inputs (arrow keys, WASD, spacebar)
  - Verify snake responds correctly to each key
  - Verify pause/resume toggles with spacebar
  - **Acceptance**: All existing keyboard flows pass in integration tests

### Implementation for User Story 7

- [ ] T022 [US7] Verify `src/features/game/useKeyboardInput.ts` is unmodified:
  - Arrow keys and WASD map to correct direction vectors
  - Spacebar dispatches `togglePause()`
  - `e.preventDefault()` called on keydown for direction and space keys
  - **Acceptance**: Keyboard input behavior is identical to pre-mobile version (no changes to this file)

**Checkpoint**: User Story 7 is fully functional — desktop keyboard gameplay is not regressed.

---

## Phase 10: User Story 8 — Graceful Orientation Change (Priority: P3)

**Goal**: Screen rotation preserves game state and adjusts layout without breaking.

**Independent Test**: Rotate a mobile device during gameplay — the board rescales, the layout adapts, and the game continues from its current state without resetting.

### Implementation for User Story 8

- [ ] T023 [US8] Verify orientation change handling:
  - `useViewport` hook triggers re-render on orientation change (via debounced resize handler)
  - Game.tsx layout class switches between portrait/landscape based on `useViewport.isLandscape`
  - Game board rescales via CSS `aspect-ratio: 1/1` (no JavaScript needed for resize)
  - Game state (snake, score, status) is preserved in Redux — no reset on orientation change
  - **Acceptance**: Orientation changes are handled gracefully, game state persists, layout adapts

**Checkpoint**: User Story 8 is fully functional — orientation changes are handled gracefully.

---

## Phase 11: Accessibility & Polish

**Purpose**: Cross-cutting improvements that affect all user stories.

- [ ] T024 [P] Add visible focus states to all new interactive elements:
  - TouchControls buttons: `:focus-visible` outline (3px solid #fdcb6e, 3px offset)
  - ActionBar buttons: `:focus-visible` outline matching existing GameControls styles
  - **Acceptance**: All new buttons have visible focus states matching existing patterns

- [ ] T025 [P] Review and confirm color contrast ratios:
  - TouchControl buttons: white text on `rgba(255, 255, 255, 0.1)` background — verify meets WCAG AA (4.5:1)
  - ActionBar buttons: verify contrast ratios
  - Overlay text: `#e74c3c` on `rgba(0, 0, 0, 0.75)` — verify contrast
  - **Acceptance**: All text meets minimum 4.5:1 contrast ratio (WCAG AA)

- [ ] T026 Update mobile control instructions:
  - Replace keyboard-specific instructions in `src/pages/Game.tsx` with mobile-appropriate text
  - Show "Use on-screen buttons to control the snake" for mobile
  - Keep keyboard instructions for desktop (`!isMobile`)
  - **Acceptance**: Instructions match the input method available on each device

- [ ] T027 [P] Remove desktop-only instructions on mobile:
  - Ensure `<div className={styles.instructions}>` with keyboard instructions is hidden on mobile
  - Use `display: none` below 768px breakpoint in `Game.module.css`
  - **Acceptance**: Keyboard instructions hidden on mobile, visible on desktop

**Checkpoint**: Accessibility and polish complete — all new elements are keyboard-accessible, have visible focus states, and meet contrast requirements.

---

## Phase 12: Testing & Validation

**Purpose**: Comprehensive testing across all user stories and breakpoints.

### Integration Tests

- [ ] T028 [Integration] Add touch control integration test to `tests/integration/gameFlow.test.tsx`:
  - Start game → tap touch button → verify snake changes direction
  - Tap rapid sequence of direction buttons → verify last valid direction wins
  - Tap pause → verify game pauses → tap resume → verify game continues
  - Tap restart → verify game resets
  - **Acceptance**: Touch flow passes in integration tests

### Manual QA Checklist

- [ ] T029 [Manual] Execute all 10 scenarios from `quickstart.md`:
  1. Touch controls render on mobile viewport
  2. Responsive board sizing at 375px, 768px, 1440px
  3. Landscape layout switch
  4. Touch control direction dispatch
  5. Action bar visibility and functionality
  6. Keyboard controls still work (desktop)
  7. Overlay readability on 320px
  8. Orientation change state preservation
  9. No horizontal scrolling at any viewport
  10. Full game session on mobile (end-to-end)
  - **Acceptance**: All 10 scenarios pass

---

## Phase 13: Documentation

**Purpose**: Update project documentation to reflect mobile UI capabilities.

- [ ] T030 Update `README.md`:
  - Add "Mobile Controls" section documenting touch D-pad buttons
  - Add "Responsive Design" section documenting supported breakpoints (320px minimum, portrait-first, landscape side-by-side)
  - Add "Testing" section with manual QA instructions (DevTools device emulation, quickstart.md scenarios)
  - Update "Controls" section to include mobile touch control instructions
  - **Acceptance**: README documents mobile controls, responsive behavior, and testing instructions

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Description | Depends On |
|-------|-------------|------------|
| 1 | Setup | None |
| 2 | Foundational: useViewport hook | Phase 1 |
| 3 | US1: TouchControls | Phase 2 |
| 4 | US2: Responsive Layout | Phase 2 |
| 5 | US3: Responsive Board | Phase 2 |
| 6 | US4: Action Bar | Phase 2 |
| 7 | US5: Score/Status Legibility | Phase 6 (ActionBar) |
| 8 | US6: Mobile Overlays | Phase 5 (GameBoard) |
| 9 | US7: Desktop Regression Test | None (verification only) |
| 10 | US8: Orientation Change | Phases 4, 5 (layout + board) |
| 11 | Accessibility & Polish | All implementation phases |
| 12 | Testing & Validation | All implementation phases |
| 13 | Documentation | All implementation phases |

### Parallel Opportunities

- **T003, T004, T005** (US1 tests + component + CSS) can start in parallel after Phase 2
- **T008, T009** (US2 layout CSS + Game.tsx) can run in parallel after Phase 2
- **T010, T011** (US3 board CSS + GameBoard.tsx) can run in parallel after Phase 2
- **T013, T014** (US4 ActionBar CSS + component) can run in parallel after Phase 2
- **T016, T017** (US5 Scoreboard CSS + ActionBar sizing) can run in parallel after Phase 6
- **T018, T019** (US6 overlay CSS + verification) can run in parallel after Phase 5
- **T020, T021** (US7 regression tests) can run in parallel after Phase 2
- **T024, T025, T027** (Phase 11 polish) can run in parallel after all implementation phases
- **T028, T029** (Phase 12 testing) can run in parallel after all implementation phases

### Suggested MVP Scope

**MVP = Phases 1-5**: Touch controls (US1) + Responsive layout (US2) + Responsive board (US3)
- A mobile player can control the snake using touch buttons on a responsive board
- Desktop keyboard gameplay is unchanged
- Basic layout works on all screen sizes

**Incremental delivery after MVP**:
1. Add Action Bar (Phase 6) → Complete mobile control set
2. Improve legibility (Phase 7) + overlays (Phase 8) → Polish
3. Orientation handling (Phase 10) → Tablet support
4. Accessibility + testing + docs (Phases 11-13) → Production ready

---

## Task Summary

| Phase | Tasks | User Stories |
|-------|-------|--------------|
| 1. Setup | 1 | — |
| 2. Foundational | 1 | — |
| 3. US1: Touch Controls | 4 | US1 |
| 4. US2: Responsive Layout | 3 | US2 |
| 5. US3: Responsive Board | 2 | US3 |
| 6. US4: Action Bar | 3 | US4 |
| 7. US5: Score/Status Legibility | 2 | US5 |
| 8. US6: Mobile Overlays | 2 | US6 |
| 9. US7: Desktop Regression | 3 | US7 |
| 10. US8: Orientation Change | 1 | US8 |
| 11. Accessibility & Polish | 4 | All |
| 12. Testing & Validation | 2 | All |
| 13. Documentation | 1 | All |
| **Total** | **29 tasks** | **8 user stories** |

---

## Execution Order Summary

```
Phase 1 (Setup)
  └→ Phase 2 (Foundational: useViewport)
       ├→ Phase 3 (US1: TouchControls) ─────────────────────────┐
       ├→ Phase 4 (US2: Responsive Layout) ─────────────────────┤
       ├→ Phase 5 (US3: Responsive Board) ──────────────────────┼──→ Phase 11 (Polish)
       ├→ Phase 6 (US4: Action Bar) ────────────────────────────┤      Phase 12 (Testing)
       ├→ Phase 7 (US5: Legibility) ────────────────────────────┤      Phase 13 (Docs)
       ├→ Phase 8 (US6: Overlays) ──────────────────────────────┤
       ├→ Phase 9 (US7: Desktop Regression) ────────────────────┘
       └→ Phase 10 (US8: Orientation) ──────────────────────────┘
```

**Critical path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 11 → Phase 12 → Phase 13

**Parallel execution**: Phases 3, 4, 5, 6 can all start after Phase 2 completes (if team capacity allows).
