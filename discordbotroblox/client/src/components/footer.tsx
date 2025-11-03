import { SiDiscord, SiGithub } from "react-icons/si";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">À propos</h3>
            <p className="text-muted-foreground text-sm">
              RobloxBot est un bot Discord professionnel qui permet d'afficher les statistiques Roblox, rechercher des jeux et suivre les joueurs directement depuis Discord.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/commands">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Commandes
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connexion</h3>
            <div className="flex gap-4">
              <a
                href="https://discord.gg/example"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center hover-elevate active-elevate-2"
                data-testid="link-discord"
              >
                <SiDiscord className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center hover-elevate active-elevate-2"
                data-testid="link-github"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RobloxBot. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
