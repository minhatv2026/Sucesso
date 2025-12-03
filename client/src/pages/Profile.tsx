// import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Clock, Heart, List, ArrowLeft } from "lucide-react";
import { Link, Redirect } from "wouter";
// import { getLoginUrl } from "@/const";

export default function Profile() {
  const user: { name?: string; email?: string } | null = null; 
  const isAuthenticated = false; 
  const loading = false; 
  const logout = () => {};

  const { data: watchlist } = trpc.watchlist.list.useQuery(undefined, {
    enabled: isAuthenticated
  });

  const { data: history } = trpc.history.list.useQuery(undefined, {
    enabled: isAuthenticated
  });

  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Login required (temporarily disabled)</div>;
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          asChild
        >
          <Link href="/">
            <a>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </a>
          </Link>
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user?.name || "Usuário"}</h1>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                <Button variant="outline" onClick={() => logout()}>
                  Sair
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="watchlist">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="watchlist" className="gap-2">
              <List className="h-4 w-4" />
              Minha Lista
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist">
            <Card>
              <CardHeader>
                <CardTitle>Minha Lista</CardTitle>
              </CardHeader>
              <CardContent>
                {watchlist && watchlist.length > 0 ? (
                  <div className="space-y-4">
                    {watchlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.contentType === "movie" ? "Filme" : "Série"} #{item.contentId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Adicionado em {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = item.contentType === "movie" 
                              ? `/movie/${item.contentId}`
                              : `/series/${item.contentId}`;
                            window.location.href = url;
                          }}
                        >
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Sua lista está vazia
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Visualização</CardTitle>
              </CardHeader>
              <CardContent>
                {history && history.length > 0 ? (
                  <div className="space-y-4">
                    {history.slice(0, 20).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.contentType === "channel" && `Canal #${item.contentId}`}
                            {item.contentType === "movie" && `Filme #${item.contentId}`}
                            {item.contentType === "episode" && `Episódio #${item.contentId}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Assistido em {new Date(item.watchedAt).toLocaleDateString()} às{" "}
                            {new Date(item.watchedAt).toLocaleTimeString()}
                          </p>
                          {item.progress && item.progress > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Progresso: {Math.floor(item.progress / 60)} min
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum histórico de visualização
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                {favorites && favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.contentType === "channel" && `Canal #${item.contentId}`}
                            {item.contentType === "movie" && `Filme #${item.contentId}`}
                            {item.contentType === "series" && `Série #${item.contentId}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Favoritado em {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            let url = "/";
                            if (item.contentType === "channel") url = "/live-tv";
                            if (item.contentType === "movie") url = `/movie/${item.contentId}`;
                            if (item.contentType === "series") url = `/series/${item.contentId}`;
                            window.location.href = url;
                          }}
                        >
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum favorito adicionado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
