import { Redis } from "ioredis";
import requireEnv from "../utils/require-env.ts";

const redis = new Redis({
  port: parseInt(requireEnv("REDIS_PORT"), 10),
  host: requireEnv("REDIS_HOST"),
});

redis.on("error", (err) => {
  console.error("Redis client error:", err.message);
});

export default redis;
