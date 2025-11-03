import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCircle, Gamepad2, Users, ArrowRight, Copy, Check } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useState } from "react";

export default function Home() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const features = [
    {
      icon: UserCircle,
      title: "Statistiques de Joueur",
      description: "Affiche les informations de profil Roblox : nom, date de création, statut et badges vérifiés.",
    },
    {
      icon: Gamepad2,
      title: "Recherche de Jeux",
      description: "Découvre les jeux Roblox populaires avec nombre de joueurs actifs, visites et créateurs.",
    },
    {
      icon: Users,
      title: "Gestion de Groupes",
      description: "Suit les membres et rangs des groupes Roblox directement depuis ton serveur Discord.",
    },
  ];

  const commands = [
    {
      command: "!roblox user <username>",
      description: "Affiche les statistiques d'un utilisateur Roblox",
      example: "!roblox user Builderman",
    },
    {
      command: "!roblox game <game_name>",
      description: "Recherche un jeu Roblox populaire",
      example: "!roblox game Adopt Me",
    },
    {
      command: "!roblox help",
      description: "Affiche la liste de toutes les commandes disponibles",
      example: "!roblox help",
    },
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Invite le bot",
      description: "Clique sur 'Ajouter à Discord' et sélectionne ton serveur.",
    },
    {
      step: 2,
      title: "Configure les permissions",
      description: "Assure-toi que le bot a les permissions de lire et envoyer des messages.",
    },
    {
      step: 3,
      title: "Utilise les commandes",
      description: "Commence à utiliser les commandes !roblox dans ton serveur.",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Bot Discord pour{" "}
                <span className="text-primary">Roblox</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Affiche les statistiques de joueurs, recherche des jeux populaires et suit l'activité Roblox directement depuis Discord.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  data-testid="button-hero-add-discord"
                  asChild
                >
                  <a
                    href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiDiscord className="w-5 h-5 mr-2" />
                    Ajouter à Discord
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  data-testid="button-hero-view-commands"
                  onClick={() => {
                    document.getElementById("commands")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Voir les Commandes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Card className="relative p-8 hover-elevate">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
                      <SiDiscord className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">RobloxBot</div>
                      <div className="text-sm text-muted-foreground">Bot</div>
                    </div>
                  </div>
                  <div className="bg-muted rounded-md p-4 font-mono text-sm">
                    <div className="text-primary font-semibold mb-2">!roblox user Builderman</div>
                    <div className="text-muted-foreground">
                      Récupération des informations...
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Toutes les fonctionnalités dont tu as besoin pour intégrer Roblox dans Discord
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 md:p-8 hover-elevate transition-transform hover:-translate-y-1"
                data-testid={`card-feature-${index}`}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="commands" className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Commandes</h2>
            <p className="text-muted-foreground text-lg">
              Voici toutes les commandes disponibles pour RobloxBot
            </p>
          </div>

          <div className="space-y-4">
            {commands.map((cmd, index) => (
              <Card
                key={index}
                className="p-6 md:p-8"
                data-testid={`card-command-${index}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="font-mono text-sm bg-muted px-3 py-1 rounded-md">
                        {cmd.command}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(cmd.command)}
                        data-testid={`button-copy-command-${index}`}
                      >
                        {copiedCommand === cmd.command ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-2">{cmd.description}</p>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Exemple: </span>
                      <code className="font-mono text-primary">{cmd.example}</code>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Installation</h2>
            <p className="text-muted-foreground text-lg">
              Commence en 3 étapes simples
            </p>
          </div>

          <div className="space-y-6">
            {setupSteps.map((step) => (
              <Card
                key={step.step}
                className="p-6 md:p-8 flex gap-6"
                data-testid={`card-setup-${step.step}`}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              data-testid="button-setup-add-discord"
              asChild
            >
              <a
                href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiDiscord className="w-5 h-5 mr-2" />
                Commencer Maintenant
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
