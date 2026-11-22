import { getMigrations } from "better-auth/db/migration";
import { Pool } from "pg";

if (!process.env.WEB_DATABASE_URL) throw new Error("Set WEB_DATABASE_URL.");
const database = new Pool({ connectionString: process.env.WEB_DATABASE_URL, options: "-c search_path=tiwalo_web", max: 1 });
try {
  const { rows } = await database.query("SELECT current_schema() AS schema");
  if (rows[0].schema !== "tiwalo_web") throw new Error("Provision the dedicated tiwalo_web schema first.");
  const migrations = await getMigrations({ database }, { throwOnUnsafe: true });
  await migrations.runMigrations();
} finally {
  await database.end();
}
