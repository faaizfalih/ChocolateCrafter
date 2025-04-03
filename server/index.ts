// Import dotenv at the top to load environment variables before other imports
import dotenv from 'dotenv';
const result = dotenv.config();
console.log("Loading .env file:", result.error ? "Error: " + result.error : "Success");
console.log("Loaded environment variables:", Object.keys(process.env).filter(key => 
  key === 'DATABASE_URL' || key === 'SUPABASE_URL' || key === 'SUPABASE_ANON_KEY'
));

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import next from "next";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import fs from "fs";
import path from "path";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "./client" });
const nextHandler = nextApp.getRequestHandler();

// Ensure attached_assets directory exists
const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
if (!fs.existsSync(attachedAssetsDir)) {
  console.log(`Creating attached_assets directory at ${attachedAssetsDir}`);
  fs.mkdirSync(attachedAssetsDir, { recursive: true });
}

nextApp.prepare().then(async () => {
  const app = express();

  // Apply middleware
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  
  // Add security headers, but exclude certain paths from CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["'self'", "https://api.mapbox.com"],
          imgSrc: ["'self'", "data:", "blob:", "https://api.mapbox.com"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          frameSrc: ["'self'", "https://www.google.com"],
        },
      },
    })
  );
  
  // Disable CSP for development
  if (dev) {
    app.use((req, res, next) => {
      res.removeHeader('Content-Security-Policy');
      next();
    });
  }

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        // Show full log line without truncation

        log(logLine);
      }
    });

    next();
  });

  const httpServer = await registerRoutes(app);

  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
