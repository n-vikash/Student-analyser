import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";

import { connectDB, getDB, getCleanURI, getLastError } from "./backend/db.js";
import { initPythonAndFlask } from "./backend/services.js";
import backendRouter from "./backend/routes.js";

// Load Environment variables
dotenv.config();
if (!process.env.MONGODB_URI && fs.existsSync(".env.example")) {
  dotenv.config({ path: ".env.example" });
}

// Spin up companion service asynchronously on boot
initPythonAndFlask();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(cors());

// Initialize Database connection
connectDB();

// Global Diagnostic APIs
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", db: !!getDB() });
});

app.get("/api/db-debug", (req, res) => {
  res.json({
    connected: !!getDB(),
    uriMasked: getCleanURI()?.replace(/\/\/.*@/, "//****:****@"),
    lastError: getLastError()
  });
});

// Modular Routes Registration
app.use("/api", backendRouter);

// Fallback for API routes missing
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.originalUrl });
});

// Orchestrate SPA Vite Middleware (Dev) or Static Assets Serving (Prod)
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
      console.log("[VITE] Operational");
    } catch (err) {
      console.error("[VITE] Init failed:", err);
    }
  } else {
    const distPath = path.resolve("dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[READY] Server active on port ${PORT}`);
  });
}

startApp();
