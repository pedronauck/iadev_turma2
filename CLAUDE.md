# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bun monorepo with workspaces containing a React frontend and Express.js backend for the "IA para Devs" course. The project demonstrates API connectivity between frontend and backend with real-time health monitoring.

## Architecture

**Monorepo Structure:**
- `@frontend/app` - React + Vite frontend with Tailwind CSS and shadcn/ui components
- `@backend/api` - TypeScript Express.js API server with CORS enabled
- Root workspace manages both packages with Bun workspaces

**Key Integration:**
- Frontend polls backend `/health` endpoint every 5 seconds
- Live API status indicator in UI (green/red/yellow dot)
- Frontend expects backend on `http://localhost:3000`

## Development Commands

**Start Development:**
```bash
bun run dev           # Start both frontend and backend
bun run dev:frontend  # Frontend only (Vite dev server)
bun run dev:backend   # Backend only (nodemon + tsx)
```

**Build:**
```bash
bun run build         # Build both packages
bun run build:frontend # Frontend build (Vite)
bun run build:backend  # Backend build (TypeScript compiler)
```

**Code Quality:**
```bash
bun run format        # Format all files with Prettier
bun run format:check  # Check formatting without changes
cd frontend && bun run lint  # ESLint frontend code
```

## Technology Stack

**Frontend (`@frontend/app`):**
- React 19.1.1 + Vite 7.1.2
- Tailwind CSS 3.4.17 with shadcn/ui components
- ESLint + Prettier for code quality
- Path alias: `@/` → `./src/`

**Backend (`@backend/api`):**
- Express 5.1.0 + TypeScript 5.9.2
- CORS enabled for cross-origin requests
- nodemon + tsx for development hot reload
- Strict TypeScript configuration

## File Structure Conventions

- Frontend components use `.jsx` extension
- Backend uses `.ts` extension with strict TypeScript
- VS Code workspace configured for auto-formatting and extension recommendations
- Tailwind classes are used throughout the frontend for styling

## Development Notes

- Backend runs on port 3000 (configurable via PORT env var)
- Frontend development server typically runs on port 5173 (Vite default)
- Health check endpoint: `GET /health` returns status and timestamp
- No authentication or database setup in base configuration