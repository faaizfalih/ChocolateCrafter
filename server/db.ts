import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Simple dummy object to use when no database is available
const dummyDb = {
  select: () => ({ from: () => Promise.resolve([]) }),
  insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
  delete: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }) }),
};

let pool;
let db;

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL not set. Using in-memory storage instead. Database operations will not be available.",
  );
  pool = null;
  db = dummyDb;
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };
