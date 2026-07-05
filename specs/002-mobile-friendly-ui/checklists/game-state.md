# Specification Quality Checklist: Game State & Overlays

**Purpose**: Validate game state and overlay requirements for completeness, clarity, and consistency
**Created**: 2026-07-05
**Feature**: [spec.md](./spec.md)

## Game State Coverage

- [ ] CHK001 - Are all four game states (idle, running, paused, gameOver) explicitly addressed in mobile UI requirements? [Completeness, Spec §US-5, US-6, FR-008]
- [ ] CHK002 - Is the transition from idle to running defined for mobile (how does the game start without keyboard)? [Gap]
- [ ] CHK003 - Are UI requirements defined for each state transition (e.g., running → paused → running)? [Completeness, Gap]
- [ ] CHK004 - Is the "idle" state UI defined for mobile (should the game auto-start or require a tap)? [Clarity, Gap]

## Pause/Resume Behavior

- [ ] CHK005 - Are pause/resume button requirements defined for all screen sizes (not just mobile)? [Completeness, Spec §FR-007]
- [ ] CHK006 - Is the pause/resume toggle behavior consistent with keyboard (spacebar) behavior? [Consistency, Spec §FR-006, FR-007]
- [ ] CHK007 - Are pause/resume requirements defined for overlay vs. in-game button interactions? [Clarity, Gap]
- [ ] CHK008 - Is the pause overlay content quantified (what text/buttons are shown)? [Clarity, Spec §US-6, FR-009]

## Game Over State

- [ ] CHK009 - Is the game over overlay content explicitly defined (final score, restart button, other actions)? [Completeness, Spec §US-6, FR-009]
- [ ] CHK010 - Are game over overlay button requirements quantified (size, position, labels)? [Clarity, Spec §FR-009]
- [ ] CHK011 - Is the game over state accessible to screen readers (e.g., `aria-live="assertive"`)? [Coverage, Gap]
- [ ] CHK012 - Are game over requirements consistent with the existing GameBoard overlay implementation? [Consistency, Spec §GameBoard.tsx]

## Restart Behavior

- [ ] CHK013 - Are restart requirements defined for all trigger points (game over, in-game restart button)? [Completeness, Gap]
- [ ] CHK014 - Is the restart behavior quantified (immediate reset vs. confirmation dialog)? [Clarity, Gap]
- [ ] CHK015 - Are restart requirements consistent with the existing restart flow (dispatches restartGame action)? [Consistency, Spec §Game.tsx]
- [ ] CHK016 - Is the restart button placement consistent across pause overlay and game over overlay? [Consistency, Gap]

## Overlay Design

- [ ] CHK017 - Are overlay dimensions quantified (percentage of viewport, fixed size, responsive)? [Clarity, Spec §FR-009]
- [ ] CHK018 - Are overlay background requirements defined (opacity, blur, color)? [Clarity, Spec §GameBoard.module.css]
- [ ] CHK019 - Are overlay z-index requirements defined (layering relative to other UI)? [Clarity, Gap]
- [ ] CHK020 - Are overlay text requirements defined (font sizes, colors, contrast)? [Completeness, Gap]
- [ ] CHK021 - Are overlay button requirements defined (sizes, spacing, labels)? [Completeness, Gap]
- [ ] CHK022 - Is the overlay component boundary defined (does it replace the existing GameBoard overlay)? [Clarity, Gap]

## Score & Status Display

- [ ] CHK023 - Are score display requirements defined for all game states (idle, running, paused, gameOver)? [Completeness, Gap]
- [ ] CHK024 - Is the score format quantified (e.g., "Score: 120" vs. just "120")? [Clarity, Gap]
- [ ] CHK025 - Are status text requirements defined for all four states (idle, running, paused, gameOver)? [Completeness, Spec §US-5]
- [ ] CHK026 - Is the status icon/symbol defined for each state (e.g., ▶ for playing, ⏸ for paused)? [Clarity, Gap]
- [ ] CHK027 - Are score and status placement requirements defined (position relative to board, controls)? [Clarity, Gap]

## State Preservation

- [ ] CHK028 - Is the game state preservation requirement during orientation change quantified (what state is preserved)? [Completeness, Spec §FR-011, US-8]
- [ ] CHK029 - Are requirements defined for state preservation during browser focus loss (document.hidden)? [Coverage, Gap]
- [ ] CHK030 - Is the state preservation requirement consistent with the existing visibility change handler? [Consistency, Spec §useGameLoop.ts]

## Consistency & Completeness

- [ ] CHK031 - Do overlay requirements align with the "mobile-friendly" theme (touch targets, readability)? [Consistency, Spec §FR-007, FR-009]
- [ ] CHK032 - Are state requirements consistent with the Constitution Principle II (deterministic gameplay)? [Consistency, Spec §Constitution II]
- [ ] CHK033 - Are overlay requirements consistent with accessibility requirements (NFR-006)? [Consistency, Spec §NFR-006]
- [ ] CHK034 - Are all success criteria (SC-001) traced to specific game state requirements? [Traceability, Spec §SC-001]

## Notes

- Focus areas: game state coverage, pause/resume, game over, restart, overlays, score/status, state preservation
- Depth: Standard
- Audience: Reviewer (PR)
- All items test the quality of requirements, not implementation behavior
