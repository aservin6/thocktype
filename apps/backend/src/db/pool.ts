import { Pool } from "pg";
import requireEnv from "../utils/require-env.ts";

const databaseUrl = requireEnv("DATABASE_URL");

const pool = new Pool({
  connectionString: databaseUrl,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
