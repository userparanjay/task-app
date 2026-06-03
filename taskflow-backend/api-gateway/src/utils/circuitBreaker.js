/**
 * Per-service circuit breakers for downstream HTTP calls.
 */

import axios from "axios";
import { getCircuitBreakerOptions, isCircuitBreakerEnabled } from "./circuitBreakerConfig.js";
import { getFallbackResponse } from "./fallbackResponses.js";

const STATES = {
  CLOSED: "CLOSED",
  OPEN: "OPEN",
  HALF_OPEN: "HALF_OPEN",
};

const breakers = new Map();

export class UpstreamServiceError extends Error {
  constructor(message, { code, response } = {}) {
    super(message);
    this.name = "UpstreamServiceError";
    this.code = code;
    this.response = response;
    this.isUpstreamServiceError = true;
  }
}

class ServiceCircuitBreaker {
  constructor(serviceName, options) {
    this.serviceName = serviceName;
    this.options = options;
    this.state = STATES.CLOSED;
    this.openedAt = 0;
    /** @type {{ success: boolean, at: number }[]} */
    this.outcomes = [];
  }

  #pruneOutcomes() {
    const cutoff = Date.now() - this.options.rollingCountTimeout;
    this.outcomes = this.outcomes.filter((o) => o.at > cutoff);
  }

  #recordOutcome(success) {
    this.outcomes.push({ success, at: Date.now() });
    this.#pruneOutcomes();
  }

  #shouldTrip() {
    this.#pruneOutcomes();
    if (this.outcomes.length < this.options.volumeThreshold) {
      return false;
    }
    const failures = this.outcomes.filter((o) => !o.success).length;
    const failureRate = (failures / this.outcomes.length) * 100;
    return failureRate >= this.options.errorThresholdPercentage;
  }

  #openCircuit() {
    this.state = STATES.OPEN;
    this.openedAt = Date.now();
    console.warn(`[circuit-breaker] OPEN — ${this.serviceName}`);
  }

  #closeCircuit() {
    this.state = STATES.CLOSED;
    this.outcomes = [];
    console.log(`[circuit-breaker] CLOSED — ${this.serviceName}`);
  }

  #halfOpenCircuit() {
    this.state = STATES.HALF_OPEN;
    console.log(`[circuit-breaker] HALF-OPEN — ${this.serviceName}`);
  }

  #circuitFallback() {
    return {
      _circuitFallback: true,
      body: getFallbackResponse(this.serviceName),
    };
  }

  #recordSuccess() {
    this.#recordOutcome(true);
    if (this.state === STATES.HALF_OPEN) {
      this.#closeCircuit();
    }
  }

  #recordFailure() {
    this.#recordOutcome(false);

    if (this.state === STATES.HALF_OPEN) {
      this.#openCircuit();
      return;
    }

    if (this.#shouldTrip()) {
      this.#openCircuit();
    }
  }

  async execute(action) {
    if (this.state === STATES.OPEN) {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed < this.options.resetTimeout) {
        return this.#circuitFallback();
      }
      this.#halfOpenCircuit();
    }

    try {
      const result = await action();
      this.#recordSuccess();
      return result;
    } catch (error) {
      this.#recordFailure();

      if (this.state === STATES.OPEN) {
        return this.#circuitFallback();
      }

      throw error;
    }
  }
}

/**
 * Axios call used inside the breaker. Throws on network/timeout and 5xx so
 * failures count toward opening the circuit; 4xx are passed through.
 */
export async function callUpstream(config) {
  try {
    const response = await axios({
      ...config,
      validateStatus: () => true,
    });

    if (response.status >= 500) {
      throw new UpstreamServiceError(`Upstream returned ${response.status}`, {
        response,
      });
    }

    return response;
  } catch (error) {
    if (error.isUpstreamServiceError) {
      throw error;
    }

    const isUnavailable =
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      (error.isAxiosError && !error.response);

    if (isUnavailable) {
      throw new UpstreamServiceError(error.message, { code: error.code });
    }

    throw error;
  }
}

function createBreaker(serviceName) {
  return new ServiceCircuitBreaker(serviceName, getCircuitBreakerOptions());
}

export function getCircuitBreaker(serviceName) {
  if (!breakers.has(serviceName)) {
    breakers.set(serviceName, createBreaker(serviceName));
  }
  return breakers.get(serviceName);
}

export async function fireWithCircuitBreaker(serviceName, config) {
  if (!isCircuitBreakerEnabled()) {
    return callUpstream(config);
  }

  const breaker = getCircuitBreaker(serviceName);
  return breaker.execute(() => callUpstream(config));
}

/** Current breaker states (for health checks). */
export function getCircuitBreakerStates() {
  return Object.fromEntries(
    [...breakers.entries()].map(([name, breaker]) => [name, breaker.state]),
  );
}

/** Clears breaker state (for tests). */
export function resetCircuitBreakers() {
  breakers.clear();
}
