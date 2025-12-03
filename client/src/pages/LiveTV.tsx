import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/VideoPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Radio } from "lucide-react";
import { Link } from "wouter";

interface Channel {
  tvgId: string;
  logo: string;
  category: string;
  name: string;
  streamUrl: string;
}

export default function LiveTV() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar canais do JSON estático
    fetch("/channels.json")
      .then((res) => res.json())
      .then((data: Channel[]) => {
        setChannels(data);
        
        // Extrair categorias únicas
        const uniqueCategories = ["Todos", ...Array.from(new Set(data.map((ch) => ch.category).filter(Boolean)))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar canais:", error);
        setLoading(false);
      });
  }, []);

  const filteredChannels =
    activeCategory === "Todos"
      ? channels
      : channels.filter((ch) => ch.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Radio className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando canais...</p>
        </div>
      </div>
    );
  }

  if (selectedChannel) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container max-w-6xl">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setSelectedChannel(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para canais
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer
                src={selectedChannel.streamUrl}
                type="hls"
                poster={selectedChannel.logo || undefined}
              />
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedChannel.logo && (
                      <img
                        src={selectedChannel.logo}
                        alt={selectedChannel.name}
                        className="h-8 w-8 object-contain"
                      />
                    )}
                    {selectedChannel.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Categoria: {selectedChannel.category || "Geral"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Canais Relacionados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredChannels.slice(0, 10).map((channel) => (
                    <Button
                      key={channel.tvgId}
                      variant={
                        channel.tvgId === selectedChannel.tvgId
                          ? "default"
                          : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedChannel(channel)}
                    >
                      {channel.logo && (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="h-6 w-6 object-contain mr-2"
                        />
                      )}
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">TV ao Vivo 📺</h1>
              <p className="text-muted-foreground mt-1">
                {channels.length} canais brasileiros disponíveis
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          {/* Categorias */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex-wrap h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid de Canais */}
      <div className="container py-8">
        {filteredChannels.length === 0 ? (
          <div className="text-center py-12">
            <Radio className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Nenhum canal encontrado nesta categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredChannels.map((channel) => (
              <Card
                key={channel.tvgId}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedChannel(channel)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Radio className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm truncate">
                    {channel.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {channel.category || "Geral"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
