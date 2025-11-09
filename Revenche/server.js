// server.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";
if (!DISCORD_WEBHOOK_URL) {
    console.warn("Warning: DISCORD_WEBHOOK_URL is not set in env. Webhook posts will fail.");
}

// Route form : sert le fichier form.html (utilise query ?user_id=)
app.get("/form", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "form.html"));
});

// Endpoint de réception du formulaire
app.post("/submit", async (req, res) => {
    try {
        const { user_id, roblox_name, message } = req.body;

        if (!roblox_name || !message) {
            return res.status(400).send("Tous les champs sont requis.");
        }

        // Préparer payload pour webhook Discord
        const payload = {
            username: "Formulaire du serveur",
            embeds: [
                {
                    title: "Nouvelle soumission",
                    fields: [
                        { name: "Utilisateur Discord (ID)", value: user_id ? `${user_id}` : "Inconnu", inline: true },
                        { name: "Pseudo Roblox", value: roblox_name, inline: true },
                        { name: "Message", value: message, inline: false }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        };

        // Envoi au webhook
        if (DISCORD_WEBHOOK_URL) {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            console.error("DISCORD_WEBHOOK_URL non configuré – skipping webhook send");
        }

        // Réponse à l'utilisateur
        res.send(`
      <html><body style="font-family:Arial,Helvetica,sans-serif; padding:40px; background:#0f0f10; color:#fff">
        <h2>Merci — votre formulaire a été envoyé ✅</h2>
        <p>Vous pouvez fermer cette page.</p>
      </body></html>
    `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur.");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
