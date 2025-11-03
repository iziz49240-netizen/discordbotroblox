import { Client, GatewayIntentBits, Message } from "discord.js";
import axios from "axios";
import { storage } from "./storage";
import type { RobloxUserInfo, RobloxGame } from "@shared/schema";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = "!roblox";

async function getRobloxUser(username: string): Promise<RobloxUserInfo | null> {
  try {
    const searchResponse = await axios.post(
      "https://users.roblox.com/v1/usernames/users",
      {
        usernames: [username],
        excludeBannedUsers: false,
      }
    );

    if (!searchResponse.data.data || searchResponse.data.data.length === 0) {
      return null;
    }

    const userId = searchResponse.data.data[0].id;

    const userResponse = await axios.get(
      `https://users.roblox.com/v1/users/${userId}`
    );

    return userResponse.data;
  } catch (error) {
    console.error("Error fetching Roblox user:", error);
    return null;
  }
}

async function searchRobloxGames(gameName: string): Promise<RobloxGame[] | null> {
  try {
    const response = await axios.get(
      `https://games.roblox.com/v1/games/list`,
      {
        params: {
          sortToken: "",
          gameFilter: "All",
          timeFilter: "AllTime",
          genreFilter: "All",
          exclusiveStartId: 0,
          sortOrder: "Desc",
          gameSetTargetId: 0,
          keyword: gameName,
          startRows: 0,
          maxRows: 5,
          isKeywordSuggestionEnabled: true,
          contextCountryRegionId: 0,
          contextUniverseId: 0,
          pageContext: {
            pageId: "SearchResults",
            isSeeAllPage: true,
          },
          sortPosition: 0,
        },
      }
    );

    return response.data.games || [];
  } catch (error) {
    console.error("Error searching Roblox games:", error);
    return null;
  }
}

client.on("ready", () => {
  console.log(`✅ Bot Discord connecté en tant que ${client.user?.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  try {
    if (command === "help") {
      await storage.incrementCommandUsage("!roblox help");
      
      const commands = await storage.getAllCommands();
      const helpMessage = [
        "📚 **Commandes RobloxBot**\n",
        ...commands.map(cmd => `**${cmd.name}**\n└ ${cmd.description}\n└ Usage: \`${cmd.usage}\``),
      ].join("\n");

      await message.reply(helpMessage);
    }
    else if (command === "user") {
      await storage.incrementCommandUsage("!roblox user");
      
      if (args.length === 0) {
        await message.reply("❌ Usage: `!roblox user <username>`");
        return;
      }

      const username = args.join(" ");
      await storage.createRobloxSearch({ username });

      const userInfo = await getRobloxUser(username);

      if (!userInfo) {
        await message.reply(`❌ Utilisateur "${username}" introuvable sur Roblox.`);
        return;
      }

      const embed = {
        color: 0x5865F2,
        title: `👤 ${userInfo.displayName} (@${userInfo.name})`,
        description: userInfo.description || "Aucune description",
        fields: [
          {
            name: "ID Utilisateur",
            value: userInfo.id.toString(),
            inline: true,
          },
          {
            name: "Créé le",
            value: new Date(userInfo.created).toLocaleDateString("fr-FR"),
            inline: true,
          },
          {
            name: "Statut",
            value: userInfo.isBanned ? "❌ Banni" : "✅ Actif",
            inline: true,
          },
        ],
        footer: {
          text: userInfo.hasVerifiedBadge ? "✓ Badge Vérifié" : "",
        },
        timestamp: new Date().toISOString(),
      };

      await message.reply({ embeds: [embed] });
    }
    else if (command === "game") {
      await storage.incrementCommandUsage("!roblox game");
      
      if (args.length === 0) {
        await message.reply("❌ Usage: `!roblox game <game_name>`");
        return;
      }

      const gameName = args.join(" ");
      const games = await searchRobloxGames(gameName);

      if (!games || games.length === 0) {
        await message.reply(`❌ Aucun jeu trouvé pour "${gameName}".`);
        return;
      }

      const game = games[0];
      
      const embed = {
        color: 0x00D26A,
        title: `🎮 ${game.name}`,
        description: game.description.slice(0, 200) + (game.description.length > 200 ? "..." : ""),
        fields: [
          {
            name: "Créateur",
            value: game.creator.name,
            inline: true,
          },
          {
            name: "Joueurs Actifs",
            value: game.playing?.toString() || "N/A",
            inline: true,
          },
          {
            name: "Visites Totales",
            value: game.visits?.toLocaleString() || "N/A",
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      await message.reply({ embeds: [embed] });
    }
    else if (command === "stats") {
      await storage.incrementCommandUsage("!roblox stats");
      
      const stats = await storage.getStats();
      
      const embed = {
        color: 0xFEE75C,
        title: "📊 Statistiques RobloxBot",
        fields: [
          {
            name: "Serveurs",
            value: stats.totalServers.toString(),
            inline: true,
          },
          {
            name: "Utilisateurs Actifs",
            value: stats.activeUsers.toString(),
            inline: true,
          },
          {
            name: "Commandes Aujourd'hui",
            value: stats.commandsToday.toString(),
            inline: true,
          },
          {
            name: "Commande Populaire",
            value: stats.topCommand,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      await message.reply({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Error handling command:", error);
    await message.reply("❌ Une erreur s'est produite lors de l'exécution de la commande.");
  }
});

export function startBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    console.error("❌ DISCORD_BOT_TOKEN n'est pas défini dans les variables d'environnement");
    return;
  }

  client.login(token).catch((error) => {
    console.error("❌ Erreur de connexion au bot Discord:", error);
  });
}

export { client };
