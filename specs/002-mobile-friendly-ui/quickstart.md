# Quickstart: Mobile-Friendly UI Validation

**Feature**: 002-mobile-friendly-ui
**Date**: 2026-07-05

## Overview

This guide provides runnable validation scenarios to verify the Mobile-Friendly UI feature works end-to-end. Follow each scenario to confirm the feature meets its requirements.

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed: `npm install`
- Development server running: `npm run dev`

---

## Scenario 1: Touch Controls Render on Mobile Viewport

**Purpose**: Verify `TouchControls` component renders correctly on mobile-sized viewports.

**Steps**:
1. Start dev server: `npm run dev`
2. Open browser DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
4. Select a mobile device (e.g., iPhone 14, Samsung Galaxy S22)
5. Navigate to `/game`
6. Start a game

**Expected**:
- Touch control buttons (↑, ↓, ←, →) are visible below the game board
- Buttons have minimum 44x44px tappable area
- Buttons show visual feedback when pressed (color change or scale)
- Buttons are keyboard-focusable (press Tab to navigate)

**Validation**:
```bash
# Run unit tests for TouchControls
npm test -- TouchControls
```

**Related contracts**: `contracts/internal-interfaces.md` — TouchControls Component Contract

---

## Scenario 2: Responsive Board Sizing

**Purpose**: Verify the game board scales proportionally on different screen sizes.

**Steps**:
1. Open dev server in a resizable browser window
2. Navigate to `/game` and start a game
3. Resize the browser window to 375px width
4. Resize to 768px width
5. Resize to 1440px width

**Expected**:
- Board maintains a perfect 1:1 square aspect ratio at all widths
- Grid cells remain uniform (no stretching or distortion)
- No horizontal scrolling at any width
- Board fits within viewport without clipping

**Validation**:
```bash
# Visual check — no automated test for this
# Manually verify at each width
```

**Related contracts**: `contracts/internal-interfaces.md` — GameBoard Component Contract (Modified)

---

## Scenario 3: Landscape Layout Switch

**Purpose**: Verify layout changes to side-by-side in landscape orientation.

**Steps**:
1. Open dev server
2. Toggle device toolbar to landscape orientation (e.g., iPad, Pixel 7 Pro landscape)
3. Navigate to `/game` and start a game

**Expected**:
- Game board appears on the left side
- Touch controls appear on the right side
- Action bar spans the full width above both
- No elements overflow or get clipped

**Validation**:
```bash
# Run integration tests
npm test -- gameFlow
```

**Related contracts**: `contracts/internal-interfaces.md` — Game Page Component Contract (Modified)

---

## Scenario 4: Touch Control Direction Dispatch

**Purpose**: Verify touch controls dispatch correct direction changes.

**Steps**:
1. Start dev server
2. Run the touch control tests:
```bash
npm test -- TouchControls.test.tsx
```

**Expected**:
- Tapping "Up" dispatches `{ x: 0, y: -1 }`
- Tapping "Down" dispatches `{ x: 0, y: 1 }`
- Tapping "Left" dispatches `{ x: -1, y: 0 }`
- Tapping "Right" dispatches `{ x: 1, y: 0 }`
- 180° reversal is prevented (same as keyboard behavior)
- `e.preventDefault()` is called on touch events

**Validation**:
```bash
npm test -- TouchControls.test.tsx --verbose
```

**Related contracts**: `contracts/internal-interfaces.md` — TouchControls Component Contract

---

## Scenario 5: Action Bar Visibility and Functionality

**Purpose**: Verify action bar renders and responds to taps on mobile.

**Steps**:
1. Open dev server
2. Toggle device toolbar to mobile portrait (e.g., iPhone 14)
3. Navigate to `/game` and start a game
4. Tap the pause button
5. Tap the restart button
6. Tap the home button

**Expected**:
- Action bar appears above the game board
- Score is clearly visible and updates
- Status text shows correct state (Playing, Paused, Game Over)
- Pause button toggles to Resume when game is paused
- Restart button resets the game
- Home button navigates to `/`

