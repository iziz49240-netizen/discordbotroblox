import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Commands() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const allCommands = [
    {
      name: "!roblox user",
      usage: "!roblox user <username>",
      description: "Affiche les informations détaillées d'un utilisateur Roblox incluant le nom, la date de création, le statut et les badges vérifiés.",
      category: "Utilisateur",
      example: "!roblox user Builderman",
    },
    {
      name: "!roblox game",
      usage: "!roblox game <game_name>",
      description: "Recherche un jeu Roblox populaire et affiche ses statistiques : créateur, nombre de joueurs actifs, visites totales et prix.",
      category: "Jeux",
      example: "!roblox game Adopt Me",
    },
    {
      name: "!roblox help",
      usage: "!roblox help",
      description: "Affiche la liste complète de toutes les commandes disponibles avec leurs descriptions et exemples d'utilisation.",
      category: "Aide",
      example: "!roblox help",
    },
    {
      name: "!roblox stats",
      usage: "!roblox stats",
      description: "Affiche les statistiques d'utilisation du bot : nombre de serveurs, utilisateurs actifs et commandes exécutées aujourd'hui.",
      category: "Informations",
      example: "!roblox stats",
    },
  ];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(allCommands.map((cmd) => cmd.category)));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Référence des Commandes</h1>
          <p className="text-lg text-muted-foreground">
            Découvre toutes les commandes disponibles pour RobloxBot
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une commande..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-commands"
            />
          </div>
        </div>

        {categories.map((category) => {
          const categoryCommands = filteredCommands.filter(
            (cmd) => cmd.category === category
          );

          if (categoryCommands.length === 0) return null;

          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                {category}
                <Badge variant="secondary">{categoryCommands.length}</Badge>
              </h2>

              <div className="grid gap-6">
                {categoryCommands.map((cmd, index) => (
                  <Card
                    key={index}
                    className="p-6 md:p-8"
                    data-testid={`card-command-${category}-${index}`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{cmd.name}</h3>
                          <Badge className="mb-4">{cmd.category}</Badge>
                        </div>
                      </div>

                      <div className="bg-muted rounded-md p-4 font-mono text-sm flex items-center justify-between gap-2">
                        <code>{cmd.usage}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => copyToClipboard(cmd.usage)}
                          data-testid={`button-copy-${category}-${index}`}
                        >
                          {copiedCommand === cmd.usage ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <p className="text-muted-foreground">{cmd.description}</p>

                      <div className="pt-2 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground font-medium">Exemple: </span>
                          <code className="font-mono text-primary bg-muted px-2 py-1 rounded">
                            {cmd.example}
                          </code>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {filteredCommands.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Aucune commande trouvée pour "{searchQuery}"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
