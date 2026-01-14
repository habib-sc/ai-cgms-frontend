# AI CGMS — AI Content Generation & Management System

A modern, full‑stack web application that lets users generate AI content (blog posts, outlines, product descriptions, social captions, email subject lines, and ad copy), track generation jobs, edit metadata (title, tags, notes), and manage content in a dashboard.

## Project Overview

- Authentication with email/password and session retrieval
- Dashboard with content filtering, search, pagination, and recent items
- Content generation jobs with live status updates
- Inline editing via modal and safe deletion via confirmation dialog
- Optimistic UI updates and user feedback with toasts
- Estimated delay display from backend response in minutes/seconds

## Tech Stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Styling/UI: Tailwind CSS, Shadcn UI, Lucide Icons
- State: React Query (server state), Zustand (client/auth state)
- Networking: Axios, WebSocket (Socket.IO client)
- Tooling: ESLint, TypeScript

## Setup Instructions

### Prerequisites
- Node.js 22+ and npm
- A backend service exposing REST API at `http://localhost:5000/api` (configurable)

### Frontend
1. Configure environment:
   - Create `.env` and set:
     ```env
     NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
     NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
     ```
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:3000.


## API Documentation

### Auth

- POST `/api/v1/auth/register`
  - Body: `{ name, email, password }`
  - Purpose: Register a new user and return tokens
- POST `/api/v1/auth/login`
  - Body: `{ email, password }`
  - Purpose: Login and return tokens
- GET `/api/v1/auth/me`
  - Headers: `Authorization: Bearer <accessToken>`
  - Purpose: Fetch current user profile

### Content

- POST `/api/v1/content/generate`
  - Headers: `Authorization: Bearer <accessToken>`
  - Body: `{ prompt, contentType, model?, provider?, title? }`
  - Purpose: Enqueue content generation; returns `{ jobId, expectedDelay: { minutes, seconds }, contentId }`
- GET `/api/v1/content/:jobId/status`
  - Headers: `Authorization: Bearer <accessToken>`
  - Purpose: Get job status for the user’s content by jobId
- GET `/api/v1/content`
  - Headers: `Authorization: Bearer <accessToken>`
  - Query: `{ page?, limit?, status?, contentType?, startDate?, endDate?, search? }`
  - Purpose: List user’s contents with pagination and filters
- GET `/api/v1/content/:id`
  - Headers: `Authorization: Bearer <accessToken>`
  - Purpose: Get a content document by id
- PATCH `/api/v1/content/:id`
  - Headers: `Authorization: Bearer <accessToken>`
  - Body: `{ title?, tags?, notes? }`
  - Purpose: Update metadata only
- POST `/api/v1/content/:id/regenerate`
  - Headers: `Authorization: Bearer <accessToken>`
  - Body: `{ provider?, model? }`
  - Purpose: Reset status and enqueue a new generation job
- DELETE `/api/v1/content/:id`
  - Headers: `Authorization: Bearer <accessToken>`
  - Purpose: Delete a content document

### Realtime (Socket.IO)

- Connect: `io("http://localhost:5000", { auth: { token: <accessToken> } })`
- Client → Server:
  - `subscribe-job`: `jobId`
  - `unsubscribe-job`: `jobId`
- Server → Client:
  - `job-status`: `{ type: "content-generation", jobId?, contentId?, userId, status: "queued" | "processing" | "completed" | "failed", error? }`



## Architectural Decisions

- Next.js App Router
  - File‑based routing and modern React patterns for performance and maintainability
  - SSR/ISR can be adopted for SEO where applicable; interactive views use client components
- State Management
  - React Query for server state: caching, mutations, invalidation, and optimistic updates (e.g., delete)
  - Zustand for client/auth state, centralizing `isAuthenticated` and session fetching
- Realtime Job Updates
  - WebSocket via `watchJob(jobId, token, handler)` to push job status and trigger cache updates and notifications
- API Integration
  - Axios instance with auth header injection from local storage
  - Request/response unwrapping helpers for consistent `data` handling
- AI Provider/Model Choice
  - Defaults favor fast, cost‑efficient models (e.g., OpenAI `gpt-5-nano`), configurable per request
  - Rationale: low latency for better UX; configurable to support higher‑quality models when needed
- Reliability & Performance
  - Optimistic updates with rollback on error for snappy UI
  - Query invalidation to reconcile with server truth

## Development

- Scripts
  - `npm run dev` — start frontend
  - `npm run build` — production build
  - `npm run start` — run built app
  - `npm run lint` — lint codebase
- Environment
  - `NEXT_PUBLIC_API_BASE_URL` must point to the backend API base (`/api`)

## Folder Pointers

- Frontend pages and components under `app/` and `components/`
- API client and hooks: `lib/api/client.ts`, `lib/api/queries/content.ts`
- Utilities: `lib/utils/`
- UI primitives: `components/ui/`

