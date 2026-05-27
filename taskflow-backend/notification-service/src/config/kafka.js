import "dotenv/config";
import { Kafka } from "kafkajs";
import { requireEnv, validateKafkaEnv } from "./env.js";

validateKafkaEnv();

export const kafka = new Kafka({
  clientId: requireEnv("KAFKA_CLIENT_ID"),
  brokers: [requireEnv("KAFKA_BROKER")],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: requireEnv("KAFKA_CONSUMER_GROUP_ID"),
});
