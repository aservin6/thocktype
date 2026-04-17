import type { Request, Response, NextFunction } from "express";
import redis from "../db/redis.ts";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string; // ex: "ratelimit:signin", "ratelimit:register"
  failOpen: boolean;
}

// takes config, returns Express middleware
// Usage: app.use("/auth/signin", createRateLimiter({ windowMs: 900000, max: 10, keyPrefix: "ratelimit:signin" }))
export function createRateLimiter({
  windowMs,
  max,
  keyPrefix,
  failOpen,
}: RateLimitConfig) {
  return async function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const ip = req.ip;
    const windowId = Math.floor(Date.now() / windowMs);
    const key = `${keyPrefix}:${ip}:${windowId}`;

    let count: number;
    try {
      count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }

      if (count > max) {
        const timeRemaining: number = (windowId + 1) * windowMs - Date.now();
        const retryAfter = Math.ceil(timeRemaining / 1000).toString();
        res
          .status(429)
          .set("Retry-After", retryAfter)
          .json({
            message: `Too many requests. Please try again in ${retryAfter} seconds.`,
          });
        return;
      }
      next();
    } catch (err) {
      failOpen ? next() : next(err);
    }
  };
}
