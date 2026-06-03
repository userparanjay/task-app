import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { forwardRequest } from "../src/utils/circuitbreaker/forwardRequest.js";
import { resetCircuitBreakers } from "../src/utils/circuitbreaker/circuitBreaker.js";

function createMockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe("forwardRequest", () => {
  let mock;

  beforeEach(() => {
    resetCircuitBreakers();
    mock = new MockAdapter(axios);
    process.env.HTTP_TIMEOUT_MS = "5000";
    process.env.CIRCUIT_BREAKER_ENABLED = "true";
  });

  afterEach(() => {
    mock.restore();
    resetCircuitBreakers();
  });

  it("forwards Authorization header when present", async () => {
    mock.onGet("http://auth.test/profile").reply((config) => {
      assert.equal(config.headers.Authorization, "Bearer secret");
      return [200, { id: "user-1" }];
    });

    const req = {
      headers: { authorization: "Bearer secret" },
      body: {},
      query: {},
    };
    const res = createMockRes();

    await forwardRequest(req, res, {
      baseUrl: "http://auth.test",
      method: "GET",
      path: "/profile",
    });

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { id: "user-1" });
  });
});
