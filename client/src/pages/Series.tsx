import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ContentCard from "@/components/ContentCard";
import { Search } from "lucide-react";
import { Link } from "wouter";

export default function Series() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categories } = trpc.categories.listByType.useQuery({ type: "series" });

  const { data: series } = trpc.series.listByCategory.useQuery(
    { categoryId: activeCategory || categories?.[0]?.id || 13 },
    { enabled: !!(activeCategory || categories?.[0]?.id) }
  );

  const { data: searchResults } = trpc.series.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 2 }
  );

  const displaySeries = searchQuery.length > 2 ? searchResults : series;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Séries</h1>
          <Button variant="outline" asChild>
            <Link href="/">
              <a>Voltar ao Início</a>
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar séries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {searchQuery.length > 2 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Resultados para "{searchQuery}"
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displaySeries?.map((show) => (
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
        ) : (
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displaySeries?.map((show) => (
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
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
