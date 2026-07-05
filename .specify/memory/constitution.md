# Snake Game Constitution
<!-- Project constitution for the browser-based Snake Game -->

## Core Principles

### I. Architecture First
Use a feature-based folder structure. Keep game engine logic strictly separate from UI rendering layers. Ensure Redux state remains serializable, predictable, and minimal, separating presentational components from stateful orchestration.

### II. Deterministic Gameplay
Snake movement, collision detection, food spawning, score updates, and game lifecycle (pause/resume/restart) MUST be deterministic and testable. No hidden side effects are allowed inside React components; time-based loop logic MUST be centralized.

### III. Redux Discipline
Use Redux Toolkit for store, slices, and actions. Store only essential game state in Redux; avoid storing derived UI values. Use selectors to compute score, speed, game status, and board rendering inputs.

### IV. Routing and UX
Use React Router for app-level navigation (Home, Game, Results). Keyboard-first gameplay is mandatory. The UI MUST clearly communicate score, current state, controls, and restart options.

### V. Quality and Maintainability
Prioritize TypeScript or clean JavaScript with strict linting. Add unit tests for reducers, selectors, and core game utility functions. Keep components small, reusable, and accessible; favor readability over cleverness.

### VI. Performance
Prevent unnecessary re-renders during game ticks. Ensure board rendering is highly efficient for repeated updates. Minimize dependencies to the core stack: React, Vite, Redux Toolkit, and React Router.

### VII. Accessibility
Ensure visible focus states and provide clear instructions for controls. Do not rely on color alone to indicate game state; support keyboard interaction for all major actions.

### VIII. Delivery Standards
The final application must run locally via Vite dev server with a clean, error-free build. Include a comprehensive `README.md` covering setup, controls, architecture summary, and future enhancements.

## Technical Standards & Performance

The project follows a strict separation of concerns between the game engine and the React UI. Performance is prioritized by minimizing re-renders during high-frequency game ticks and keeping the dependency tree lightweight.

## UX, Accessibility, and Delivery

The user experience is centered around keyboard-driven gameplay and clear visual feedback. Accessibility is a core requirement, ensuring that the game state is communicated through more than just color and that all interactions are keyboard-accessible.

## Governance
<!-- Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

All development MUST align with these principles. Any deviation due to technical constraints must be documented and justified in the feature specification or implementation plan.

**Version**: 1.0.0 | **Ratified**: 2026-07-05 | **Last Amended**: 2026-07-05
