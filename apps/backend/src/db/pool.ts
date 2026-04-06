import { Pool } from "pg";

function requireEnv(name: string) {
  if (!process.env[name]) throw new Error(`${name} is not set`);
  return process.env[name];
}

const pool = new Pool({
  user: requireEnv("DB_USER"),
  host: requireEnv("DB_HOST"),
  database: requireEnv("DB_NAME"),
  password: requireEnv("DB_PASSWORD"),
  port: parseInt(requireEnv("DB_PORT")) || 5432,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
