# TaskFlow Frontend

Production-grade React frontend for a microservice-based task management system. Designed to connect to Node.js Express services, Kafka events, Kubernetes ingress, Redis, PostgreSQL, and notification pipelines.

## Tech Stack

- **React 19** + **Vite 6**
- **React Router DOM 7** — routing & protected routes
- **Axios** — API layer with interceptors
- **Context API** — auth state (Redux-ready)
- **Tailwind CSS 4** — responsive SaaS UI

## Quick Start

```bash
cd taskflow-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use any email/password (min 6 chars) to sign in — dev mode falls back to sample data when the API is unreachable.

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Point this at your API gateway or Kubernetes ingress when microservices are deployed.

## API Endpoints (placeholder structure)

| Service        | Method | Path                    |
|----------------|--------|-------------------------|
| Auth           | POST   | `/api/auth/login`       |
| Auth           | POST   | `/api/auth/signup`      |
| Auth           | GET    | `/api/auth/me`          |
| Tasks          | GET    | `/api/tasks`            |
| Tasks          | POST   | `/api/tasks`            |
| Tasks          | GET    | `/api/tasks/:id`        |
| Tasks          | PUT    | `/api/tasks/:id`        |
| Tasks          | DELETE | `/api/tasks/:id`        |
| Tasks          | GET    | `/api/tasks/stats`      |
| Notifications  | GET    | `/api/notifications`    |

## Folder Structure

```
src/
├── components/
│   ├── common/       # Button, Input, Card, Spinner, Badge...
│   ├── layout/       # Sidebar, Navbar, AppLayout, AuthLayout
│   └── task/         # TaskForm, TaskCard, TaskFilters...
├── pages/
│   ├── Login/
│   ├── Signup/
│   ├── Dashboard/
│   ├── Tasks/
│   └── Notifications/
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   ├── taskService.js
│   └── notificationService.js
├── routes/
│   └── ProtectedRoute.jsx
├── hooks/
├── utils/
├── constants/
└── App.jsx
```

## Architecture Overview

### 1. API Layer (`services/`)

- **`apiClient.js`** — Single Axios instance: `baseURL`, JWT on requests, 401 → logout redirect.
- **Domain services** — `authService`, `taskService`, `notificationService` encapsulate endpoints. Pages never call Axios directly.
- **Dev fallback** — When the backend is down, services return sample data (no mock libraries).

### 2. Authentication (`context/AuthContext.jsx`)

- JWT stored in `localStorage` (swap to httpOnly cookies when auth service supports it).
- `AuthProvider` wraps the app; `useAuth()` exposes `login`, `signup`, `logout`, `isAuthenticated`.
- **`ProtectedRoute`** — Blocks unauthenticated access; shows loader during session bootstrap.

### 3. Routing (`App.jsx`)

- Public: `/login`, `/signup`
- Protected shell: sidebar + navbar via `AppLayout`
- Nested routes for dashboard, tasks CRUD, notifications

### 4. UI Components

- **Common** — Reusable primitives with consistent focus/validation states
- **Layout** — Responsive sidebar (drawer on mobile)
- **Task** — Domain-specific forms and list items

### 5. State & Data Fetching

- Auth: Context API (migrate to Redux Toolkit later without changing service contracts)
- Pages: local state + `useEffect` / `useDebounce` for search
- **`useAsync`** hook available for shared async patterns

## Connecting to Microservices

1. Deploy Express services behind one ingress (e.g. `api.taskflow.local`).
2. Set `VITE_API_BASE_URL` to that gateway.
3. Ensure auth returns `{ user, accessToken, refreshToken }`.
4. Remove or disable dev sample fallbacks in `*Service.js` when APIs are stable.
5. Add WebSocket or SSE on `NotificationsPage` for live Kafka-driven updates.

## Scripts

| Command        | Description          |
|----------------|----------------------|
| `npm run dev`  | Development server   |
| `npm run build`| Production build     |
| `npm run preview` | Preview production build |

## License

Private — TaskFlow internal use.
