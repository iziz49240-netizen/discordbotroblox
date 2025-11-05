import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG (à mettre dans Render -> Environment)
const PORT = process.env.PORT || 10000;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI; // ex: https://your-app.onrender.com/auth/discord/callback
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const BOT_TOKEN = process.env.DISCORD_TOKEN; // si tu veux envoyer MP via le bot

// === bot (si tu veux envoyer MP via le bot) ===
const botClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
  partials: ["CHANNEL"],
});
if (BOT_TOKEN) {
  botClient.login(BOT_TOKEN).then(() => console.log("✅ Bot Discord connecté (pour MP si nécessaire)")).catch(console.error);
}

// === servir le client (build) ===
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../client/dist/index.html")));

// === 1) Déclencher OAuth : redirect vers Discord ===
app.get("/auth/discord", (req, res) => {
  const state = Math.random().toString(36).slice(2); // optionnel : stocker pour vérifier l'état
  const scope = encodeURIComponent("identify email"); // scopes souhaités
  const redirect = encodeURIComponent(DISCORD_REDIRECT_URI);
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=${scope}&prompt=consent`;
  res.redirect(url);
});

// === 2) Callback OAuth (échange code -> token -> user info) ===
app.get("/auth/discord/callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send("Code manquant");

  try {
    // échange code contre token
    const params = new URLSearchParams();
    params.append("client_id", DISCORD_CLIENT_ID || "");
    params.append("client_secret", DISCORD_CLIENT_SECRET || "");
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", DISCORD_REDIRECT_URI || "");

    const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const tokenJson = await tokenResp.json();
    if (!tokenJson.access_token) {
      console.error("No access token", tokenJson);
      return res.status(500).send("Impossible d'obtenir le token");
    }

    // récupère les infos user
    const meResp = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const me = await meResp.json();

    // formatage - envoie un MP via le webhook (ou via le bot si possible)
    const content = `👋 **Nouvelle connexion OAuth**\n**Utilisateur :** ${me.username}#${me.discriminator}\n**ID :** ${me.id}\n**Email :** ${me.email ?? "non fourni"}`;

    // envoie via webhook pour log dans un salon
    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    }

    // Essaye d'envoyer un DM via le bot si possible (optionnel)
    if (botClient && botClient.isReady()) {
      try {
        await botClient.users.send(me.id, {
          content: `Bienvenue ${me.username} ! Voici le lien vers le site : ${process.env.SITE_URL || "/"}`,
        });
        console.log(`✅ DM envoyé à ${me.username}`);
      } catch (dmErr) {
        console.warn("Impossible d'envoyer le DM (utilisateur peut avoir bloqué les MPs)", dmErr);
      }
    }

    // Affiche à l'utilisateur une petite page de confirmation
    res.send(`
      <html>
        <head><meta charset="utf-8"/><title>Connexion réussie</title></head>
        <body style="font-family:Arial,Helvetica,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#0f1724;color:#fff">
          <div style="text-align:center">
            <h1>Connexion réussie ✅</h1>
            <p>Bienvenue <strong>${me.username}#${me.discriminator}</strong></p>
            <p><a href="/">Retour au site</a></p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Erreur callback OAuth:", err);
    res.status(500).send("Erreur serveur OAuth");
  }
});

// === lancement serveur ===
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur ${PORT}`);
});

