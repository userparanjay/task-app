import express from "express";
import dotenv from "dotenv";
import { startEmailConsumer } from "./consumer/email.consumer.js";

dotenv.config();

const app = express();

app.use(express.json());

startEmailConsumer();

app.listen(process.env.PORT, () => {
  console.log(
    `Email service running on http://localhost:${process.env.PORT}`
  );
});