# TaskFlow Backend Learning Checklist

This file tracks what is completed from your original production-grade roadmap and what to do next.

## Current Architecture Snapshot

- Frontend: React
- Entry point: API Gateway
- Services: Auth, Task, Notification, Email
- Event bus: Kafka
- Data layer: PostgreSQL with Prisma
- Infra: Docker Compose (Postgres, Kafka, Kafka UI, Redis)

## Progress Against Original Roadmap

### 1) Kafka DLQ + Retry
- [x] Implemented retry-aware flow for email events
- [x] Added retry configuration (`retry topic`, `DLQ topic`, retry attempts, delay values)
- [x] Added failure handling path to publish failed messages to retry/DLQ
- [x] Added idempotency-related handling in consumers

### 2) Redis Caching Layer
- [x] Redis integrated in services (notification/email paths)
- [x] Redis used for idempotency/event claim style protection
- [ ] Broader response caching strategy for read-heavy endpoints (next hardening item)

### 3) Distributed Tracing (OpenTelemetry)
- [ ] Not started yet (next major observability milestone)

### 4) BullMQ for Email Service
- [x] BullMQ worker added for email processing
- [x] Queue-based email execution path present
- [ ] Add production queue controls (backoff policy, limiter, dead-letter handling, monitoring)

### 5) Docker Compose Cleanup
- [~] In progress
- [x] Health checks added for Kafka/Postgres/Redis
- [x] Startup sequencing improved (`infra:up`, `infra:wait`)
- [ ] Split dev vs prod compose files
- [ ] Centralize env handling (`.env`, `.env.example`, secrets strategy)
- [ ] Add stable bootstrap for topics/migrations/init jobs

### 6) Kubernetes Deployment
- [ ] Not started yet

---

## What You Have Completed (Milestone)

You have completed the roadmap up to **BullMQ integration** in practical terms:

- Kafka-based async event flow is running
- Notification and Email consumers are wired
- Retry/DLQ concepts are implemented
- Redis is integrated
- BullMQ worker exists for email jobs

This is a strong intermediate production-architecture baseline.

---

## Next Step To Learn (Do This Now)

## Step 5: Docker Compose Production-Grade Cleanup

Focus on making local/dev/prod behavior deterministic and maintainable.

### Checklist
- [ ] Create `docker-compose.dev.yml` and `docker-compose.prod.yml`
- [ ] Move service env values to per-service `.env` files and document required keys
- [ ] Add explicit `depends_on` with health conditions where needed
- [ ] Add migration/bootstrap job pattern (Prisma migrate + Kafka topic bootstrap)
- [ ] Add restart policies and resource limits
- [ ] Add persistent volume policy and backup notes
- [ ] Add `make` or npm scripts for standard lifecycle:
  - [ ] `up`
  - [ ] `down`
  - [ ] `logs`
  - [ ] `reset`
  - [ ] `health`

### Learning Goals For Step 5
- Deterministic startup
- Environment isolation (dev/test/prod)
- Operability (logs, health, restart behavior)
- Repeatable onboarding for new developers

---

## After Step 5 (Upcoming)

## Step 6: Kubernetes Deployment

Once Compose is clean and stable:

- Deploy each microservice with `Deployment + Service`
- Externalize config with `ConfigMap/Secret`
- Use Ingress for API Gateway
- Add HPA basics for scale
- Add observability stack (OpenTelemetry collector + tracing backend)

---

## Suggested Weekly Learning Plan

- Week 1: Compose split + env strategy + migration/bootstrap jobs
- Week 2: Resource limits, restart policies, operational scripts, docs
- Week 3: First Kubernetes deployment (Auth + Gateway + Task)
- Week 4: Full stack on K8s + ingress + autoscaling basics

---

## Personal Goal Mapping

You are already actively building skills in:

- Microservices architecture
- Kafka event-driven design
- Production backend hardening

Next two steps (Compose cleanup + Kubernetes) will strongly level up your:

- DevOps maturity
- Reliability engineering mindset
- Production deployment confidence

