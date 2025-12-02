#!/usr/bin/env node

import axios from "axios";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const IPTV_API_BASE = "http://player.iptvperfeito.com/online";
const IPTV_STREAM_HOST = "http://iptvperfeito.ddns.net:25461";
const IPTV_USERNAME = "491548830";
const IPTV_PASSWORD = "491548830";

const axiosInstance = axios.create({
  baseURL: IPTV_API_BASE,
  timeout: 60000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

// Categorias de canais
const CHANNEL_CATEGORIES = [
  { id: 1, name: "A Fazenda", type: "channel" },
  { id: 2, name: "Abertos", type: "channel" },
  { id: 3, name: "Band", type: "channel" },
  { id: 4, name: "Documentários", type: "channel" },
  { id: 5, name: "Cine SKY", type: "channel" },
  { id: 6, name: "ESPN", type: "channel" },
  { id: 7, name: "Esportes", type: "channel" },
  { id: 8, name: "Esportes PayPer View", type: "channel" },
  { id: 9, name: "Filmes e Séries", type: "channel" },
  { id: 10, name: "Globo", type: "channel" },
  { id: 11, name: "HBO", type: "channel" },
  { id: 12, name: "Infantil", type: "channel" },
  { id: 13, name: "Legendados", type: "channel" },
  { id: 14, name: "Músicas", type: "channel" },
  { id: 15, name: "Notícias", type: "channel" },
  { id: 16, name: "NBA League Pass", type: "channel" },
  { id: 17, name: "Premiere", type: "channel" },
  { id: 18, name: "Portugal", type: "channel" },
  { id: 19, name: "Record", type: "channel" },
  { id: 20, name: "Realitys", type: "channel" },
];

// Categorias de filmes
const MOVIE_CATEGORIES = [
  { id: 1, name: "Lançamentos 2025", type: "movie" },
  { id: 2, name: "2024", type: "movie" },
  { id: 3, name: "2023", type: "movie" },
  { id: 4, name: "2022", type: "movie" },
  { id: 5, name: "Outros anos", type: "movie" },
  { id: 6, name: "Ação", type: "movie" },
  { id: 7, name: "Animação", type: "movie" },
  { id: 8, name: "Aventura", type: "movie" },
  { id: 9, name: "Cinema", type: "movie" },
  { id: 10, name: "Comédia", type: "movie" },
  { id: 11, name: "Crime", type: "movie" },
  { id: 12, name: "Drama", type: "movie" },
  { id: 13, name: "Documentários", type: "movie" },
  { id: 14, name: "Família", type: "movie" },
  { id: 15, name: "Fantasia", type: "movie" },
  { id: 16, name: "Faroeste", type: "movie" },
  { id: 17, name: "Ficção", type: "movie" },
  { id: 18, name: "Guerra", type: "movie" },
  { id: 19, name: "Nacionais", type: "movie" },
  { id: 20, name: "Religiosos", type: "movie" },
  { id: 21, name: "Romance", type: "movie" },
  { id: 22, name: "Suspense", type: "movie" },
  { id: 23, name: "Shows", type: "movie" },
  { id: 24, name: "Stand Up", type: "movie" },
  { id: 25, name: "Terror", type: "movie" },
  { id: 26, name: "Legendados", type: "movie" },
  { id: 27, name: "Adultos", type: "movie" },
];

// Categorias de séries
const SERIES_CATEGORIES = [
  { id: 1, name: "Netflix", type: "series" },
  { id: 2, name: "Apple TV Plus", type: "series" },
  { id: 3, name: "Amazon Prime Video", type: "series" },
  { id: 4, name: "Brasil Paralelo", type: "series" },
  { id: 5, name: "Crunchyroll", type: "series" },
  { id: 6, name: "Disney Plus", type: "series" },
  { id: 7, name: "Dorama", type: "series" },
  { id: 8, name: "Discovery Plus", type: "series" },
  { id: 9, name: "DirecTV", type: "series" },
  { id: 10, name: "Globoplay", type: "series" },
  { id: 11, name: "Max", type: "series" },
  { id: 12, name: "Novelas", type: "series" },
  { id: 13, name: "Outras Produtoras", type: "series" },
  { id: 14, name: "Paramount", type: "series" },
  { id: 15, name: "Programas de TV", type: "series" },
  { id: 16, name: "Star Plus", type: "series" },
  { id: 17, name: "AMC Plus", type: "series" },
  { id: 18, name: "Claro video", type: "series" },
  { id: 19, name: "Funimation Now", type: "series" },
  { id: 20, name: "Lionsgate", type: "series" },
  { id: 21, name: "SBT", type: "series" },
  { id: 22, name: "Univer", type: "series" },
  { id: 23, name: "PlutoTV", type: "series" },
  { id: 24, name: "Play Plus", type: "series" },
  { id: 25, name: "Turcas", type: "series" },
];

let db = null;
let stats = {
  categories: 0,
  channels: 0,
  channelsWithEpg: 0,
  movies: 0,
  series: 0,
  episodes: 0,
  epgItems: 0,
};

async function initDb() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  db = drizzle(connection);
  console.log("✅ Conectado ao banco de dados\n");
}

async function insertCategory(category) {
  try {
    await db.insert(schema.categories).values({
      id: category.id,
      name: category.name,
      type: category.type,
    });
    stats.categories++;
  } catch (error) {
    // Categoria pode já existir
  }
}

async function getChannelsByCategory(categoryId) {
  try {
    const response = await axiosInstance.post("/app/_livetv.php", {
      category: categoryId,
      type: 1,
    });

    let channels = [];
    try {
      channels = JSON.parse(response.data);
    } catch {
      return [];
    }

    return channels.map((ch) => ({
      id: ch.id || ch.channel_id,
      name: ch.name || ch.title,
      categoryId: categoryId,
      icon: ch.icon || ch.logo || "",
      quality: ch.quality || "HD",
      streamUrl: `${IPTV_STREAM_HOST}/live/${IPTV_USERNAME}/${IPTV_PASSWORD}/${ch.id || ch.channel_id}.m3u8`,
    }));
  } catch (error) {
    console.error(`❌ Erro ao extrair canais da categoria ${categoryId}:`, error.message);
    return [];
  }
}

async function getChannelEpg(channelId) {
  try {
    const response = await axiosInstance.post("/app/_livetv.php", {
      channel: channelId,
      type: 3,
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
}

async function getMoviesByCategory(categoryId) {
  try {
    const response = await axiosInstance.post("/app/_movies.php", {
      category: categoryId,
      type: 1,
    });

    let movies = [];
    try {
      movies = JSON.parse(response.data);
    } catch {
      return [];
    }

    return movies.map((m) => ({
      id: m.id || m.movie_id,
      title: m.title || m.name,
      year: m.year || m.release_year || null,
      genres: JSON.stringify(m.genres || []),
      duration: m.duration || m.length || null,
      imdbRating: m.imdb_rating || m.rating || 0,
      description: m.description || m.sinopse || "",
      posterUrl: m.poster_url || m.poster || m.image || "",
      categoryId: categoryId,
      streamUrl: `${IPTV_STREAM_HOST}/movie/${IPTV_USERNAME}/${IPTV_PASSWORD}/${m.id || m.movie_id}.mp4`,
    }));
  } catch (error) {
    console.error(`❌ Erro ao extrair filmes da categoria ${categoryId}:`, error.message);
    return [];
  }
}

async function getSeriesByCategory(categoryId) {
  try {
    const response = await axiosInstance.post("/app/_series.php", {
      category: categoryId,
      type: 1,
    });

    let series = [];
    try {
      series = JSON.parse(response.data);
    } catch {
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
    console.error(`❌ Erro ao extrair séries da categoria ${categoryId}:`, error.message);
    return [];
  }
}

async function getSeriesEpisodes(seriesId, season) {
  try {
    const response = await axiosInstance.post("/app/_series.php", {
      series: seriesId,
      season: season,
      type: 2,
    });

    let data = response.data;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const episodes = data.episodes || data || [];

    return episodes.map((ep, index) => ({
      id: ep.episode_id || ep.id || `${seriesId}-${season}-${index + 1}`,
      seriesId: seriesId,
      season: season,
      episode: ep.episode || ep.episode_number || index + 1,
      title: ep.title || ep.name,
      description: ep.description || "",
      streamUrl: `${IPTV_STREAM_HOST}/series/${IPTV_USERNAME}/${IPTV_PASSWORD}/${ep.episode_id || ep.id || `${seriesId}-${season}-${index + 1}`}.mp4`,
    }));
  } catch (error) {
    return [];
  }
}

async function extractChannels() {
  console.log("📺 Extraindo canais ao vivo...");

  for (const category of CHANNEL_CATEGORIES) {
    await insertCategory(category);

    const channels = await getChannelsByCategory(category.id);
    console.log(`   Categoria "${category.name}": ${channels.length} canais`);

    for (const channel of channels) {
      try {
        await db.insert(schema.channels).values(channel);
        stats.channels++;

        // Extrair EPG do canal
        const epg = await getChannelEpg(channel.id);
        for (const item of epg) {
          try {
            await db.insert(schema.epgData).values({
              channelId: channel.id,
              title: item.title || "",
              description: item.description || "",
              startTime: item.start || "",
              endTime: item.end || "",
            });
            stats.epgItems++;
          } catch (e) {
            // Ignorar duplicatas
          }
        }

        if (epg.length > 0) {
          stats.channelsWithEpg++;
        }
      } catch (error) {
        // Ignorar duplicatas
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`✅ ${stats.channels} canais extraídos (${stats.channelsWithEpg} com EPG, ${stats.epgItems} itens EPG)\n`);
}

async function extractMovies() {
  console.log("🎬 Extraindo filmes...");

  for (const category of MOVIE_CATEGORIES) {
    await insertCategory(category);

    const movies = await getMoviesByCategory(category.id);
    console.log(`   Categoria "${category.name}": ${movies.length} filmes`);

    for (const movie of movies) {
      try {
        await db.insert(schema.movies).values(movie);
        stats.movies++;
      } catch (error) {
        // Ignorar duplicatas
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`✅ ${stats.movies} filmes extraídos\n`);
}

async function extractSeries() {
  console.log("📺 Extraindo séries...");

  for (const category of SERIES_CATEGORIES) {
    await insertCategory(category);

    const series = await getSeriesByCategory(category.id);
    console.log(`   Categoria "${category.name}": ${series.length} séries`);

    for (const show of series) {
      try {
        await db.insert(schema.series).values(show);
        stats.series++;

        // Extrair episódios de cada temporada
        for (let season = 1; season <= (show.totalSeasons || 1); season++) {
          const episodes = await getSeriesEpisodes(show.id, season);

          for (const episode of episodes) {
            try {
              await db.insert(schema.episodes).values(episode);
              stats.episodes++;
            } catch (e) {
              // Ignorar duplicatas
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (error) {
        // Ignorar duplicatas
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`✅ ${stats.series} séries extraídas com ${stats.episodes} episódios\n`);
}

async function main() {
  try {
    console.log("🚀 INICIANDO EXTRAÇÃO COMPLETA DO IPTV PERFEITO\n");
    console.log("=".repeat(60));
    console.log();

    await initDb();

    await extractChannels();
    await extractMovies();
    await extractSeries();

    console.log("=".repeat(60));
    console.log("\n✨ EXTRAÇÃO CONCLUÍDA COM SUCESSO!\n");
    console.log("📊 RESUMO:");
    console.log(`   • Categorias: ${stats.categories}`);
    console.log(`   • Canais: ${stats.channels} (${stats.channelsWithEpg} com EPG)`);
    console.log(`   • Itens EPG: ${stats.epgItems}`);
    console.log(`   • Filmes: ${stats.movies}`);
    console.log(`   • Séries: ${stats.series}`);
    console.log(`   • Episódios: ${stats.episodes}`);
    console.log(
      `\n   TOTAL: ${stats.categories + stats.channels + stats.movies + stats.series + stats.episodes} itens\n`
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERRO DURANTE EXTRAÇÃO:", error);
    process.exit(1);
  }
}

main();
