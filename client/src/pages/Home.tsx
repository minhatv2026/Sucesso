import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import ContentCard from "@/components/ContentCard";
import { Tv, Film, TvMinimal, Search, User, LogOut } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: categories } = trpc.categories.listByType.useQuery({ type: "movie" });
  const { data: movies } = trpc.movies.listByCategory.useQuery(
    { categoryId: categories?.[0]?.id || 7 },
    { enabled: !!categories?.[0]?.id }
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">IPTV Streaming</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Início
              </a>
            </Link>
            <Link href="/live-tv">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                TV ao Vivo
              </a>
            </Link>
            <Link href="/movies">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Filmes
              </a>
            </Link>
            <Link href="/series">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Séries
              </a>
            </Link>
            <Link href="/search">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Buscar
              </a>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/20 to-background">
        <div className="container text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Streaming IPTV Moderno
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Assista canais ao vivo, filmes e séries em qualquer dispositivo. 
            Suporte para Mobile, Desktop e TV.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/live-tv">
                <a className="gap-2">
                  <Tv className="h-5 w-5" />
                  TV ao Vivo
                </a>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/movies">
                <a className="gap-2">
                  <Film className="h-5 w-5" />
                  Filmes
                </a>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/series">
                <a className="gap-2">
                  <TvMinimal className="h-5 w-5" />
                  Séries
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Filmes em Destaque</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies?.slice(0, 10).map((movie) => (
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
      </section>

      {/* Features */}
      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Tv className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">TV ao Vivo</h3>
            <p className="text-muted-foreground">
              Assista seus canais favoritos em tempo real com qualidade HD/FHD
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Film className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Filmes e Séries</h3>
            <p className="text-muted-foreground">
              Catálogo completo de filmes e séries sob demanda
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <TvMinimal className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Multi-Plataforma</h3>
            <p className="text-muted-foreground">
              Compatível com Mobile, Desktop e Smart TV
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 IPTV Streaming Platform. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
