import { kafka } from "./kafka.js";
import { TASK_TOPICS } from "./kafkaTopics.js";

export async function ensureTopics() {
  const admin = kafka.admin();

  try {
    await admin.connect();

    const existing = await admin.listTopics();
    const missing = TASK_TOPICS.filter((topic) => !existing.includes(topic));

    if (missing.length === 0) {
      return;
    }

    await admin.createTopics({
      topics: missing.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });

    console.log(`✅ Kafka topics created: ${missing.join(", ")}`);
  } finally {
    await admin.disconnect();
  }
}
