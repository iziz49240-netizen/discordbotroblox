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
      const duration = Date.now() - start;
      console.log(`${req.method} ${pathReq} ${res.statusCode} - ${duration}ms`);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // ✅ Ajout de la route POST /submit pour corriger "Cannot POST /submit"
  app.post("/submit", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message manquant" });
      }

      console.log("🧾 Message reçu depuis le site :", message);

      // Si tu veux l’envoyer à ton bot Discord, tu peux ajouter ici :
      // await client.channels.cache.get("ID_DU_CHANNEL").send(message);

      return res.json({ success: true, message: "Message bien reçu !" });
    } catch (err) {
      console.error("❌ Erreur /submit :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ✅ Sert ta page Vite buildée (client/dist)
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));

  // ✅ Toutes les routes (/, /about, etc.) redirigent vers index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  // Gestion des erreurs
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("❌ Server Error:", err);
  });

  // ✅ Port compatible Render
  const port = parseInt(process.env.PORT || "10000", 10);
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    console.log(`✅ Server running on port ${port}`);
  });
})();


