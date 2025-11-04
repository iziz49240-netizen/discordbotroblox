import express from "express";
import { Client, GatewayIntentBits, Partials, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// 👋 Quand un membre rejoint → MP avec lien du site
client.on("guildMemberAdd", async (member) => {
  try {
    const button = new ButtonBuilder()
      .setLabel("Visiter le site 🌐")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discordbotroblox-ewms.onrender.com"); // 🔗 Ton lien Render

    const row = new ActionRowBuilder().addComponents(button);

    await member.send({
      content: `👋 Bienvenue ${member.user.username} !\nClique ci-dessous pour visiter notre site :`,
      components: [row],
    });

    console.log(`✅ MP envoyé à ${member.user.tag}`);
  } catch (error) {
    console.error("❌ Impossible d’envoyer le MP :", error);
  }
});

// ✅ Middleware JSON
app.use(express.json());

// ✅ Route API depuis ton site web
app.post("/submit", async (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).json({ error: "Nom d’utilisateur et message requis." });
  }

  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    if (!channel) return res.status(404).json({ error: "Salon Discord introuvable." });

    await channel.send(`📩 **Message reçu depuis le site :**\n👤 ${username}\n💬 ${message}`);
    res.json({ success: true });
    console.log("✅ Message envoyé sur Discord !");
  } catch (error) {
    console.error("❌ Erreur lors de l’envoi du message :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// ✅ Sert ton site buildé (client/dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientDistPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ✅ Lancement du serveur
app.listen(port, () => {
  console.log(`✅ Serveur web lancé sur le port ${port}`);
});

// ✅ Connexion du bot
client.login(process.env.DISCORD_TOKEN);


