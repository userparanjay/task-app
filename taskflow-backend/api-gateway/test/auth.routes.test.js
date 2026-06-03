import { describe, it, before, afterEach } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import request from "supertest";
import { resetCircuitBreakers } from "../src/utils/circuitBreaker.js";

describe("POST /api/auth/login", () => {
  let app;
  let mock;

  before(async () => {
    process.env.AUTH_SERVICE_URL = "http://auth.test";
    process.env.TASK_SERVICE_URL = "http://task.test";
    process.env.HTTP_TIMEOUT_MS = "5000";
    ({ default: app } = await import("../src/app.js"));
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
    resetCircuitBreakers();
  });

  it("forwards login to auth-service and returns the response", async () => {
    mock.onPost("http://auth.test/login").reply(200, {
      success: true,
      token: "test-token",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@test.com", password: "123456" })
      .expect(200);

    assert.equal(res.body.success, true);
    assert.equal(res.body.token, "test-token");
  });

  it("returns 503 when auth-service is unavailable", async () => {
    mock.onPost("http://auth.test/login").networkError();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@test.com", password: "123456" })
      .expect(503);

    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Auth service is unavailable/);
  });
});
