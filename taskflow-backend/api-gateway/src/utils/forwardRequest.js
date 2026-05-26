/**
 * forwardRequest.js — Sends HTTP requests to a microservice
 *
 * The gateway does NOT use Prisma or PostgreSQL.
 * It only passes the request along and returns the service response.
 */

import axios from "axios";

/**
 * Forward request to auth-service (or any service base URL).
 *
 * @param {import('express').Request} req  - incoming client request
 * @param {import('express').Response} res - response back to client
 * @param {object} options
 * @param {string} options.baseUrl  - e.g. http://localhost:5003
 * @param {string} options.method   - GET, POST, ...
 * @param {string} options.path     - e.g. /login
 */
export async function forwardRequest(req, res, { baseUrl, method, path, serviceName = "Service" }) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Forward JWT for protected routes
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    const response = await axios({
      method,
      url: `${baseUrl}${path}`,
      data: req.body,
      headers,
      params: req.query,
      timeout: Number(process.env.HTTP_TIMEOUT_MS),
      validateStatus: () => true,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Gateway → ${baseUrl}${path} failed:`, error.message);

    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
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
