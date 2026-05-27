import "dotenv/config";
import { Kafka } from "kafkajs";
import { requireEnv, validateKafkaEnv } from "./env.js";

validateKafkaEnv();

export const kafka = new Kafka({
  clientId: requireEnv("KAFKA_CLIENT_ID"),
  brokers: [requireEnv("KAFKA_BROKER")],
});

export const producer = kafka.producer();

let producerConnected = false;

export async function connectProducer() {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
    console.log("✅ Kafka producer connected (task-service)");
  }
}
