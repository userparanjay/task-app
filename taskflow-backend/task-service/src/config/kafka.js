
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "task-service",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();