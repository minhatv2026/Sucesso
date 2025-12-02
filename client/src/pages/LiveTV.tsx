import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChannelCard from "@/components/ChannelCard";
import VideoPlayer from "@/components/VideoPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function LiveTV() {
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const { data: categories } = trpc.categories.listByType.useQuery({ type: "channel" });
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: channels } = trpc.channels.listByCategory.useQuery(
    { categoryId: activeCategory || categories?.[0]?.id || 1 },
    { enabled: !!(activeCategory || categories?.[0]?.id) }
  );

  const { data: currentChannel } = trpc.channels.getById.useQuery(
    { id: selectedChannel! },
    { enabled: !!selectedChannel }
  );

  const { data: epg } = trpc.channels.getEpg.useQuery(
    { channelId: selectedChannel! },
    { enabled: !!selectedChannel }
  );

  if (selectedChannel && currentChannel) {
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
                src={currentChannel.streamUrl}
                type="hls"
                poster={currentChannel.icon || undefined}
              />

              <div className="mt-4">
                <h1 className="text-2xl font-bold">{currentChannel.name}</h1>
                {currentChannel.quality && (
                  <p className="text-muted-foreground">Qualidade: {currentChannel.quality}</p>
                )}
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Programação</CardTitle>
                </CardHeader>
                <CardContent>
                  {epg && epg.length > 0 ? (
                    <div className="space-y-4">
                      {epg.map((program) => (
                        <div key={program.id} className="border-l-2 border-primary pl-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <span>{program.startTime}</span>
                            <span>-</span>
                            <span>{program.endTime}</span>
                          </div>
                          <h3 className="font-semibold">{program.title}</h3>
                          {program.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {program.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma programação disponível</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">TV ao Vivo</h1>
          <Button variant="outline" asChild>
            <Link href="/">
              <a>Voltar ao Início</a>
            </Link>
          </Button>
        </div>

        <Tabs 
          value={activeCategory?.toString() || categories?.[0]?.id.toString()} 
          onValueChange={(value) => setActiveCategory(parseInt(value))}
        >
          <TabsList className="mb-6 flex-wrap h-auto">
            {categories?.map((category) => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.id.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels?.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    id={channel.id}
                    name={channel.name}
                    icon={channel.icon || undefined}
                    quality={channel.quality || undefined}
                    onClick={() => setSelectedChannel(channel.id)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
