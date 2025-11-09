// bot/index.js
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once("ready", () => {
    console.log(`Bot prêt : ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
    try {
        const siteUrl = `${process.env.SITE_BASE_URL || "https://ton-site.onrender.com"}/form?user_id=${member.id}`;
        const text = `Bienvenue ${member.user.username} ! 🎉\nMerci de remplir ce formulaire pour être présenté au serveur :\n${siteUrl}\n\n(Important : ne partage pas ton mot de passe ou tes informations sensibles.)`;

        await member.send(text);
        console.log(`DM envoyé à ${member.user.tag}`);
    } catch (err) {
        console.warn(`Impossible d'envoyer un DM à ${member.user.tag} :`, err.message);
    }
});

client.login(process.env.BOT_TOKEN);
