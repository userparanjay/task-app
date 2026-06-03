import client from "prom-client";
import responseTime from "response-time";

client.collectDefaultMetrics({ register: client.register });

export const reqResTime = new client.Histogram({
  name: "http_express_req_res",
  help: "this is to get req-res time",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 600, 800],
});

export function registerMetricsMiddleware(app) {
  app.use(
    responseTime((req, res, time) => {
      reqResTime
        .labels({
          method: req.method,
          route: req.url,
          status_code: res.statusCode,
        })
        .observe(time);
    })
  );
}

export function registerMetricsRoute(app) {
  app.get("/meterics", async (_req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  });
}
