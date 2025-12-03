import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Tv, 
  Film, 
  TvMinimal, 
  Zap, 
  Globe, 
  Lock, 
  ChevronRight,
  Radio,
  Sparkles,
  Play
} from "lucide-react";

export default function Home() {
  const categories = [
    {
      name: "Canais Globo",
      description: "176 canais de todas as regionais",
      icon: "📺",
      color: "from-blue-500/20 to-blue-600/20",
      href: "/live-tv"
    },
    {
      name: "Canais 4K",
      description: "85 canais em ultra HD",
      icon: "✨",
      color: "from-purple-500/20 to-purple-600/20",
      href: "/live-tv"
    },
    {
      name: "Infantil",
      description: "30 canais para crianças",
      icon: "🎨",
      color: "from-pink-500/20 to-pink-600/20",
      href: "/live-tv"
    },
    {
      name: "Esportes",
      description: "25 canais de esportes PPV",
      icon: "⚽",
      color: "from-green-500/20 to-green-600/20",
      href: "/live-tv"
    },
    {
      name: "Documentários",
      description: "36 canais documentários",
      icon: "🎬",
      color: "from-orange-500/20 to-orange-600/20",
      href: "/live-tv"
    },
    {
      name: "Internacional",
      description: "Canais do mundo inteiro",
      icon: "🌍",
      color: "from-cyan-500/20 to-cyan-600/20",
      href: "/live-tv"
    }
  ];

  const features = [
    {
      icon: <Radio className="h-8 w-8" />,
      title: "1.003+ Canais ao Vivo",
      description: "Acesso a mais de mil canais de TV brasileiros e internacionais em tempo real"
    },
    {
      icon: <Film className="h-8 w-8" />,
      title: "27.979 Filmes",
      description: "Catálogo completo de filmes em diversos gêneros e idiomas"
    },
    {
      icon: <TvMinimal className="h-8 w-8" />,
      title: "187.283 Episódios",
      description: "Séries completas com todos os episódios disponíveis"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "100% Gratuito",
      description: "Sem taxas, sem assinaturas, sem cartão de crédito necessário"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Plataforma",
      description: "Funciona perfeitamente em Mobile, Desktop, Tablet e Smart TV"
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Sem Cadastro",
      description: "Comece a assistir imediatamente, sem criar conta ou fazer login"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
              <Tv className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Sucesso
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Início
              </a>
            </Link>
            <Link href="/live-tv">
              <a className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                TV ao Vivo
              </a>
            </Link>
            <Link href="/movies">
              <a className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Filmes
              </a>
            </Link>
            <Link href="/series">
              <a className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Séries
              </a>
            </Link>
          </nav>

          <Link href="/live-tv">
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Plataforma de Streaming IPTV</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Assista <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">1.003 Canais</span> de TV ao Vivo Grátis
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Globo, SBT, Record, Band, Canais 4K, Infantil, Esportes e muito mais! Tudo em um só lugar, sem anúncios, sem cadastro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/live-tv">
                <Button size="lg" className="gap-2 text-base h-12 px-8">
                  <Play className="h-5 w-5" />
                  Começar a Assistir Agora
                </Button>
              </Link>
              <Link href="/live-tv">
                <Button size="lg" variant="outline" className="gap-2 text-base h-12 px-8">
                  <Tv className="h-5 w-5" />
                  Ver Todos os Canais
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border/50">
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-primary">1.003+</p>
                <p className="text-sm text-muted-foreground">Canais ao Vivo</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-primary">27.979</p>
                <p className="text-sm text-muted-foreground">Filmes</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-primary">187.283</p>
                <p className="text-sm text-muted-foreground">Episódios</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Por que escolher Sucesso?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para um streaming completo e sem complicações
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Categorias Populares</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore os canais mais assistidos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link key={idx} href={category.href}>
              <a className="group block">
                <div className={`relative p-8 rounded-xl bg-gradient-to-br ${category.color} border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <span className="text-4xl">{category.icon}</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-purple-500/10" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Pronto para começar?
            </h2>
            <p className="text-xl text-muted-foreground">
              Não precisa de cadastro, cartão de crédito ou assinatura. Comece a assistir agora mesmo!
            </p>
            <Link href="/live-tv">
              <Button size="lg" className="gap-2 text-base h-12 px-8">
                <Play className="h-5 w-5" />
                Acessar Plataforma
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                  <Tv className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Sucesso</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sua plataforma de streaming IPTV completa e gratuita.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Navegação</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/live-tv"><a className="hover:text-primary transition-colors">TV ao Vivo</a></Link></li>
                <li><Link href="/movies"><a className="hover:text-primary transition-colors">Filmes</a></Link></li>
                <li><Link href="/series"><a className="hover:text-primary transition-colors">Séries</a></Link></li>
                <li><Link href="/search"><a className="hover:text-primary transition-colors">Buscar</a></Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Canais Globo</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Canais 4K</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Infantil</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Esportes</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Informações</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 Sucesso - Plataforma de Streaming IPTV. Todos os direitos reservados.</p>
            <p>Desenvolvido com ❤️ para você</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
