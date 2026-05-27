import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import type { Mode } from "@thockr/shared";

process.env.DATABASE_URL ??=
  "postgres://postgres:postgres@localhost:5432/thockr";

type ResultRepository = typeof import("../repositories/result.repository.ts");

type TestUser = {
  id: string;
  username: string;
};

type TestResultInput = {
  userId: string;
  wpm: number;
  accuracy?: number;
  timeElapsed?: number;
  mode?: Mode;
  modeValue?: number;
  correct?: number;
  incorrect?: number;
  createdAt?: string;
};

let pool: Pool;
let repository: ResultRepository;

beforeAll(async () => {
  const poolModule = await import("../db/pool.ts");
  pool = poolModule.default;
  repository = await import("../repositories/result.repository.ts");
});

beforeEach(async () => {
  await pool.query(
    "TRUNCATE TABLE password_reset_tokens, refresh_tokens, results, users RESTART IDENTITY CASCADE",
  );
});

afterAll(async () => {
  await pool.end();
});

async function insertTestUser(username: string): Promise<TestUser> {
  const result = await pool.query<TestUser>(
    `
      INSERT INTO users (username, email, password_hash, email_verified)
      VALUES ($1, $2, 'test-password-hash', true)
      RETURNING id, username
    `,
    [username, `${username}@thockr.test`],
  );

  return result.rows[0];
}

async function insertTestResult({
  userId,
  wpm,
  accuracy = 95,
  timeElapsed = 30,
  mode = "standard",
  modeValue = 25,
  correct = 100,
  incorrect = 5,
  createdAt = "2026-01-01T00:00:00.000Z",
}: TestResultInput) {
  const result = await pool.query(
    `
      INSERT INTO results (
        user_id,
        wpm,
        time_elapsed,
        accuracy,
        mode,
        mode_value,
        correct,
        incorrect,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
    [
      userId,
      wpm,
      timeElapsed,
      accuracy,
      mode,
      modeValue,
      correct,
      incorrect,
      createdAt,
    ],
  );

  return result.rows[0];
}

describe("leaderboard repository", () => {
  it("returns each user's best result once", async () => {
    const alice = await insertTestUser("alice");
    const bob = await insertTestUser("bob");

    await insertTestResult({ userId: alice.id, wpm: 50 });
    await insertTestResult({ userId: alice.id, wpm: 90 });
    await insertTestResult({ userId: bob.id, wpm: 70 });

    const entries = await repository.selectLeaderboardResults(
      "standard",
      25,
      1,
      25,
    );

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.username)).toEqual(["alice", "bob"]);
    expect(entries.map((entry) => Number(entry.rank))).toEqual([1, 2]);
    expect(Number(entries[0].wpm)).toBe(90);
    expect(Number(entries[1].wpm)).toBe(70);
  });

  it("uses accuracy to break WPM ties", async () => {
    const alice = await insertTestUser("alice");
    const bob = await insertTestUser("bob");

    await insertTestResult({ userId: alice.id, wpm: 100, accuracy: 90 });
    await insertTestResult({ userId: bob.id, wpm: 100, accuracy: 95 });

    const entries = await repository.selectLeaderboardResults(
      "standard",
      25,
      1,
      25,
    );

    expect(entries.map((entry) => entry.username)).toEqual(["bob", "alice"]);
  });

  it("uses elapsed time to break WPM and accuracy ties", async () => {
    const alice = await insertTestUser("alice");
    const bob = await insertTestUser("bob");

    await insertTestResult({
      userId: alice.id,
      wpm: 100,
      accuracy: 95,
      timeElapsed: 30,
    });
    await insertTestResult({
      userId: bob.id,
      wpm: 100,
      accuracy: 95,
      timeElapsed: 25,
    });

    const entries = await repository.selectLeaderboardResults(
      "standard",
      25,
      1,
      25,
    );

    expect(entries.map((entry) => entry.username)).toEqual(["bob", "alice"]);
  });

  it("uses earlier creation time as the final tie-breaker", async () => {
    const alice = await insertTestUser("alice");
    const bob = await insertTestUser("bob");

    await insertTestResult({
      userId: alice.id,
      wpm: 100,
      accuracy: 95,
      timeElapsed: 25,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    await insertTestResult({
      userId: bob.id,
      wpm: 100,
      accuracy: 95,
      timeElapsed: 25,
      createdAt: "2026-01-02T00:00:00.000Z",
    });

    const entries = await repository.selectLeaderboardResults(
      "standard",
      25,
      1,
      25,
    );

    expect(entries.map((entry) => entry.username)).toEqual(["alice", "bob"]);
  });

  it("returns global ranks when paginating", async () => {
    for (let i = 1; i <= 30; i++) {
      const username = `user_${i.toString().padStart(2, "0")}`;
      const user = await insertTestUser(username);
      await insertTestResult({ userId: user.id, wpm: 101 - i });
    }

    const entries = await repository.selectLeaderboardResults(
      "standard",
      25,
      2,
      25,
    );

    expect(entries).toHaveLength(5);
    expect(Number(entries[0].rank)).toBe(26);
    expect(entries[0].username).toBe("user_26");
  });

  it("returns the current user's global entry even when not on the first page", async () => {
    let targetUserId = "";

    for (let i = 1; i <= 30; i++) {
      const username = `user_${i.toString().padStart(2, "0")}`;
      const user = await insertTestUser(username);
      await insertTestResult({ userId: user.id, wpm: 101 - i });

      if (i === 30) targetUserId = user.id;
    }

    const entry = await repository.selectLeaderboardEntryByUser(
      "standard",
      25,
      targetUserId,
    );

    expect(entry).not.toBeNull();
    expect(entry?.username).toBe("user_30");
    expect(Number(entry?.rank)).toBe(30);
  });

  it("counts ranked users, not raw result rows", async () => {
    const alice = await insertTestUser("alice");
    const bob = await insertTestUser("bob");

    await insertTestResult({ userId: alice.id, wpm: 50 });
    await insertTestResult({ userId: alice.id, wpm: 60 });
    await insertTestResult({ userId: bob.id, wpm: 70 });

    const count = await repository.selectLeaderboardEntryCount("standard", 25);

    expect(count).toBe(2);
  });
});
