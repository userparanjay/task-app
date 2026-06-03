import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fireWithCircuitBreaker,
  resetCircuitBreakers,
} from "../src/utils/circuitbreaker/circuitBreaker.js";

describe("circuit breaker", () => {
  let mock;

  beforeEach(() => {
    resetCircuitBreakers();
    mock = new MockAdapter(axios);
    process.env.CIRCUIT_BREAKER_ENABLED = "true";
    process.env.HTTP_TIMEOUT_MS = "5000";
    process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD = "3";
    process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENT = "50";
    process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS = "60000";
    process.env.CIRCUIT_BREAKER_ROLLING_WINDOW_MS = "60000";
  });

  afterEach(() => {
    mock.restore();
    resetCircuitBreakers();
    delete process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD;
    delete process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENT;
    delete process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS;
    delete process.env.CIRCUIT_BREAKER_ROLLING_WINDOW_MS;
  });

  it("returns fallback without calling upstream when circuit is open", async () => {
    mock.onGet("http://auth.test/profile").networkError();

    const config = {
      method: "GET",
      url: "http://auth.test/profile",
      headers: {},
      timeout: 5000,
    };

    await assert.rejects(() => fireWithCircuitBreaker("Auth service", config));
    await assert.rejects(() => fireWithCircuitBreaker("Auth service", config));

    const tripped = await fireWithCircuitBreaker("Auth service", config);
    assert.equal(tripped._circuitFallback, true);

    mock.resetHistory();

    const result = await fireWithCircuitBreaker("Auth service", config);

    assert.equal(result._circuitFallback, true);
    assert.equal(result.body.degraded, true);
    assert.match(result.body.message, /Auth service is temporarily unavailable/);
    assert.equal(mock.history.get.length, 0);
  });

  it("passes through successful upstream responses", async () => {
    mock.onGet("http://auth.test/profile").reply(200, { id: "user-1" });

    const result = await fireWithCircuitBreaker("Auth service", {
      method: "GET",
      url: "http://auth.test/profile",
      headers: {},
      timeout: 5000,
    });

    assert.equal(result.status, 200);
    assert.deepEqual(result.data, { id: "user-1" });
  });

  it("does not trip the circuit on upstream 4xx responses", async () => {
    mock.onPost("http://auth.test/login").reply(401, { success: false });

    const config = {
      method: "POST",
      url: "http://auth.test/login",
      headers: {},
      data: {},
      timeout: 5000,
    };

    for (let i = 0; i < 5; i += 1) {
      const result = await fireWithCircuitBreaker("Auth service", config);
      assert.equal(result.status, 401);
    }
  });
});
