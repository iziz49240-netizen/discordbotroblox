import { type Command, type InsertCommand, type RobloxSearch, type InsertRobloxSearch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllCommands(): Promise<Command[]>;
  getCommand(id: string): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  incrementCommandUsage(name: string): Promise<void>;
  
  getRecentSearches(limit?: number): Promise<RobloxSearch[]>;
  createRobloxSearch(search: InsertRobloxSearch): Promise<RobloxSearch>;
  
  getStats(): Promise<{
    totalServers: number;
    activeUsers: number;
    commandsToday: number;
    topCommand: string;
  }>;
}

export class MemStorage implements IStorage {
  private commands: Map<string, Command>;
  private robloxSearches: Map<string, RobloxSearch>;
  private commandUsageToday: Map<string, number>;

  constructor() {
    this.commands = new Map();
    this.robloxSearches = new Map();
    this.commandUsageToday = new Map();
    
    this.seedCommands();
  }

  private seedCommands() {
    const defaultCommands: InsertCommand[] = [
      {
        name: "!roblox user",
        usage: "!roblox user <username>",
        description: "Affiche les informations détaillées d'un utilisateur Roblox",
        category: "Utilisateur",
      },
      {
        name: "!roblox game",
        usage: "!roblox game <game_name>",
        description: "Recherche un jeu Roblox populaire",
        category: "Jeux",
      },
      {
        name: "!roblox help",
        usage: "!roblox help",
        description: "Affiche la liste de toutes les commandes disponibles",
        category: "Aide",
      },
      {
        name: "!roblox stats",
        usage: "!roblox stats",
        description: "Affiche les statistiques d'utilisation du bot",
        category: "Informations",
      },
    ];

    defaultCommands.forEach((cmd) => {
      const id = randomUUID();
      const command: Command = { ...cmd, id, usageCount: 0 };
      this.commands.set(id, command);
    });
  }

  async getAllCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }

  async getCommand(id: string): Promise<Command | undefined> {
    return this.commands.get(id);
  }

  async createCommand(insertCommand: InsertCommand): Promise<Command> {
    const id = randomUUID();
    const command: Command = { ...insertCommand, id, usageCount: 0 };
    this.commands.set(id, command);
    return command;
  }

  async incrementCommandUsage(name: string): Promise<void> {
    const commands = Array.from(this.commands.values());
    const command = commands.find(cmd => cmd.name === name);
    
    if (command) {
      command.usageCount++;
      this.commands.set(command.id, command);
    }
    
    const currentCount = this.commandUsageToday.get(name) || 0;
    this.commandUsageToday.set(name, currentCount + 1);
  }

  async getRecentSearches(limit = 10): Promise<RobloxSearch[]> {
    const searches = Array.from(this.robloxSearches.values());
    return searches
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createRobloxSearch(insertSearch: InsertRobloxSearch): Promise<RobloxSearch> {
    const id = randomUUID();
    const search: RobloxSearch = {
      ...insertSearch,
      id,
      timestamp: new Date(),
    };
    this.robloxSearches.set(id, search);
    return search;
  }

  async getStats(): Promise<{
    totalServers: number;
    activeUsers: number;
    commandsToday: number;
    topCommand: string;
  }> {
    const commandsToday = Array.from(this.commandUsageToday.values()).reduce((sum, count) => sum + count, 0);
    
    let topCommand = "N/A";
    let maxUsage = 0;
    
    for (const [name, count] of this.commandUsageToday.entries()) {
      if (count > maxUsage) {
        maxUsage = count;
        topCommand = name;
      }
    }

    return {
      totalServers: 12,
      activeUsers: 247,
      commandsToday,
      topCommand,
    };
  }
}

export const storage = new MemStorage();
