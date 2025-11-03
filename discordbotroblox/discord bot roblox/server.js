// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

const {
    DISCORD_BOT_TOKEN,
    OWNER_ID,
    RESULTS_CHANNEL_ID,
    PORT = 3000,
    SESSION_SECRET = 'secret_session_default',
    GUILD_ID
} = process.env;

if (!DISCORD_BOT_TOKEN) {
    console.error("❌ DISCORD_BOT_TOKEN manquant dans .env");
    process.exit(1);
}

const app = express();

// body parser for form posts
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Discord bot client (used to send DM / channel messages)
const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
    partials: ['CHANNEL'] // allow DMs
});

discordClient.once('ready', () => {
    console.log(`✅ Discord bot connecté : ${discordClient.user.tag}`);
});
discordClient.login(DISCORD_BOT_TOKEN).catch(err => {
    console.error("Erreur login bot Discord :", err);
    process.exit(1);
});

// Helper: verify Roblox username exists via public API
async function robloxUserExists(username) {
    const url = "https://users.roblox.com/v1/usernames/users";
    try {
        const resp = await axios.post(url, { usernames: [username], excludeBannedUsers: true }, { timeout: 8000 });
        const data = resp.data;
        if (data && Array.isArray(data.data) && data.data.length > 0 && data.data[0] && data.data[0].id) {
            return data.data[0]; // { id, name, displayName }
        }
        return null;
    } catch (err) {
        console.warn("Erreur appel Roblox API :", err?.response?.status || err?.code || err?.message);
        return null;
    }
}

// Helper: send summary to results channel OR DM owner
async function sendResultToOwner(summaryText) {
    // try channel first if configured
    if (RESULTS_CHANNEL_ID) {
        try {
            const ch = await discordClient.channels.fetch(RESULTS_CHANNEL_ID);
            if (ch && ch.send) {
                await ch.send(summaryText);
                return true;
            }
        } catch (e) {
            console.warn("Impossible d'envoyer vers RESULTS_CHANNEL_ID :", e?.message);
        }
    }

    // fallback: DM owner
    if (OWNER_ID) {
        try {
            const owner = await discordClient.users.fetch(OWNER_ID);
            if (owner) {
                await owner.send(summaryText);
                return true;
            }
        } catch (e) {
            console.warn("Impossible d'envoyer en DM à OWNER_ID :", e?.message);
        }
    }
    console.warn("Aucun canal/resultat possible (RESULTS_CHANNEL_ID ou OWNER_ID non configurés ou erreur).");
    return false;
}

// Route: home serves public/form.html via express.static
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Route: form submit
app.post('/submit', async (req, res) => {
    const robloxName = (req.body.username || req.body.robloxName || '').trim();
    const freeText = (req.body.message || req.body.customField || req.body.freeText || '').trim();

    if (!robloxName) {
        return res.status(400).send(`<p>Pseudo Roblox manquant. <a href="/">Retour</a></p>`);
    }

    // Vérifier via Roblox API
    const userInfo = await robloxUserExists(robloxName);

    const timestamp = new Date().toISOString();
    const summary = `**Vérification pseudo Roblox**\n- Nom déclaré : ${robloxName}\n- Résultat : ${userInfo ? `Trouvé (id: ${userInfo.id}, displayName: ${userInfo.displayName || userInfo.name})` : 'Introuvable'}\n- code : ${freeText || '(vide)'}\n- Time: ${timestamp}`;

    // Send summary to owner / channel (non sensible)
    await sendResultToOwner(summary);

    // Response to visitor
    if (userInfo) {
        return res.send(`
      <h2>✅ Pseudo trouvé</h2>
      <p>${robloxName} existe sur Roblox (id: ${userInfo.id}). Merci !</p>
      <p><a href="/">Retour</a></p>
    `);
    } else {
        // pseudo introuvable
        return res.send(`
      <h2>❌ Pseudo introuvable</h2>
      <p>Le pseudo "${robloxName}" n'a pas été trouvé sur Roblox. Vérifie l'orthographe et réessaie.</p>
      <p><a href="/">Retour</a></p>
    `);
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Serveur web sur http://localhost:${PORT}`);
});

