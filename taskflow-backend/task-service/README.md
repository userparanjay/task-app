# TaskFlow Task Service

Microservice for task CRUD. Uses **its own database** (`task_db`) and verifies **JWT** from auth-service.

## Install

```bash
cd task-service
npm install
```

## Database setup

1. Create database (once):

```sql
CREATE DATABASE task_db;
```

Or with Docker:

```bash
docker exec -it postgres_container psql -U root -d github -c "CREATE DATABASE task_db;"
```

2. Push Prisma schema:

```bash
npm run db:push
```

Or use migrations:

```bash
npm run db:migrate
```

## Environment (`.env`)

```
PORT=5004
JWT_SECRET=mysecretkey
DATABASE_URL=postgresql://root:root%40123@localhost:5432/task_db
```

**JWT_SECRET must match auth-service** so tokens work here.

## Run

```bash
npm run dev
```

Also run: **auth-service** (5003), **api-gateway** (5000).

---

## Flow (step by step)

### Create a task

```
1. User logs in via Auth Service → receives JWT

2. Client sends:
   POST http://localhost:5000/api/tasks
   Authorization: Bearer <token>
   Body: { title, description, status, priority }

3. API Gateway forwards to task-service POST /tasks

4. task-service:
   - auth.middleware verifies JWT → req.user.id
   - Zod validates body
   - Prisma saves task with userId = req.user.id
   - Does NOT store name/email in task DB

5. Response: { success, task }
```

### Get my tasks

```
GET /api/tasks + Bearer token
→ task-service filters: WHERE user_id = req.user.id
```

---

## APIs (task-service direct — port 5004)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/tasks` | Yes | Create task |
| GET | `/tasks` | Yes | List my tasks |
| GET | `/tasks/stats` | Yes | Dashboard stats |
| GET | `/tasks/:id` | Yes | One task |
| PUT | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |

Via gateway use: `http://localhost:5000/api/tasks...`

---

## Postman (through gateway)

1. Login: `POST http://localhost:5000/api/auth/login` → copy `token`

2. Create task:

- `POST http://localhost:5000/api/tasks`
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "title": "Learn Kafka",
  "description": "Complete basics",
  "status": "TODO",
  "priority": "HIGH"
}
```

3. List tasks: `GET http://localhost:5000/api/tasks` + Bearer token

4. Get one: `GET http://localhost:5000/api/tasks/<task-id>` + Bearer token

5. Update: `PUT http://localhost:5000/api/tasks/<task-id>` + body (partial fields OK)

6. Delete: `DELETE http://localhost:5000/api/tasks/<task-id>`

---

## File guide

| File | Role |
|------|------|
| `prisma/schema.prisma` | Task model + enums |
| `src/prisma/prismaClient.js` | DB connection |
| `src/middleware/auth.middleware.js` | JWT verify → `req.user.id` |
| `src/middleware/validate.middleware.js` | Zod runner |
| `src/validations/task.validation.js` | Create/update schemas |
| `src/controllers/task.controller.js` | CRUD logic |
| `src/routes/task.routes.js` | URL mapping |
| `src/server.js` | Express app |

---

## Status / priority values

- Status: `TODO`, `IN_PROGRESS`, `COMPLETED`
- Priority: `LOW`, `MEDIUM`, `HIGH`
