import "dotenv/config";
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER],
});

export const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
});

export const producer = kafka.producer();
