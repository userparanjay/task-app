-- Run manually in psql if you prefer (optional — server also runs this on startup)
-- psql -U postgres -d taskflow_auth -f src/db/schema.sql

CREATE DATABASE taskflow_auth;

\c taskflow_auth

CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
