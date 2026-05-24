
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "task-service",
  brokers: ["127.0.0.1:9092"],
});

export const producer = kafka.producer();