**Validation**:
```bash
# Check for lint errors in ActionBar
npm run lint -- src/features/game/components/ActionBar.tsx
```

**Related contracts**: `contracts/internal-interfaces.md` — ActionBar Component Contract

---

## Scenario 6: Keyboard Controls Still Work

**Purpose**: Verify no regression in desktop keyboard gameplay.

**Steps**:
1. Open dev server in a desktop browser (no device toolbar)
2. Navigate to `/game` and start a game
3. Use arrow keys to change direction
4. Use WASD keys to change direction
5. Press spacebar to pause/resume

**Expected**:
- All keyboard inputs work identically to pre-mobile version
- No visual or behavioral changes to desktop experience
- No touch controls visible on desktop

**Validation**:
```bash
# Run existing keyboard-based tests
npm test -- gameEngine.test.ts
npm test -- gameSlice.test.ts
```

**Related contracts**: `contracts/internal-interfaces.md` — Shared Input Contract

---

## Scenario 7: Overlay Readability on Small Screens

**Purpose**: Verify pause and game-over overlays are readable on 320px viewports.

**Steps**:
1. Open dev server
2. Toggle device toolbar to 320px width
3. Navigate to `/game` and start a game
4. Let the game end (or pause it)
5. Observe the overlay

**Expected**:
- Overlay text is clearly readable (minimum 14px font size)
- "Restart" button meets 44x44px tappable area
- Overlay doesn't overflow the viewport
- Background blur effect is visible

**Validation**:
```bash
# Visual check — no automated test
# Manually verify font sizes and button dimensions
```

**Related contracts**: `contracts/internal-interfaces.md` — GameBoard Component Contract (Modified)

---

## Scenario 8: Orientation Change State Preservation

**Purpose**: Verify game state persists through orientation changes.

**Steps**:
1. Open dev server
2. Toggle device toolbar to portrait orientation
3. Navigate to `/game` and start a game
4. Play for a few seconds (score should increase)
5. Rotate device to landscape
6. Observe the game state

**Expected**:
- Game continues from the same position
- Score is preserved
- Snake position is preserved
- Board rescales smoothly
- No visible game reset or interruption

**Validation**:
```bash
# Manual test — no automated orientation change simulation
# Use browser device toolbar rotation button
```

**Related contracts**: `contracts/internal-interfaces.md` — useViewport Hook Contract

---

## Scenario 9: No Horizontal Scrolling

**Purpose**: Verify no horizontal scroll occurs at any supported viewport.

**Steps**:
1. Open dev server
2. Test at each viewport width: 320px, 375px, 414px, 768px, 1024px
3. Test in both portrait and landscape at 768px and 1024px
4. Try to scroll horizontally with mouse/finger

**Expected**:
- No horizontal scrollbar appears at any viewport
- All elements remain within the visible viewport
- Touch controls don't cause overflow

**Validation**:
```bash
# Check the viewport meta tag in public/index.html
grep "width=device-width" public/index.html
# Expected: width=device-width, initial-scale=1.0, viewport-fit=cover
```

**Related contracts**: `contracts/internal-interfaces.md` — Game Page Component Contract (Modified)

---

## Scenario 10: Full Game Session on Mobile

**Purpose**: End-to-end validation of completing a game on mobile.

**Steps**:
1. Open dev server
2. Toggle device toolbar to mobile portrait (e.g., iPhone 14)
3. Navigate to `/game`
4. Tap "Start Game" (or game auto-starts)
5. Use touch controls to play for 30 seconds
6. Tap pause button
7. Tap resume button
8. Let game end naturally (collision)
9. Tap restart button
10. Tap home button

**Expected**:
- All interactions work with touch only (no keyboard)
- Score updates correctly
- Pause/resume toggles correctly
- Game over overlay shows final score
- Restart resets the game
- Home navigates to `/`
- No layout breaks or overflow at any point

**Validation**:
```bash
# Run all tests to ensure no regressions
npm test
```

**Related contracts**: `contracts/internal-interfaces.md` — All component contracts
