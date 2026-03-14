import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const pool = new Pool({
  ...(process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
});

export const testDatabaseConnection = async (): Promise<void> => {
  await pool.query("SELECT 1");
};

export const getDatabaseTarget = (): string => {
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      return `${parsed.hostname}/${parsed.pathname.replace("/", "") || "neondb"}`;
    } catch {
      return "DATABASE_URL";
    }
  }

  return `${process.env.DB_HOST || "localhost"}/${process.env.DB_NAME || "postgres"}`;
};
