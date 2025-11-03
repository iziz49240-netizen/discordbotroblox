import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startBot } from "./bot";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/commands", async (_req, res) => {
    try {
      const commands = await storage.getAllCommands();
      res.json(commands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commands" });
    }
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/recent-searches", async (_req, res) => {
    try {
      const searches = await storage.getRecentSearches(10);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent searches" });
    }
  });

  startBot();

  const httpServer = createServer(app);
  return httpServer;
}
