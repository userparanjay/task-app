/**
 * server.js — API Gateway entry point
 */

import "dotenv/config";
import app from "./app.js";
import client from "prom-client"

const PORT = process.env.PORT;

const collectDefaultMeteric=client.collectDefaultMetrics
collectDefaultMeteric({register:client.register})
app.get('/meterics',async(req,res)=>{
  res.setHeader('Content-Type',client.register.contentType)
  const meterics=await client.register.metrics()
  res.send(meterics)
})

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`Forwarding /api/auth/*  → ${process.env.AUTH_SERVICE_URL}`);
  console.log(`Forwarding /api/tasks/* → ${process.env.TASK_SERVICE_URL}`);
});
