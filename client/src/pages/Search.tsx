import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentCard from "@/components/ContentCard";
import ChannelCard from "@/components/ChannelCard";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "wouter";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: results, isLoading } = trpc.search.global.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 2 }
  );

  const totalResults = (results?.channels.length || 0) + (results?.movies.length || 0) + (results?.series.length || 0);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Buscar</h1>
          <Button variant="outline" asChild>
            <Link href="/">
              <a>Voltar ao Início</a>
            </Link>
          </Button>
        </div>

        {/* Search Input */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar canais, filmes e séries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        {searchQuery.length > 2 && (
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Buscando...</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum resultado encontrado para "{searchQuery}"
                </p>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-6">
                  {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'} para "{searchQuery}"
                </p>

                <Tabs defaultValue="all">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">
                      Todos ({totalResults})
                    </TabsTrigger>
                    <TabsTrigger value="channels">
                      Canais ({results?.channels.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="movies">
                      Filmes ({results?.movies.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="series">
                      Séries ({results?.series.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-8">
                    {results?.channels && results.channels.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Canais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.channels.map((channel) => (
                            <ChannelCard
                              key={channel.id}
                              id={channel.id}
                              name={channel.name}
                              icon={channel.icon || undefined}
                              quality={channel.quality || undefined}
                              onClick={() => window.location.href = `/live-tv`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {results?.movies && results.movies.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Filmes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {results.movies.map((movie) => (
                            <ContentCard
                              key={movie.id}
                              id={movie.id}
                              title={movie.title}
                              posterUrl={movie.posterUrl || undefined}
                              year={movie.year || undefined}
                              imdbRating={movie.imdbRating || undefined}
                              genres={typeof movie.genres === 'string' ? JSON.parse(movie.genres) : movie.genres}
                              onClick={() => window.location.href = `/movie/${movie.id}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {results?.series && results.series.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-semibold mb-4">Séries</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {results.series.map((show) => (
                            <ContentCard
                              key={show.id}
                              id={show.id}
                              title={show.title}
                              posterUrl={show.posterUrl || undefined}
                              imdbRating={show.imdbRating || undefined}
                              genres={typeof show.genres === 'string' ? JSON.parse(show.genres) : show.genres}
                              onClick={() => window.location.href = `/series/${show.id}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="channels">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results?.channels.map((channel) => (
                        <ChannelCard
                          key={channel.id}
                          id={channel.id}
                          name={channel.name}
                          icon={channel.icon || undefined}
                          quality={channel.quality || undefined}
                          onClick={() => window.location.href = `/live-tv`}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="movies">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {results?.movies.map((movie) => (
                        <ContentCard
                          key={movie.id}
                          id={movie.id}
                          title={movie.title}
                          posterUrl={movie.posterUrl || undefined}
                          year={movie.year || undefined}
                          imdbRating={movie.imdbRating || undefined}
                          genres={typeof movie.genres === 'string' ? JSON.parse(movie.genres) : movie.genres}
                          onClick={() => window.location.href = `/movie/${movie.id}`}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="series">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {results?.series.map((show) => (
                        <ContentCard
                          key={show.id}
                          id={show.id}
                          title={show.title}
                          posterUrl={show.posterUrl || undefined}
                          imdbRating={show.imdbRating || undefined}
                          genres={typeof show.genres === 'string' ? JSON.parse(show.genres) : show.genres}
                          onClick={() => window.location.href = `/series/${show.id}`}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}

        {searchQuery.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Digite algo para buscar canais, filmes e séries
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
