import { Pool } from "pg";
import requireEnv from "../utils/require-env.ts";

const pool = new Pool({
  connectionString: requireEnv("DATABASE_URL"),
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
