# TaskFlow API Gateway

Forwards HTTP requests to microservices. **No database**, **no Prisma**, **no JWT logic** — only Express + Axios.

## Install & run

```bash
cd api-gateway
npm install
npm run dev
```

Run all services:

| Service | Port | Command |
|---------|------|---------|
| auth-service | 5003 | `cd ../auth-service && npm run dev` |
| task-service | 5004 | `cd ../task-service && npm run dev` |
| api-gateway | 5000 | `npm run dev` |

## Environment (`.env`)

```
PORT=5000
AUTH_SERVICE_URL=http://localhost:5003
TASK_SERVICE_URL=http://localhost:5004
```

### Circuit breaker

Each downstream service (auth, tasks, …) has its own circuit breaker. Repeated network errors, timeouts, or **5xx** responses can **open** the circuit; further requests return a **fallback** JSON payload (`degraded: true`) with HTTP **503** instead of calling the failing service.

| Variable | Default | Meaning |
|----------|---------|---------|
| `CIRCUIT_BREAKER_ENABLED` | `true` | Set to `false` to disable |
| `CIRCUIT_BREAKER_VOLUME_THRESHOLD` | `5` | Min requests in the rolling window before tripping |
| `CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENT` | `50` | Failure % in the window that opens the circuit |
| `CIRCUIT_BREAKER_RESET_TIMEOUT_MS` | `30000` | How long the circuit stays open before half-open retry |
| `CIRCUIT_BREAKER_ROLLING_WINDOW_MS` | `10000` | Rolling window for failure rate |

`GET /health` includes `circuitBreaker.enabled` and per-service states (`CLOSED`, `OPEN`, `HALF_OPEN`).

---

## Routes

### Auth → auth-service

| Client (gateway) | Forwards to |
|------------------|-------------|
| `POST /api/auth/signup` | `POST /signup` |
| `POST /api/auth/login` | `POST /login` |
| `GET /api/auth/profile` | `GET /profile` (+ `Authorization`) |

### Tasks → task-service

| Client (gateway) | Forwards to |
|------------------|-------------|
| `POST /api/tasks` | `POST /tasks` |
| `GET /api/tasks` | `GET /tasks` |
| `GET /api/tasks/stats` | `GET /tasks/stats` |
| `GET /api/tasks/:id` | `GET /tasks/:id` |
| `PUT /api/tasks/:id` | `PUT /tasks/:id` |
| `DELETE /api/tasks/:id` | `DELETE /tasks/:id` |

All task routes forward the **`Authorization: Bearer <token>`** header to task-service.

---

## Request flow (create task)

```
1. React  →  POST http://localhost:5000/api/tasks
             Authorization: Bearer <JWT from login>

2. Gateway  →  POST http://localhost:5004/tasks
               (same body + header)

3. Task service  →  Verifies JWT, saves task with userId from token

4. Gateway  →  Returns JSON to React
```

---

## Postman

Base: **http://localhost:5000**

### 1. Health

`GET /health`

### 2. Login (get token)

`POST /api/auth/login`

```json
{ "email": "john@test.com", "password": "123456" }
```

### 3. Create task

`POST /api/tasks`  
Header: `Authorization: Bearer <token>`

```json
{
  "title": "Learn Kafka",
  "description": "Complete basics",
  "status": "TODO",
  "priority": "HIGH"
}
```

### 4. List my tasks

`GET /api/tasks` + Bearer token

### 5. Stats

`GET /api/tasks/stats` + Bearer token

---

## Files

| File | Purpose |
|------|---------|
| `server.js` | Mounts `/api/auth` and `/api/tasks` |
| `routes/auth.routes.js` | Auth proxy |
| `routes/task.routes.js` | Task proxy (all methods/paths) |
| `utils/forwardRequest.js` | Axios forward helper |

---

## Errors

| Status | Meaning |
|--------|---------|
| 503 | Target microservice not running |
| 401/400/404 | Passed through from auth or task service |
