import { Pool } from "pg";
import requireEnv from "../utils/require-env.ts";

const pool = new Pool({
  user: requireEnv("DB_USER"),
  host: requireEnv("DB_HOST"),
  database: requireEnv("DB_NAME"),
  password: requireEnv("DB_PASSWORD"),
  port: parseInt(requireEnv("DB_PORT"), 10),
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
