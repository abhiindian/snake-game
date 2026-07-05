# Specification Quality Checklist: Responsive Layout

**Purpose**: Validate responsive layout requirements for completeness, clarity, and consistency
**Created**: 2026-07-05
**Feature**: [spec.md](./spec.md)

## Layout Breakpoints & Sizing

- [ ] CHK001 - Are specific breakpoint values (in px or rem) defined for phone/tablet/desktop transitions? [Clarity, Spec §FR-001, FR-010]
- [ ] CHK002 - Is the 320px minimum viewport explicitly referenced in all size-related requirements? [Completeness, Spec §FR-008, NFR-003]
- [ ] CHK003 - Are layout requirements defined for the gap between 320px and 768px (e.g., 375px, 414px)? [Coverage, Gap]
- [ ] CHK004 - Is "responsive layout techniques" in FR-001 quantified (e.g., CSS media queries, flexbox, grid)? [Clarity, Spec §FR-001]
- [ ] CHK005 - Are horizontal scrolling prevention requirements defined for all interactive elements (not just the board)? [Completeness, Gap]
- [ ] CHK006 - Is the minimum supported browser version specified (needed for CSS feature support)? [Gap]

## Board Responsiveness

- [ ] CHK007 - Is the 1:1 aspect ratio requirement quantified with a specific CSS property or technique? [Clarity, Spec §FR-003]
- [ ] CHK008 - Are grid cell visibility requirements defined for scaled-down boards (e.g., minimum cell size)? [Completeness, Gap]
- [ ] CHK009 - Is the "40x40 grid unchanged" assumption reflected in FR-003 or a dedicated requirement? [Completeness, Gap]
- [ ] CHK010 - Are requirements defined for pixelation/blur when scaling CSS grid cells? [Clarity, Spec §US-3]
- [ ] CHK011 - Is the board's relationship to viewport edges quantified (e.g., max-width, padding)? [Clarity, Gap]

## Orientation Handling

- [ ] CHK012 - Is the landscape layout switch quantified with a specific breakpoint (width AND orientation)? [Clarity, Spec §FR-010]
- [ ] CHK013 - Are requirements defined for orientation changes that happen DURING gameplay (not just initial load)? [Coverage, Gap]
- [ ] CHK014 - Is the state preservation requirement during orientation change explicitly defined? [Completeness, Spec §FR-011, US-8]
- [ ] CHK015 - Are landscape layout requirements consistent with the side-by-side clarification? [Consistency, Spec §FR-010, Clarifications]
- [ ] CHK016 - Is the portrait-to-landscape transition quantified (e.g., should it be instant or animated)? [Clarity, Gap]

## Action Bar & HUD

- [ ] CHK017 - Is the "top action bar" positioning quantified (e.g., above board, full-width, padding)? [Clarity, Spec §FR-007, US-4]
- [ ] CHK018 - Are all action bar elements (score, status, buttons) listed with their layout order? [Completeness, Gap]
- [ ] CHK019 - Is the action bar visibility defined for all game states (idle, running, paused, gameOver)? [Coverage, Gap]
- [ ] CHK020 - Are action bar button sizes quantified (not just "large" or "easy-to-tap")? [Clarity, Spec §FR-007]

## Score & Status Legibility

- [ ] CHK021 - Is the minimum font size for score/status text quantified (not just "legible")? [Clarity, Spec §FR-008, NFR-003]
- [ ] CHK022 - Are color contrast requirements defined (not just "legible")? [Clarity, Spec §NFR-003]
- [ ] CHK023 - Is the score update animation/transition defined (instant vs. animated)? [Clarity, Gap]
- [ ] CHK024 - Are status text requirements defined for all four states (idle, running, paused, gameOver)? [Completeness, Gap]

## Overlay Responsiveness

- [ ] CHK025 - Are overlay dimensions quantified (e.g., percentage of viewport, max-width)? [Clarity, Spec §FR-009]
- [ ] CHK026 - Are overlay background opacity/transparency requirements defined? [Clarity, Spec §FR-009]
- [ ] CHK027 - Are overlay button sizes quantified (not just "tappable")? [Clarity, Spec §FR-009]
- [ ] CHK028 - Is overlay z-index layering defined relative to other UI elements? [Clarity, Gap]

## Consistency & Completeness

- [ ] CHK029 - Do responsive layout requirements align with the "no horizontal scrolling" constraint (FR-002)? [Consistency, Spec §FR-002]
- [ ] CHK030 - Are responsive requirements consistent with accessibility requirements (NFR-006)? [Consistency, Spec §NFR-006]
- [ ] CHK031 - Do layout requirements align with the Constitution Principle I (separation of engine from UI)? [Consistency, Spec §Constitution I]
- [ ] CHK032 - Are responsive requirements consistent with the "no new dependencies" constraint? [Consistency, Spec §Assumptions]

## Notes

- Focus areas: breakpoints, board sizing, orientation handling, action bar, overlays
- Depth: Standard
- Audience: Reviewer (PR)
- All items test the quality of requirements, not implementation behavior
