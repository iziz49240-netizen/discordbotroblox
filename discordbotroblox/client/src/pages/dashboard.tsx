import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Activity, Server, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<{
    totalServers: number;
    activeUsers: number;
    commandsToday: number;
    topCommand: string;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: recentSearches, isLoading: isLoadingSearches } = useQuery<
    Array<{ id: string; username: string; timestamp: string }>
  >({
    queryKey: ["/api/recent-searches"],
  });

  const statsCards = [
    {
      title: "Serveurs Totaux",
      value: stats?.totalServers ?? 0,
      icon: Server,
      description: "Serveurs utilisant le bot",
    },
    {
      title: "Utilisateurs Actifs",
      value: stats?.activeUsers ?? 0,
      icon: Users,
      description: "Utilisateurs actifs aujourd'hui",
    },
    {
      title: "Commandes Aujourd'hui",
      value: stats?.commandsToday ?? 0,
      icon: Activity,
      description: "Commandes exécutées",
    },
    {
      title: "Commande Populaire",
      value: stats?.topCommand ?? "N/A",
      icon: TrendingUp,
      description: "Commande la plus utilisée",
      isText: true,
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Vue d'ensemble de l'activité de RobloxBot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat, index) => (
            <Card key={index} data-testid={`card-stat-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold" data-testid={`stat-value-${index}`}>
                    {stat.isText ? stat.value : stat.value.toLocaleString()}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recherches Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSearches ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSearches && recentSearches.length > 0 ? (
              <div className="space-y-4">
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg hover-elevate"
                    data-testid={`search-item-${search.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium" data-testid={`search-username-${search.id}`}>
                          {search.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Recherche utilisateur Roblox
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {new Date(search.timestamp).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune recherche récente
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
