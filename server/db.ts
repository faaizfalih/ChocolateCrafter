import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';

// Only configure WebSocket for Neon connections
// Don't configure WebSocket for local connections to avoid errors
// neonConfig.webSocketConstructor = ws;

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
    // Check if it's a Neon database (starts with postgres:// or postgresql://)
    const isNeonDb = connectionString.match(/^postgres(ql)?:\/\/.*neon\.tech/);
    
    if (isNeonDb) {
      // Configure WebSocket only for Neon connections
      neonConfig.webSocketConstructor = ws;
      
      // Use Neon serverless driver
      console.log("Using Neon serverless driver");
      pool = new Pool({ connectionString });
      db = drizzle({ client: pool, schema });
    } else {
      // Use regular node-postgres for local Supabase or other PostgreSQL
      console.log("Using node-postgres driver for local PostgreSQL");
      
      // Create pool with extra logging
      const poolConfig = { 
        connectionString,
        connectionTimeoutMillis: 5000, // 5 seconds
        idleTimeoutMillis: 30000, // 30 seconds
      };
      console.log("Pool config:", JSON.stringify(poolConfig, null, 2));
      
      pool = new Pool(poolConfig);
      
      // Log pool events
      pool.on('connect', (client) => {
        console.log('New client connected to PostgreSQL');
      });
      
      pool.on('error', (err, client) => {
        console.error('Unexpected error on idle PostgreSQL client', err);
      });
      
      db = drizzleNode(pool, { schema });
    }
    
    // Test the connection
    console.log("Testing database connection...");
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error("Database connection error:", err.message);
        console.error("Full error:", err);
      } else {
        console.log("Successfully connected to PostgreSQL database at:", res.rows[0].now);
      }
    });
    
    console.log("Database connection initialized");
  } catch (error) {
    console.error("Error connecting to database:", error);
    console.warn("Falling back to in-memory storage");
    pool = null;
    db = dummyDb;
  }
}

export { pool, db };
