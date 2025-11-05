import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 🧩 Middleware essentiel pour lire le JSON du body :
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ AJOUT IMPORTANT

// 🔧 Configuration
const PORT = process.env.PORT || 10000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// 📁 Correction pour __dirname dans ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Initialisation du bot Discord ---- //
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`🤖 Bot connecté en tant que ${client.user?.tag}`);
});

client
  .login(DISCORD_TOKEN)
  .then(() => console.log("✅ Bot Discord connecté"))
  .catch((err) => console.error("❌ Erreur de connexion du bot :", err));

// ---- Servir le build React ---- //
app.use(express.static(path.join(__dirname, "../client/dist")));

// ---- Route d'accueil ---- //
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ---- Route POST /submit ---- //
app.post("/submit", async (req, res) => {
  console.log("🧾 Corps reçu :", req.body); // 👈 pour debug

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  try {
    if (!WEBHOOK_URL) throw new Error("Webhook non défini");

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📩 **Nouveau message reçu depuis le site web :**\n${message}`,
      }),
    });

    console.log("✅ Message envoyé via le webhook !");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Erreur /submit :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ---- Démarrage du serveur ---- //
app.listen(PORT, () => {
  console.log(`✅ Serveur web en ligne sur le port ${PORT}`);
});
