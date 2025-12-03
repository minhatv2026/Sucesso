import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";
import { ArrowLeft, Star, Heart, Plus, Play } from "lucide-react";
import { Link } from "wouter";
// import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function SeriesDetail() {
  const [, params] = useRoute("/series/:id");
  const seriesId = params?.id ? parseInt(params.id) : null;
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const isAuthenticated = false;

  const { data: show } = trpc.series.getById.useQuery(
    { id: seriesId! },
    { enabled: !!seriesId }
  );

  const { data: episodes } = trpc.series.getEpisodes.useQuery(
    { seriesId: seriesId! },
    { enabled: !!seriesId }
  );

  const { data: currentEpisode } = trpc.series.getEpisodeById.useQuery(
    { id: selectedEpisode! },
    { enabled: !!selectedEpisode }
  );

  const addToWatchlist = trpc.watchlist.add.useMutation({
    onSuccess: () => {
      toast.success("Adicionado à sua lista");
    }
  });

  const addToFavorites = trpc.favorites.add.useMutation({
    onSuccess: () => {
      toast.success("Adicionado aos favoritos");
    }
  });

  const addToHistory = trpc.history.add.useMutation();

  const handleProgress = (currentTime: number) => {
    if (isAuthenticated && selectedEpisode) {
      addToHistory.mutate({
        contentType: "episode",
        contentId: selectedEpisode,
        progress: Math.floor(currentTime)
      });
    }
  };

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const genres = typeof show.genres === 'string' ? JSON.parse(show.genres) : show.genres;
  const rating = show.imdbRating ? show.imdbRating / 10 : null;

  // Group episodes by season
  const episodesBySeason = episodes?.reduce((acc, episode) => {
    if (!acc[episode.season]) {
      acc[episode.season] = [];
    }
    acc[episode.season].push(episode);
    return acc;
  }, {} as Record<number, typeof episodes>);

  const seasons = episodesBySeason ? Object.keys(episodesBySeason).map(Number).sort((a, b) => a - b) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        <Button
          variant="ghost"
          className="mb-4"
          asChild
        >
          <Link href="/series">
            <a>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para séries
            </a>
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {show.posterUrl ? (
              <img
                src={show.posterUrl}
                alt={show.title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-muted rounded-lg" />
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{show.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <span>{show.totalSeasons} {show.totalSeasons === 1 ? 'Temporada' : 'Temporadas'}</span>
                <span>{show.totalEpisodes} Episódios</span>
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>

              {show.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {show.description}
                </p>
              )}
            </div>

            {/* Actions */}
            {isAuthenticated && (
              <div className="flex gap-3">
                <Button
                  onClick={() => addToWatchlist.mutate({ 
                    contentType: "series", 
                    contentId: show.id 
                  })}
                  disabled={addToWatchlist.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Minha Lista
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addToFavorites.mutate({ 
                    contentType: "series", 
                    contentId: show.id 
                  })}
                  disabled={addToFavorites.isPending}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritar
                </Button>
              </div>
            )}

            {/* Video Player */}
            {selectedEpisode && currentEpisode && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">{currentEpisode.title}</h2>
                <VideoPlayer
                  src={currentEpisode.streamUrl}
                  type="mp4"
                  poster={show.posterUrl || undefined}
                  onProgress={handleProgress}
                />
              </div>
            )}

            {/* Episodes List */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Episódios</h2>
              <div className="space-y-6">
                {seasons.map((season) => (
                  <div key={season}>
                    <h3 className="text-lg font-semibold mb-3">
                      Temporada {season}
                    </h3>
                    <div className="space-y-2">
                      {episodesBySeason?.[season]?.map((episode) => (
                        <Card 
                          key={episode.id}
                          className={`cursor-pointer transition-all hover:bg-accent ${
                            selectedEpisode === episode.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => setSelectedEpisode(episode.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Play className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  Episódio {episode.episode}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {episode.title}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
