import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';

// Simple dummy object to use when no database is available
const dummyDb = {
  select: () => ({ from: () => Promise.resolve([]) }),
  insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
  delete: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }) }),
};

// Read the DATABASE_URL directly from the .env file
let databaseUrl: string | undefined;
try {
  const envFilePath = path.resolve(process.cwd(), '.env');
  const envFile = fs.readFileSync(envFilePath, 'utf8');
  const match = envFile.match(/DATABASE_URL=([^\r\n]+)/);
  if (match && match[1]) {
    databaseUrl = match[1];
    console.log("Found DATABASE_URL in .env file:", databaseUrl);
  } else {
    console.log("DATABASE_URL not found in .env file");
  }
} catch (error) {
  console.error("Error reading .env file:", error);
}

console.log("DATABASE_URL environment variable:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("Using database URL:", databaseUrl || process.env.DATABASE_URL || "none");

let pool;
let db;

// Check if we have a database URL
if (!databaseUrl && !process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL not set. Using in-memory storage instead. Database operations will not be available.",
  );
  pool = null;
  db = dummyDb;
} else {
  const connectionString = databaseUrl || process.env.DATABASE_URL || "";
  console.log(`Connecting to database: ${connectionString.split('@')[1]}`);
  
  try {
    // For local Supabase PostgreSQL - use pg directly without any WebSocket
    console.log("Connecting to PostgreSQL using node-postgres driver");
    
    // Create pool with standard configuration
    const poolConfig = { 
      connectionString,
      ssl: false
    };
    
    console.log("Pool config:", JSON.stringify(poolConfig, null, 2));
    
    pool = new Pool(poolConfig);
    
    // Log pool events
    pool.on('connect', (client) => {
      console.log('New client connected to PostgreSQL');
    });
    
    pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
    
    db = drizzle(pool, { schema });
    
    // Test the connection
    console.log("Testing database connection...");
    
    // Use an async function with proper error handling for connection testing
    (async () => {
      try {
        const result = await pool.query('SELECT NOW()');
        console.log("Successfully connected to PostgreSQL database at:", result.rows[0].now);
      } catch (err: any) {
        console.error("Database connection error:", err.message);
        console.error("Full error:", err);
      }
    })();
    
    console.log("Database connection initialized");
  } catch (error) {
    console.error("Error connecting to database:", error);
    console.warn("Falling back to in-memory storage");
    pool = null;
    db = dummyDb;
  }
}

export { pool, db };
