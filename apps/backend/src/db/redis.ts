import { Redis } from "ioredis";
import requireEnv from "../utils/require-env.ts";

const redis = new Redis({
  port: parseInt(requireEnv("REDIS_PORT"), 10),
  host: requireEnv("REDIS_HOST"),
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: 1000,
});

redis.on("error", (err) => {
  console.error("Redis client error:", err);
});

export default redis;
