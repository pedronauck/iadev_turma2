# Repository Guidelines

<critical>
- **MANDATORY READ THIS FILES BEFORE DO ANYTHING**, if you don't follow them your task will be invalidated:
  - when doing backend:
    - Hono framework: Follow Hono best practices and patterns
    - Bun runtime: .cursor/rules/bunjs.mdc
  - when doing frontend:
    - ReactJS: .cursor/rules/react.mdc
    - Vite: Follow Vite configuration and build patterns
    - ShadCN component: .cursor/rules/shadcn.mdc
    - Tailwind: .cursor/rules/tailwindcss.mdc
  - for both:
    - TypeScript: .cursor/rules/typescript.mdc
    - Bun: .cursor/rules/bunjs.mdc
    - Vitest: .cursor/rules/vitest.mdc (for frontend tests)

- **MANDATORY REQUIREMENTS**
  - **ALWAYS** check dependent files APIs before write tests to avoid write wrong code
  - **NEVER** use workarounds, especially in tests - implement proper solutions
  - **MUST** run `bun run lint`, `bun run typecheck` (if configured), and `bun run test` before completing ANY subtask
  - **ALWAYS CHECK** the .cursor/rules/zen-mcp-tools.mdc if you are using Zen MCP tools
  - **ALWAYS READ** the .cursor/rules/vitest.mdc before writing tests - **YOU MUST** follow Vitest best practices and patterns
  - **YOU CAN ONLY** finish a task if `bun run lint`, `bun run typecheck` (if configured), and `bun run test` are passing, your task should not finish before this
  - **ALWAYS FOLLOW** shadcn filename pattern with kebabcase for all react related files under the ./frontend/src/components and ./frontend/src/pages directories
  - **YOU SHOULD NEVER** install dependencies by hand, always use `bun add` instead (CRITICAL)
  - **YOU SHOULD ALWAYS** complete ALL THE STEPS when using any Zen MCP tool, NEVER stops in the middle of the steps, if you don't complete the steps, YOUR TASK WILL BE INVALIDATED

### Greenfield Approach

- **YOU SHOULD ALWAYS** have in mind that this should be done in a greenfield approach, we don't need to care about backwards compatibility since the project is in alpha, and support old and new stuff just introduces more complexity in the project; never sacrifice quality because of backwards compatibility

### For React Components

- **YOU MUST FOLLOW** the react.mdc rules when creating react components, if you does not follow this you will be rejected
- **NEVER** create components that mix a lot of behavior logic with visual rendering. Instead, extract behavior into focused custom hooks. Components should focus primarily on rendering UI and delegating to hooks for state management and business logic.
- **USE React patterns**: Client Components for interactivity, custom hooks for state management and business logic, React Query for data fetching.

**Enforcement:** Violating these standards results in immediate task rejection.
</critical>

## Build, Test, and Development Commands

From repo root (Turbo monorepo):

- `bun install` – Install dependencies for all workspaces.
- `bun run dev` – Start development servers (backend + frontend) via Turbo.
- `bun run build` – Build all workspaces for production via Turbo.
- `bun run lint` – Lint all workspaces via Turbo.
- `bun run typecheck` – Type check all workspaces via Turbo.
- `bun run test` – Run tests for all workspaces via Turbo.
- `bun run format` – Format code with Prettier.
- `bun run format:check` – Check code formatting.

**Workspace-specific commands:**

Backend (`backend/`):
- `bun run dev` – Start Hono server with Bun watch mode.
- `bun run build` – Compile TypeScript to JavaScript.
- `bun run start` – Start production server.
- `bun test` – Run tests with Bun's test runner.

Frontend (`frontend/`):
- `bun run dev` – Start Vite development server.
- `bun run build` – Build production bundle with Vite.
- `bun run preview` – Preview production build.
- `bun run lint` – Lint with ESLint.
- `bun run typecheck` – Type check with TypeScript.

## Coding Style & Naming Conventions

- TypeScript, React 19, Vite, Tailwind CSS 4, Hono; 2‑space indent; semicolons; double quotes.
- Lint with ESLint. Fix issues before committing.
- File names: components `kebab-case.tsx`; hooks `use-kebab-case.ts`; utilities `camel-case.ts`; types in `types.ts`.
- Exports: prefer named exports for components and utils.
- Backend: Use Hono framework patterns, clean architecture with domain/application/infrastructure layers.
- Frontend: Use React patterns with custom hooks, React Query for data fetching, Zustand for global state.

## Commit & Pull Request Guidelines

- Use Conventional Commits: `feat: …`, `fix: …`, `build: …`, `refactor: …` (e.g., `feat: add product image upload`, `fix: product validation error`).
- Before opening a PR: run `bun run lint`, `bun run typecheck`, and `bun run test` from repo root.
- PRs should include: clear description, linked issue, and screenshots/GIFs for UI changes.

## Security & Configuration Tips

- Environment files: keep secrets in `.env` (never commit). Mirror keys in `.env.example`.
- Avoid introducing new global styles; scope styles via components and Tailwind utilities.
- Do not rewrite unrelated files or reformat whole repo—limit diffs to your change.