import "dotenv/config";
import express from "express";
import { startEmailConsumer } from "./consumer/email.consumer.js";
import { connectRedis } from "./config/redis.js";

const app = express();

app.use(express.json());

async function startServer() {
  await connectRedis();
  await startEmailConsumer();

  app.listen(process.env.PORT, () => {
    console.log(
      `Email service running on http://localhost:${process.env.PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start email-service:", error.message);
  process.exit(1);
});