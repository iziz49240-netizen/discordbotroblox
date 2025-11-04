import express from "express";
import path from "path";
import { fileURLToPath } from "url";

export async function setupVite(app: any) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  if (process.env.NODE_ENV === "production") {
    // 👉 Sert les fichiers du dossier client/dist (build frontend)
    const distPath = path.join(__dirname, "../client/dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // 👉 Mode développement : simple message
    console.log("✅ Vite setup skipped in development mode");
  }
}
