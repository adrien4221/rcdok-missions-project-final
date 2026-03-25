import { drizzle } from "drizzle-orm/postgres-js"; 
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("DB_CONNECTION_STRING is not defined in .env.local");
}

const client = postgres(connectionString);

export const db = drizzle(client);