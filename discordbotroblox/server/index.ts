import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const app = express();

// Pour pouvoir utiliser __dirname avec les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware JSON
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Log basique des requêtes API
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;

  res.on("finish", () => {
    if (pathReq.startsWith("/api")) {
      const duration = Date

