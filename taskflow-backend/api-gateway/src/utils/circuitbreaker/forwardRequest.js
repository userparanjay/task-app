/**
 * forwardRequest.js — Sends HTTP requests to a microservice
 *
 * The gateway does NOT use Prisma or PostgreSQL.
 * It only passes the request along and returns the service response.
 * Uses a per-service circuit breaker with fallback when the circuit is open.
 */

import {
  fireWithCircuitBreaker,
  UpstreamServiceError,
} from "./circuitBreaker.js";

/**
 * Forward request to auth-service (or any service base URL).
 *
 * @param {import('express').Request} req  - incoming client request
 * @param {import('express').Response} res - response back to client
 * @param {object} options
 * @param {string} options.baseUrl  - e.g. http://localhost:5003
 * @param {string} options.method   - GET, POST, ...
 * @param {string} options.path     - e.g. /login
 * @param {string} [options.serviceName] - label for logs and fallback messages
 */
export async function forwardRequest(
  req,
  res,
  { baseUrl, method, path, serviceName = "Service" },
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization;
  }

  const config = {
    method,
    url: `${baseUrl}${path}`,
    data: req.body,
    headers,
    params: req.query,
    timeout: Number(process.env.HTTP_TIMEOUT_MS),
  };

  try {
    const result = await fireWithCircuitBreaker(serviceName, config);

    if (result?._circuitFallback) {
      return res.status(503).json(result.body);
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error(`Gateway → ${baseUrl}${path} failed:`, error.message);

    if (error instanceof UpstreamServiceError || isUnavailableError(error)) {
      return res.status(503).json({
        success: false,
        message: `${serviceName} is unavailable. Check that it is running.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gateway error while forwarding request",
    });
  }
}

function isUnavailableError(error) {
  return (
    error.code === "ECONNREFUSED" ||
    error.code === "ERR_NETWORK" ||
    (error.isAxiosError && !error.response)
  );
}
