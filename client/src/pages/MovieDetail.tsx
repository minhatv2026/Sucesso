import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "@/components/VideoPlayer";
import { ArrowLeft, Star, Clock, Calendar, Heart, Plus } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function MovieDetail() {
  const [, params] = useRoute("/movie/:id");
  const movieId = params?.id ? parseInt(params.id) : null;
  const { isAuthenticated } = useAuth();

  const { data: movie } = trpc.movies.getById.useQuery(
    { id: movieId! },
    { enabled: !!movieId }
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
    if (isAuthenticated && movieId) {
      addToHistory.mutate({
        contentType: "movie",
        contentId: movieId,
        progress: Math.floor(currentTime)
      });
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres) : movie.genres;
  const rating = movie.imdbRating ? movie.imdbRating / 10 : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        <Button
          variant="ghost"
          className="mb-4"
          asChild
        >
          <Link href="/movies">
            <a>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para filmes
            </a>
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-muted rounded-lg" />
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                {movie.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.year}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration}</span>
                  </div>
                )}
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

              {movie.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              )}
            </div>

            {/* Actions */}
            {isAuthenticated && (
              <div className="flex gap-3">
                <Button
                  onClick={() => addToWatchlist.mutate({ 
                    contentType: "movie", 
                    contentId: movie.id 
                  })}
                  disabled={addToWatchlist.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Minha Lista
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addToFavorites.mutate({ 
                    contentType: "movie", 
                    contentId: movie.id 
                  })}
                  disabled={addToFavorites.isPending}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritar
                </Button>
              </div>
            )}

            {/* Video Player */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Assistir Agora</h2>
              <VideoPlayer
                src={movie.streamUrl}
                type="mp4"
                poster={movie.posterUrl || undefined}
                onProgress={handleProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
