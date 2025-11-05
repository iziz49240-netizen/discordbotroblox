import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json()); // très important !
app.use(express.urlencoded({ extended: true }));

// 📁 Configuration de base
const PORT = process.env.PORT || 10000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// 📁 Correction pour __dirname dans un module ESM
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

// ---- Servir le frontend React ---- //
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ---- Route POST /submit ---- //
app.post("/submit", async (req, res) => {
  console.log("📥 Requête reçue :", req.body); // <-- debug

  const { message } = req.body;

  if (!message || !message.trim()) {
    console.log("❌ Aucun message reçu !");
    return res.status(400).json({ error: "Message manquant" });
  }

  try {
    if (!WEBHOOK_URL) throw new Error("Webhook non défini");

    // Envoi du message sur Discord via Webhook
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `💬 ${message}`,
      }),
    });

    console.log("✅ Message envoyé sur Discord :", message);
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

