import axios from "axios";

// Credenciais do IPTV Perfeito (ocultas no backend)
const IPTV_API_BASE = "http://player.iptvperfeito.com/online";
export const IPTV_STREAM_HOST = "http://iptvperfeito.ddns.net:25461";
const IPTV_USERNAME = "491548830";
const IPTV_PASSWORD = "491548830";

interface Channel {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  icon?: string;
  quality?: string;
}

interface Movie {
  id: number;
  title: string;
  year?: number;
  genres?: string[];
  duration?: string;
  imdbRating?: number;
  description?: string;
  posterUrl?: string;
  categoryId: number;
  categoryName: string;
}

interface Series {
  id: number;
  title: string;
  genres?: string[];
  imdbRating?: number;
  description?: string;
  posterUrl?: string;
  categoryId: number;
  categoryName: string;
  totalSeasons?: number;
  totalEpisodes?: number;
}

interface Episode {
  id: number;
  seriesId: number;
  season: number;
  episode: number;
  title: string;
  description?: string;
}

class IPTVService {
  private axiosInstance = axios.create({
    baseURL: IPTV_API_BASE,
    timeout: 30000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  /**
   * Obter lista de canais de uma categoria
   */
  async getChannelsByCategory(categoryId: number): Promise<Channel[]> {
    try {
      const response = await this.axiosInstance.post("/app/_livetv.php", {
        category: categoryId,
        type: 1,
      });

      // Parse response - pode ser JSON ou HTML
      let channels: any[] = [];
      try {
        channels = JSON.parse(response.data);
      } catch {
        // Se não for JSON, tenta extrair do HTML
        console.log("Response não é JSON, tentando extrair do HTML");
        return [];
      }

      return channels.map((ch: any) => ({
        id: ch.id || ch.channel_id,
        name: ch.name || ch.title,
        categoryId: categoryId,
        categoryName: ch.category_name || "",
        icon: ch.icon || ch.logo,
        quality: ch.quality || "HD",
      }));
    } catch (error) {
      console.error(`Erro ao obter canais da categoria ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Obter URL de streaming de um canal
   */
  async getChannelStreamUrl(channelId: number): Promise<string> {
    try {
      const response = await this.axiosInstance.post("/app/_livetv.php", {
        channel: channelId,
        type: 2,
      });

      // A resposta é a URL diretamente
      const url = response.data.trim();
      return url || `${IPTV_STREAM_HOST}/live/${IPTV_USERNAME}/${IPTV_PASSWORD}/${channelId}.m3u8`;
    } catch (error) {
      console.error(`Erro ao obter URL de streaming do canal ${channelId}:`, error);
      return `${IPTV_STREAM_HOST}/live/${IPTV_USERNAME}/${IPTV_PASSWORD}/${channelId}.m3u8`;
    }
  }

  /**
   * Obter EPG (programação) de um canal
   */
  async getChannelEpg(channelId: number): Promise<any[]> {
    try {
      const response = await this.axiosInstance.post("/app/_livetv.php", {
        channel: channelId,
        type: 3,
      });

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao obter EPG do canal ${channelId}:`, error);
      return [];
    }
  }

  /**
   * Obter lista de filmes de uma categoria
   */
  async getMoviesByCategory(categoryId: number): Promise<Movie[]> {
    try {
      const response = await this.axiosInstance.post("/app/_movies.php", {
        category: categoryId,
        type: 1,
      });

      let movies: any[] = [];
      try {
        movies = JSON.parse(response.data);
      } catch {
        console.log("Response de filmes não é JSON");
        return [];
      }

      return movies.map((m: any) => ({
        id: m.id || m.movie_id,
        title: m.title || m.name,
        year: m.year || m.release_year,
        genres: m.genres ? (typeof m.genres === "string" ? JSON.parse(m.genres) : m.genres) : [],
        duration: m.duration || m.length,
        imdbRating: m.imdb_rating || m.rating,
        description: m.description || m.sinopse,
        posterUrl: m.poster_url || m.poster || m.image,
        categoryId: categoryId,
        categoryName: m.category_name || "",
      }));
    } catch (error) {
      console.error(`Erro ao obter filmes da categoria ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Obter URL de streaming de um filme
   */
  async getMovieStreamUrl(movieId: number): Promise<string> {
    try {
      const response = await this.axiosInstance.post("/app/_movies.php", {
        movie: movieId,
        type: 2,
      });

      const url = response.data.trim();
      return url || `${IPTV_STREAM_HOST}/movie/${IPTV_USERNAME}/${IPTV_PASSWORD}/${movieId}.mp4`;
    } catch (error) {
      console.error(`Erro ao obter URL de streaming do filme ${movieId}:`, error);
      return `${IPTV_STREAM_HOST}/movie/${IPTV_USERNAME}/${IPTV_PASSWORD}/${movieId}.mp4`;
    }
  }

  /**
   * Obter lista de séries de uma categoria
   */
  async getSeriesByCategory(categoryId: number): Promise<Series[]> {
    try {
      const response = await this.axiosInstance.post("/app/_series.php", {
        category: categoryId,
        type: 1,
      });

      let series: any[] = [];
      try {
        series = JSON.parse(response.data);
      } catch {
        console.log("Response de séries não é JSON");
        return [];
      }

      return series.map((s: any) => ({
        id: s.id || s.series_id,
        title: s.title || s.name,
        genres: s.genres ? (typeof s.genres === "string" ? JSON.parse(s.genres) : s.genres) : [],
        imdbRating: s.imdb_rating || s.rating,
        description: s.description || s.sinopse,
        posterUrl: s.poster_url || s.poster || s.image,
        categoryId: categoryId,
        categoryName: s.category_name || "",
        totalSeasons: s.total_seasons || s.seasons || 1,
        totalEpisodes: s.total_episodes || s.episodes || 0,
      }));
    } catch (error) {
      console.error(`Erro ao obter séries da categoria ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Obter episódios de uma série
   */
  async getSeriesEpisodes(seriesId: number, season: number): Promise<Episode[]> {
    try {
      const response = await this.axiosInstance.post("/app/_series.php", {
        series: seriesId,
        season: season,
        type: 2,
      });

      let data: any = response.data;
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const episodes = data.episodes || data || [];

      return episodes.map((ep: any, index: number) => ({
        id: ep.episode_id || ep.id || `${seriesId}-${season}-${index + 1}`,
        seriesId: seriesId,
        season: season,
        episode: ep.episode || ep.episode_number || index + 1,
        title: ep.title || ep.name,
        description: ep.description || "",
      }));
    } catch (error) {
      console.error(`Erro ao obter episódios da série ${seriesId} temporada ${season}:`, error);
      return [];
    }
  }

  /**
   * Obter URL de streaming de um episódio
   */
  async getEpisodeStreamUrl(episodeId: number | string): Promise<string> {
    try {
      const response = await this.axiosInstance.post("/app/_series.php", {
        episode: episodeId,
        type: 3,
      });

      const url = response.data.trim();
      return url || `${IPTV_STREAM_HOST}/series/${IPTV_USERNAME}/${IPTV_PASSWORD}/${episodeId}.mp4`;
    } catch (error) {
      console.error(`Erro ao obter URL de streaming do episódio ${episodeId}:`, error);
      return `${IPTV_STREAM_HOST}/series/${IPTV_USERNAME}/${IPTV_PASSWORD}/${episodeId}.mp4`;
    }
  }

  /**
   * Busca global
   */
  async search(query: string): Promise<{ channels: Channel[]; movies: Movie[]; series: Series[] }> {
    try {
      const response = await this.axiosInstance.post("/app/_search.php", {
        q: query,
      });

      let data: any = response.data;
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      return {
        channels: data.channels || [],
        movies: data.movies || [],
        series: data.series || [],
      };
    } catch (error) {
      console.error(`Erro ao buscar por "${query}":`, error);
      return { channels: [], movies: [], series: [] };
    }
  }

  /**
   * Gerar URL de streaming com credenciais ocultas
   */
  generateStreamUrl(type: "live" | "movie" | "series", contentId: number | string): string {
    const streamPath = `${type}/${IPTV_USERNAME}/${IPTV_PASSWORD}/${contentId}.${
      type === "live" ? "ts" : "mp4" // Usar .ts para live, pois o player espera isso
    }`;
    // Retorna a URL do nosso proxy reverso
    return `/api/stream/${streamPath}`;
  }
}

export const iptvService = new IPTVService();
