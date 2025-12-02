import axios from "axios";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.js";

const IPTV_API_BASE = "http://player.iptvperfeito.com/online";
const IPTV_STREAM_HOST = "http://iptvperfeito.ddns.net:25461";
const IPTV_USERNAME = "491548830";
const IPTV_PASSWORD = "491548830";

// Categorias conhecidas
const CHANNEL_CATEGORIES = [
  { id: 1, name: "A Fazenda" },
  { id: 2, name: "Abertos" },
  { id: 3, name: "Band" },
  { id: 4, name: "Documentários" },
  { id: 5, name: "Cine SKY" },
  { id: 6, name: "ESPN" },
  { id: 7, name: "Esportes" },
  { id: 8, name: "Filmes e Séries" },
  { id: 9, name: "Globo" },
  { id: 10, name: "HBO" },
  { id: 11, name: "Infantil" },
  { id: 12, name: "Legendados" },
  { id: 13, name: "Músicas" },
  { id: 14, name: "Notícias" },
  { id: 15, name: "Premiere" },
  { id: 16, name: "Record" },
];

const MOVIE_CATEGORIES = [
  { id: 1, name: "Lançamentos 2025" },
  { id: 2, name: "2024" },
  { id: 3, name: "2023" },
  { id: 4, name: "Ação" },
  { id: 5, name: "Animação" },
  { id: 6, name: "Aventura" },
  { id: 7, name: "Comédia" },
  { id: 8, name: "Drama" },
  { id: 9, name: "Família" },
  { id: 10, name: "Fantasia" },
  { id: 11, name: "Romance" },
  { id: 12, name: "Suspense" },
  { id: 13, name: "Terror" },
];

const SERIES_CATEGORIES = [
  { id: 1, name: "Netflix" },
  { id: 2, name: "Apple TV Plus" },
  { id: 3, name: "Amazon Prime Video" },
  { id: 4, name: "Disney Plus" },
  { id: 5, name: "Globoplay" },
  { id: 6, name: "Max" },
  { id: 7, name: "Novelas" },
  { id: 8, name: "Programas de TV" },
];

const axiosInstance = axios.create({
  baseURL: IPTV_API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

async function getChannelsByCategory(categoryId) {
  try {
    console.log(`Extraindo canais da categoria ${categoryId}...`);
    const response = await axiosInstance.post("/app/_livetv.php", {
      category: categoryId,
      type: 1,
    });

    let channels = [];
    try {
      channels = JSON.parse(response.data);
    } catch {
      console.log(`Categoria ${categoryId} retornou HTML, pulando...`);
      return [];
    }

    return channels.map((ch) => ({
      id: ch.id || ch.channel_id,
      name: ch.name || ch.title,
      categoryId: categoryId,
      icon: ch.icon || ch.logo,
      quality: ch.quality || "HD",
      streamUrl: `${IPTV_STREAM_HOST}/live/${IPTV_USERNAME}/${IPTV_PASSWORD}/${ch.id || ch.channel_id}.m3u8`,
    }));
  } catch (error) {
    console.error(`Erro ao extrair canais da categoria ${categoryId}:`, error.message);
    return [];
  }
}

async function getMoviesByCategory(categoryId) {
  try {
    console.log(`Extraindo filmes da categoria ${categoryId}...`);
    const response = await axiosInstance.post("/app/_movies.php", {
      category: categoryId,
      type: 1,
    });

    let movies = [];
    try {
      movies = JSON.parse(response.data);
    } catch {
      console.log(`Categoria de filmes ${categoryId} retornou HTML, pulando...`);
      return [];
    }

    return movies.map((m) => ({
      id: m.id || m.movie_id,
      title: m.title || m.name,
      year: m.year || m.release_year,
      genres: JSON.stringify(m.genres || []),
      duration: m.duration || m.length,
      imdbRating: m.imdb_rating || m.rating || 0,
      description: m.description || m.sinopse || "",
      posterUrl: m.poster_url || m.poster || m.image || "",
      categoryId: categoryId,
      streamUrl: `${IPTV_STREAM_HOST}/movie/${IPTV_USERNAME}/${IPTV_PASSWORD}/${m.id || m.movie_id}.mp4`,
    }));
  } catch (error) {
    console.error(`Erro ao extrair filmes da categoria ${categoryId}:`, error.message);
    return [];
  }
}

async function getSeriesByCategory(categoryId) {
  try {
    console.log(`Extraindo séries da categoria ${categoryId}...`);
    const response = await axiosInstance.post("/app/_series.php", {
      category: categoryId,
      type: 1,
    });

    let series = [];
    try {
      series = JSON.parse(response.data);
    } catch {
      console.log(`Categoria de séries ${categoryId} retornou HTML, pulando...`);
      return [];
    }

    return series.map((s) => ({
      id: s.id || s.series_id,
      title: s.title || s.name,
      genres: JSON.stringify(s.genres || []),
      imdbRating: s.imdb_rating || s.rating || 0,
      description: s.description || s.sinopse || "",
      posterUrl: s.poster_url || s.poster || s.image || "",
      categoryId: categoryId,
      totalSeasons: s.total_seasons || s.seasons || 1,
      totalEpisodes: s.total_episodes || s.episodes || 0,
    }));
  } catch (error) {
    console.error(`Erro ao extrair séries da categoria ${categoryId}:`, error.message);
    return [];
  }
}

async function main() {
  try {
    // Conectar ao banco de dados
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    console.log("🚀 Iniciando extração de dados do IPTV Perfeito...\n");

    // Extrair canais
    console.log("📺 Extraindo canais ao vivo...");
    let allChannels = [];
    for (const category of CHANNEL_CATEGORIES) {
      const channels = await getChannelsByCategory(category.id);
      allChannels = allChannels.concat(channels);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay para não sobrecarregar
    }
    console.log(`✅ ${allChannels.length} canais extraídos\n`);

    // Extrair filmes
    console.log("🎬 Extraindo filmes...");
    let allMovies = [];
    for (const category of MOVIE_CATEGORIES) {
      const movies = await getMoviesByCategory(category.id);
      allMovies = allMovies.concat(movies);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log(`✅ ${allMovies.length} filmes extraídos\n`);

    // Extrair séries
    console.log("📺 Extraindo séries...");
    let allSeries = [];
    for (const category of SERIES_CATEGORIES) {
      const series = await getSeriesByCategory(category.id);
      allSeries = allSeries.concat(series);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log(`✅ ${allSeries.length} séries extraídas\n`);

    console.log("✨ Extração concluída!");
    console.log(`Total: ${allChannels.length} canais + ${allMovies.length} filmes + ${allSeries.length} séries`);

    await connection.end();
  } catch (error) {
    console.error("❌ Erro durante extração:", error);
    process.exit(1);
  }
}

main();
