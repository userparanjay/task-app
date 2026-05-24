import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["127.0.0.1:9092"],
});

export const consumer = kafka.consumer({ groupId: "notification-group" });