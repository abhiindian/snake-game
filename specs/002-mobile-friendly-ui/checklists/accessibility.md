# Specification Quality Checklist: Accessibility & Cross-Platform

**Purpose**: Validate accessibility and cross-platform requirements for completeness, clarity, and consistency
**Created**: 2026-07-05
**Feature**: [spec.md](./spec.md)

## Keyboard Accessibility

- [ ] CHK001 - Are keyboard accessibility requirements defined for all NEW touch controls (not just existing keyboard inputs)? [Completeness, Spec §NFR-006]
- [ ] CHK002 - Is the focus order defined for touch control buttons (Tab navigation sequence)? [Clarity, Gap]
- [ ] CHK003 - Are focus state requirements quantified (e.g., outline width, color, offset)? [Clarity, Spec §NFR-006, FR-012]
- [ ] CHK004 - Are keyboard shortcuts for touch control actions defined (e.g., which key maps to "Up" button)? [Coverage, Gap]
- [ ] CHK005 - Is the "keyboard-first" constitution principle explicitly reconciled with touch-first mobile UI? [Consistency, Spec §Constitution IV, NFR-005]

## Screen Reader Support

- [ ] CHK006 - Are ARIA labels defined for all touch control buttons (not just "aria-label" mentioned)? [Completeness, Spec §NFR-006]
- [ ] CHK007 - Are screen reader announcements defined for game state changes (pause, resume, game over)? [Coverage, Gap]
- [ ] CHK008 - Is the live region scope defined (which elements have `aria-live` attributes)? [Clarity, Gap]
- [ ] CHK009 - Are overlay contents fully described for screen readers (not just visible text)? [Completeness, Gap]

## Touch Accessibility

- [ ] CHK010 - Is the 44x44px minimum tappable area specified for ALL interactive elements (not just directional buttons)? [Completeness, Spec §FR-005]
- [ ] CHK011 - Are requirements defined for users with motor impairments (e.g., reduced touch sensitivity)? [Coverage, Gap]
- [ ] CHK012 - Is the touch button hold behavior consistent with the edge case definition? [Consistency, Spec §Edge Cases, FR-004]
- [ ] CHK013 - Are visual feedback requirements sufficient for users with color blindness (not just color change)? [Clarity, Spec §FR-012, Constitution VII]

## Desktop Regression Prevention

- [ ] CHK014 - Is "identically to the pre-existing behavior" quantified (e.g., key bindings, timing, game state)? [Clarity, Spec §FR-006, SC-004]
- [ ] CHK015 - Are requirements defined for mixed input scenarios (e.g., game started on desktop, continued on tablet)? [Coverage, Gap]
- [ ] CHK016 - Is the keyboard shortcut for pause/resume explicitly preserved (spacebar)? [Completeness, Spec §FR-006]
- [ ] CHK017 - Are WASD key bindings explicitly preserved? [Completeness, Spec §FR-006]

## Cross-Platform Browser Support

- [ ] CHK018 - Are specific browser versions listed (iOS Safari 15+, Chrome Android XX+, Firefox Android XX+)? [Clarity, Spec §Assumptions]
- [ ] CHK019 - Are CSS feature requirements quantified (e.g., aspect-ratio, backdrop-filter, media queries)? [Clarity, Gap]
- [ ] CHK020 - Are requirements defined for browsers with limited CSS support (fallback behavior)? [Coverage, Gap]
- [ ] CHK021 - Is the "no new dependencies" constraint explicitly reflected in requirements? [Completeness, Spec §Assumptions]

## Orientation & Rotation

- [ ] CHK022 - Are orientation change requirements defined for tablets (larger devices with multiple orientations)? [Coverage, Gap]
- [ ] CHK023 - Is the "graceful" orientation change quantified (e.g., no animation delay, instant resize)? [Clarity, Spec §FR-011, US-8]
- [ ] CHK024 - Are orientation change requirements consistent with state preservation (FR-011)? [Consistency, Spec §FR-011]
- [ ] CHK025 - Is the orientation change event handler defined (e.g., resize vs. orientationchange)? [Clarity, Gap]

## Edge Case Accessibility

- [ ] CHK026 - Are browser zoom requirements defined (e.g., 200% zoom, per FR-013 clarification)? [Coverage, Spec §Edge Cases]
- [ ] CHK027 - Are requirements defined for users with large system font sizes (e.g., iOS dynamic type)? [Coverage, Gap]
- [ ] CHK028 - Are low-bandwidth/network conditions addressed (e.g., image loading, animation performance)? [Coverage, Gap]
- [ ] CHK029 - Are requirements defined for devices with notches/safe areas (e.g., iPhone X+)? [Coverage, Gap]

## Consistency & Completeness

- [ ] CHK030 - Do accessibility requirements align with the Constitution Principle VII (accessibility)? [Consistency, Spec §Constitution VII]
- [ ] CHK031 - Are accessibility requirements consistent with the "keyboard-first" principle (Constitution IV)? [Consistency, Spec §Constitution IV]
- [ ] CHK032 - Are cross-platform requirements consistent with the "no new dependencies" constraint? [Consistency, Spec §Assumptions]
- [ ] CHK033 - Are all success criteria (SC-001 through SC-006) traced to specific requirements? [Traceability, Spec §SC-001 to SC-006]

## Notes

- Focus areas: keyboard accessibility, screen reader support, touch accessibility, desktop regression, cross-platform, edge cases
- Depth: Standard
- Audience: Reviewer (PR)
- All items test the quality of requirements, not implementation behavior
