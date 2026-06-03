import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

describe("GET /health", () => {
  let app;

  before(async () => {
    process.env.AUTH_SERVICE_URL = "http://auth.test";
    process.env.TASK_SERVICE_URL = "http://task.test";
    ({ default: app } = await import("../src/app.js"));
  });

  it("returns gateway status", async () => {
    const res = await request(app).get("/health").expect(200);

    assert.equal(res.body.status, "ok");
    assert.equal(res.body.service, "api-gateway");
    assert.equal(res.body.authService, "http://auth.test");
    assert.equal(res.body.taskService, "http://task.test");
  });
});
