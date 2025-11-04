import express from "express";
import { setupVite, serveStatic } from "./vite"; // ✅ On a supprimé 'log'

// Petit logger local optionnel
const log = (...args: any[]) => console.log("[Server]", ...args);

export async function createServer() {
  const app = express();

  // En production → on sert les fichiers du dossier build
  if (process.env.NODE_ENV === "production") {
    log("🚀 Mode production activé - serving static files");
    serveStatic(app);
  } else {
    log("💻 Mode développement activé - setup Vite");
    await setupVite(app);
  }

  const port = process.env.PORT || 10000;
  app.listen(port, () => {
    log(`✅ Serveur lancé sur le port ${port}`);
  });
}

