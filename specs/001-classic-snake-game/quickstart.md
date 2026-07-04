# Quickstart Guide: Classic Snake Game

**Feature**: [001-classic-snake-game](/Users/abhishek/ProofOfConcepts/snake-game/specs/001-classic-snake-game/plan.md)

## Overview

This guide provides instructions for validating the implementation of the Classic Snake Game. Follow these steps to ensure all core features are working as expected.

## Prerequisites

- [x] Node.js (LTS recommended)
- [x] npm or yarn

## Setup and Installation

1. **Clone the repository** (if not already present).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Validation Scenarios

### 1. Initial Launch (MVP)
**Goal**: Verify the landing page and game start functionality.

- **Action**: Open `http://localhost:5173` (or the URL provided by Vite).
- **Expected Outcome**: 
    - The landing screen is visible with a "Start Game" button.
    - Clicking "Start Game" transitions to the game board.
    - The snake starts moving automatically in a default direction.

### 2. Gameplay Mechanics (Core Loop)
**Goal**: Verify movement, food consumption, and growth.

- **Action**: 
    1. Use arrow keys or `WASD` to change direction.
    2. Navigate the snake head into a food cell.
- **Expected Outcome**:
    - The snake changes direction smoothly according to input.
    - Upon eating food, the score increments.
    - The snake's body grows by one segment.

### 3. Failure States (Boundaries)
**Goal**: Verify game termination on collision.

- **Action**: 
    1. Intentionally steer the snake into a wall (grid boundary).
    2. Or, steer the snake into its own body.
- **Expected Outcome**:
    - The game immediately stops moving.
    - A "Game Over" state is displayed with the final score.

### 4. Game Controls (UX/UI)
**Goal**: Verify pause and restart capabilities.

- **Action**: 
    1. While playing, trigger the "Pause" action (e.g., via a button or key).
    2. Trigger "Restart" from the Game Over screen.
- **Expected Outcome**:
    - The game stops movement when paused and resumes when requested.
    - Restarting resets the snake, score, and position to initial values.

## Troubleshooting

| Issue | Possible Cause | Solution |
|--------|--------------|----------|
| No movement on start | Game status is not 'running' or interval not started. | Check Redux state and game loop hook. |
| Input lag/unresponsiveness | Heavy re-renders or blocked main thread. | Check component memoization and grid rendering efficiency. |
| Snake turns 180° instantly | Lack of direction buffering/validation. | Ensure `nextDirection` is used and validated against current `direction`. |
