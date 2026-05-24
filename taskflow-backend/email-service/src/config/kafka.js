import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

export const kafka = new Kafka({
  clientId: "email-service",
  brokers: [process.env.KAFKA_BROKER],
});

export const consumer = kafka.consumer({
  groupId: "email-group-v3",
});

export const producer =
  kafka.producer();