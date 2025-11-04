import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from "discord.js";

// ✅ Initialisation d’Express
const app = express();

// Pour pouvoir utiliser __dirname avec les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware JSON
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// ✅ Log basique des requêtes API
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;

  res.on("finish", () => {
    if (pathReq.startsWith("/api") || pathReq.startsWith("/submit")) {
      const duration = Date.now() - start;
      console.log(`${req.method} ${pathReq} ${res.statusCode} - ${duration}ms`);
    }
  });

  next();
});

// ✅ Initialisation du bot Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// ✅ Quand le bot est prêt
client.once("ready", () => {
  console.log(`🤖 Bot connecté en tant que ${client.user?.tag}`);
});

// ✅ Envoi d’un MP avec un bouton quand une personne rejoint le serveur
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const button = new ButtonBuilder()
      .setLabel("Visiter le site 🌐")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discordbotroblox-ewms.onrender.com");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await member.send({
      content: `👋 Bienvenue ${member.user.username} !\nClique sur le bouton ci-dessous pour visiter notre site :`,
      components: [row],
    });

    console.log(`✅ Message privé envoyé à ${member.user.tag}`);
  } catch (error) {
    console.error("❌ Impossible d'envoyer le MP :", error);
  }
});

// ✅ Route POST /submit → Envoie le message dans Discord
app.post("/submit", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    console.log("🧾 Message reçu du site :", message);

    // 🔹 Remplace cet ID par l’ID du salon ou du fil de discussion Discord
    const channelId = "123456789012345678"; // <--- à modifier !
    const channel = await client.channels.fetch(channelId);

    if (channel?.isTextBased()) {
      await channel.send(`📩 Nouveau message du site :\n${message}`);
    } else {
      console.error("❌ Salon introuvable ou non textuel");
    }

    return res.json({ success: true, message: "Message envoyé à Discord !" });
  } catch (err) {
    console.error("❌ Erreur /submit :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Gestion du front-end (client Vite buildé)
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// ✅ Redirige toutes les routes vers index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ✅ Gestion des erreurs globales
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error("❌ Server Error:", err);
});

// ✅ Connexion du bot + lancement serveur
(async () => {
  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log("✅ Bot Discord connecté");

    const port = parseInt(process.env.PORT || "5000", 10);
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Serveur web en ligne sur le port ${port}`);
    });
  } catch (error) {
    console.error("❌ Erreur de démarrage :", error);
  }
})();

