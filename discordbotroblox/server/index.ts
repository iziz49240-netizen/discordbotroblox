import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 10000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

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

// ---- Route de test ---- //
app.get("/", (req, res) => {
  res.send("🚀 Serveur du bot en ligne !");
});

// ---- Route pour le site web ---- //
app.post("/submit", async (req, res) => {
  const { message } = req.body;
  console.log("🧾 Message reçu du site :", message);

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

// ---- Lancement du serveur ---- //
app.listen(PORT, () => {
  console.log(`✅ Serveur web en ligne sur le port ${PORT}`);
});



