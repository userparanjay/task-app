# TaskFlow Auth Service

Authentication API with **PostgreSQL** (not in-memory).

## 1. Install packages

```bash
cd auth-service
npm install
```

## 2. Start PostgreSQL

**Option A — Docker (recommended)**

```bash
docker compose up -d
```

**Option B — Local PostgreSQL**

Create database `taskflow_auth`, then set `DATABASE_URL` in `.env`.

## 3. Environment

`.env`:

```
PORT=5003
JWT_SECRET=mysecretkey
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow_auth
```

## 4. Run server

```bash
npm run dev
```

On startup the server creates the `users` table automatically.

---

## PostgreSQL table

| Column     | Type        | Notes                    |
|------------|-------------|--------------------------|
| id         | UUID        | Auto-generated           |
| name       | VARCHAR     | Display name             |
| email      | VARCHAR     | Unique login             |
| password   | VARCHAR     | bcrypt hash only         |
| created_at | TIMESTAMPTZ | Auto timestamp           |

---

## API flow (with PostgreSQL)

**Signup:** validate → check email in DB → hash password → `INSERT` into `users`

**Login:** `SELECT` by email → `bcrypt.compare` → sign JWT

**Profile:** verify JWT → `SELECT` user by id from token → return user

---

## Postman

Base: `http://localhost:5003`

### Signup — POST `/signup`

```json
{
  "name": "John",
  "email": "john@test.com",
  "password": "123456"
}
```

### Login — POST `/login`

```json
{
  "email": "john@test.com",
  "password": "123456"
}
```

Copy `token` from response.

### Profile — GET `/profile`

Header: `Authorization: Bearer <your-token>`

---

## File roles

| File | Purpose |
|------|---------|
| `src/config/db.js` | Pool + `CREATE TABLE` on startup |
| `src/data/users.js` | SQL queries (find, create) |
| `src/controllers/auth.controller.js` | Signup, login, profile logic |
| `src/middleware/auth.middleware.js` | JWT + load user from DB |
| `docker-compose.yml` | Local Postgres for dev |
