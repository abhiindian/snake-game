# Tasks: Classic Snake Game

**Input**: Design documents from `/specs/001-classic-snake-game/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for core logic and component testing are required as per specification.

**Organization**: Tasks are grouped by implementation phase to enable incremental development and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vite + React + TypeScript project in `src/`
- [ ] T002 Install dependencies: `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `vitest`, `@testing-library/react`
- [ ] T003 [P] Configure linting (ESLint) and formatting (Prettier)
- [ ] T004 Create directory structure: `app/`, `components/`, `features/game/`, `features/score/`, `pages/`, `routes/`, `store/`, `utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Setup React Router configuration in `src/routes/` with `/` and `/game` routes
- [ ] T006 Configure Redux Toolkit store in `src/app/` and create the initial `gameSlice` in `src/store/`
- [ ] T007 Define core game constants (grid size 40x40, initial speed) in `src/utils/constants.ts`
- [ ] T008 Implement core game utility functions in `src/utils/gameEngine.ts` (move, collision detection, food spawning logic)
- [ ] T009 [P] Write unit tests for `gameEngine.ts` utilities using Vitest

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Start (Priority: P1) 🎯 MVP

**Goal**: Implement landing page and basic game initialization.

**Independent Test**: Navigate to `/`, click "Start Game", verify redirection to `/game` and game start.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create `Home` page component in `src/pages/Home.tsx`
- [ ] T011 [US1] Implement "Start Game" action in `Home` page to navigate to `/game`
- [ ] T012 [US1] Create `Game` page component in `src/pages/Game.tsx`
- [ ] T013 [US1] Implement Redux action to initialize game state (reset snake, food, score)

---

## Phase 4: User Story 2 & 3 - Gameplay (Priority: P1)

**Goal**: Implement continuous movement, controls, and growth.

**Independent Test**: Play the game using keyboard; verify snake moves, eats food, and grows.

### Implementation for User Story 2 & 3

- [ ] T014 [P] [US2] Implement keyboard event listener in `src/features/game/useKeyboardInput.ts`
- [ ] T015 [US2] Update `gameSlice` to handle direction changes and prevent 180° reversal
- [ ] T016 [US3] Implement game loop/tick orchestration using a custom hook in `src/features/game/useGameLoop.ts`
- [ ] T017 [US3] Implement board rendering in `src/features/game/components/GameBoard.tsx` using CSS Grid
- [ ] T018 [US3] Implement food rendering and score increment logic in `src/features/game/components/Food.tsx`

---

## Phase 5: User Story 4 - Failure State (Priority: P2)

**Goal**: Implement game over detection and restart.

**Independent Test**: Intentionally hit a wall/body; verify "Game Over" screen and restart works.

### Implementation for User Story 4

- [ ] T019 [US4] Update `gameSlice` to handle collision detection and transition to `gameOver` status
- [ ] T020 [US4] Create Game Over overlay/screen in `src/features/game/components/GameOverOverlay.tsx`
- [ ] T021 [US4] Implement "Restart" functionality to trigger `restartGame` action

---

## Phase 6: User Story 5 - UX Enhancements (Priority: P3)

**Goal**: Implement pause/resume and polished UI.

**Independent Test**: Pause the game during play; verify it stops and can be resumed.

### Implementation for User Story 5

- [ ] T022 [US5] Implement pause/resume logic in `gameSlice` and `useGameLoop.ts`
- [ ] T023 [US5] Add Pause/Resume UI controls in `src/features/game/components/GameControls.tsx`
- [ ] T024 [US5] Implement Scoreboard component in `src/features/score/components/Scoreboard.tsx`

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T025 Implement responsive styling using CSS Modules
- [ ] T026 Implement handling for window focus loss (e.g., automatically pausing the game)
- [ ] T027 Add accessibility features (aria labels, keyboard focus states)
- [ ] T028 Write integration tests for the full game flow in `tests/integration/`
- [ ] T029 Finalize `README.md` with setup, controls, and architecture documentation
- [ ] T027 Write integration tests for the full game flow in `tests/integration/`
- [ ] T028 Finalize `README.md` with setup, controls, and architecture documentation
