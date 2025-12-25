# Workspace Architecture

This document provides a high-level overview of the monorepo architecture, design principles, and technical standards used across the workspace.

For specific application details, please refer to their respective documentation:

- [**Notes App Architecture**](../apps/notes/README.md)

## Table of Contents

1. [Monorepo Structure](#monorepo-structure)
2. [Tech Stack](#tech-stack)
3. [Design Principles](#design-principles)
4. [Quality & Tooling](#quality--tooling)

---

## Monorepo Structure

This project uses **Nx** to organize code into a monorepo structure. This approach improves maintainability, encourages code reuse, and enforces clear boundaries between different parts of the application.

### Apps vs Libs

The codebase is strictly divided into **Apps** and **Libs**:

#### Apps (`apps/`)

Applications are thin containers that compose functionality from libraries. They handle:

- Routing and Navigation
- Application-specific Configuration
- Page Composition
- Entry Points

**Current Apps:**

- `notes`: The main collaborative notes application.

#### Libs (`libs/`)

Libraries are categorized by their responsibility:

- **`data-access`** (e.g., `libs/data-access/notes`):
  - Domain logic, state management, and API interactions.
  - UI-agnostic business rules.

- **`design-system`** (`libs/design-system`):
  - Reusable UI components (Buttons, Dialogs, Inputs).
  - Design tokens (colors, spacing, typography).
  - Global styles.

- **`shared`** (`libs/shared`):
  - **`hooks`**: Generic React hooks (e.g., `useDebounce`, `useMediaQuery`).
  - **`util`**: Pure utility functions (e.g., date formatting, text processing).

### Dependency Graph

The dependency flow is strictly unidirectional to prevent circular dependencies:

`App -> Feature/Data Access -> UI/Shared Utils`

---

## Tech Stack

The workspace is built on a modern, type-safe stack:

- **Monorepo Tooling**: [Nx](https://nx.dev)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + React Testing Library

---

## Design Principles

### SOLID Principles

We adhere to SOLID principles to ensure scalable and maintainable code:

1. **Single Responsibility (SRP)**: Each module/component has one reason to change.
2. **Open/Closed (OCP)**: Components are open for extension (via props/composition) but closed for modification.
3. **Liskov Substitution (LSP)**: Subtypes (e.g., specific Note types) are substitutable for base types.
4. **Interface Segregation (ISP)**: Interfaces are small and specific.
5. **Dependency Inversion (DIP)**: Components depend on abstractions (hooks/stores), not concrete implementations.

### Other Key Principles

- **DRY (Don't Repeat Yourself)**: Logic is extracted into shared libraries or hooks.
- **KISS (Keep It Simple, Stupid)**: Prefer simple, readable solutions over complex engineering.
- **Composition over Inheritance**: UI is built by composing small, reusable components.

---

## Quality & Tooling

### TypeScript

Strict mode is enabled for maximum type safety. We use modern features (ES2024 target) and strict null checks.

### Linting & Formatting

- **ESLint**: Enforces code quality and best practices.
- **Prettier**: Ensures consistent code formatting.

### Testing Strategy

- **Unit Tests**: Focus on business logic in `data-access` and utility functions in `shared`.
- **Component Tests**: Focus on interaction and rendering in `design-system` and feature components.
- **Coverage**: We aim for high coverage on critical paths (store logic, complex utilities).
