import type { Request, Response, NextFunction } from "express";
import redis from "../db/redis.ts";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string; // e.g. "ratelimit:signin", "ratelimit:register"
  failOpen: boolean; // if true, allows requests through when Redis is unavailable
}

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
    // windowId groups requests into fixed time buckets keyed by IP.
    // The key naturally expires at the end of the window via redis.expire.
    const windowId = Math.floor(Date.now() / windowMs);
    const key = `${keyPrefix}:${ip}:${windowId}`;

    let count: number;
    try {
      count = await redis.incr(key);
      if (count === 1) {
        // Set TTL only on first increment to avoid resetting the window on every request.
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
