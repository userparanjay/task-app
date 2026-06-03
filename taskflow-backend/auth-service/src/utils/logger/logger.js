import { createLogger, format, transports } from "winston";
import LokiTransport from "winston-loki";

const serviceName = process.env.SERVICE_NAME ?? "auth-service";

function getLokiHost() {
  if (process.env.LOKI_URL) {
    return process.env.LOKI_URL;
  }
  const hostIp = process.env.HOST_IP;
  if (!hostIp) {
    return null;
  }
  const port = process.env.LOKI_PORT ?? "3100";
  return `http://${hostIp}:${port}`;
}

function buildTransports() {
  const list = [
    new transports.Console({
      format: format.combine(format.timestamp(), format.simple()),
    }),
  ];

  const lokiHost = getLokiHost();
  if (lokiHost) {
    list.push(
      new LokiTransport({
        host: lokiHost,
        labels: { service: serviceName, app: "taskflow" },
        json: true,
        replaceTimestamp: true,
        interval: 3,
        batching: true,
        onConnectionError: (err) =>
          console.error(`[${serviceName}] Loki connection error:`, err.message),
      })
    );
    console.info(`[${serviceName}] Loki logging enabled → ${lokiHost}`);
  } else {
    console.warn(
      `[${serviceName}] Loki disabled — set HOST_IP or LOKI_URL in .env`
    );
  }

  return list;
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  defaultMeta: { service: serviceName },
  transports: buildTransports(),
});

export function registerRequestLogger(app) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      logger.info("HTTP request", {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });
    next();
  });
}
