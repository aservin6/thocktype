import { Redis } from "ioredis";
import requireEnv from "../utils/require-env.ts";

const redis = new Redis({
  port: parseInt(requireEnv("REDIS_PORT"), 10),
  host: requireEnv("REDIS_HOST"),
  maxRetriesPerRequest: 1,
  connectTimeout: 1000,
});

let isConnected = true;

redis.on("error", (err) => {
  if (isConnected) {
    console.error("Redis client error:", err);
    isConnected = false;
  }
});

redis.on("ready", () => {
  if (!isConnected) {
    console.log("Redis up and running");
    isConnected = true;
  }
});

export default redis;
