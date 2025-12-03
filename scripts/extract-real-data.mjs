import { drizzle } from 'drizzle-orm/mysql2';
import axios from 'axios';
import * as schema from '../drizzle/schema.js';

// Credenciais autorizadas pelo suporte
const USERNAME = '066693644';
const PASSWORD = '066693644';
const BASE_URL = 'http://iptvperfeito.ddns.net:25461';

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://databasetv_user:E2HXzWVDo4UXYaPV8Pmr9Y8HuaSQmyqe@dpg-d4niieuuk2gs739pipog-a/databasetv';
const db = drizzle(DATABASE_URL);

console.log('🚀 Iniciando extração completa de dados do IPTV Perfeito...\n');

// Helper para fazer requisições
async function apiRequest(endpoint, params = {}) {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, null, {
      params: {
        username: USERNAME,
        password: PASSWORD,
        ...params
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao acessar ${endpoint}:`, error.message);
    return null;
  }
}

// 1. Extrair categorias de Live TV
async function extractLiveTVCategories() {
  console.log('📺 Extraindo categorias de Live TV...');
  const data = await apiRequest('/app/_livetv.php', { type: 1 });
  
  if (!data || !data.categories) {
    console.log('⚠️  Nenhuma categoria de Live TV encontrada');
    return [];
  }

  const categories = data.categories;
  console.log(`✅ ${categories.length} categorias de Live TV encontradas`);
  
  // Inserir no banco
  for (const cat of categories) {
    await db.insert(schema.categories).values({
      externalId: String(cat.category_id),
      name: cat.category_name,
      type: 'live'
    }).onDuplicateKeyUpdate({ set: { name: cat.category_name } });
  }
  
  return categories;
}

// 2. Extrair canais ao vivo
async function extractLiveChannels(categories) {
  console.log('\n📡 Extraindo canais ao vivo...');
  let totalChannels = 0;

  for (const category of categories) {
    console.log(`  Categoria: ${category.category_name}...`);
    const data = await apiRequest('/app/_livetv.php', { 
      type: 1,
      category_id: category.category_id 
    });

    if (!data || !data.channels) continue;

    const channels = data.channels;
    totalChannels += channels.length;

    // Buscar ID da categoria no banco
    const dbCategory = await db.select().from(schema.categories)
      .where(schema.categories.externalId.eq(String(category.category_id)))
      .limit(1);
    
    const categoryId = dbCategory[0]?.id;

    for (const channel of channels) {
      const streamUrl = `${BASE_URL}/live/${USERNAME}/${PASSWORD}/${channel.stream_id}.m3u8`;
      
      await db.insert(schema.channels).values({
        externalId: String(channel.stream_id),
        categoryId: categoryId,
        name: channel.name,
        streamUrl: streamUrl,
        logoUrl: channel.stream_icon || null,
        epgChannelId: channel.epg_channel_id || null
      }).onDuplicateKeyUpdate({ 
        set: { 
          name: channel.name,
          streamUrl: streamUrl,
          logoUrl: channel.stream_icon || null
        } 
      });
    }
  }

  console.log(`✅ ${totalChannels} canais extraídos`);
}

// 3. Extrair categorias de filmes
async function extractMovieCategories() {
  console.log('\n🎬 Extraindo categorias de filmes...');
  const data = await apiRequest('/app/_movies.php', { type: 1 });
  
  if (!data || !data.categories) {
    console.log('⚠️  Nenhuma categoria de filmes encontrada');
    return [];
  }

  const categories = data.categories;
  console.log(`✅ ${categories.length} categorias de filmes encontradas`);
  
  for (const cat of categories) {
    await db.insert(schema.categories).values({
      externalId: String(cat.category_id),
      name: cat.category_name,
      type: 'movie'
    }).onDuplicateKeyUpdate({ set: { name: cat.category_name } });
  }
  
  return categories;
}

// 4. Extrair filmes
async function extractMovies(categories) {
  console.log('\n🎥 Extraindo filmes...');
  let totalMovies = 0;

  for (const category of categories) {
    console.log(`  Categoria: ${category.category_name}...`);
    const data = await apiRequest('/app/_movies.php', { 
      type: 1,
      category_id: category.category_id 
    });

    if (!data || !data.movies) continue;

    const movies = data.movies;
    totalMovies += movies.length;

    const dbCategory = await db.select().from(schema.categories)
      .where(schema.categories.externalId.eq(String(category.category_id)))
      .limit(1);
    
    const categoryId = dbCategory[0]?.id;

    for (const movie of movies) {
      const streamUrl = `${BASE_URL}/movie/${USERNAME}/${PASSWORD}/${movie.stream_id}.mp4`;
      
      await db.insert(schema.movies).values({
        externalId: String(movie.stream_id),
        categoryId: categoryId,
        title: movie.name,
        streamUrl: streamUrl,
        posterUrl: movie.stream_icon || movie.cover || null,
        description: movie.plot || null,
        year: movie.releasedate ? parseInt(movie.releasedate.split('-')[0]) : null,
        duration: movie.duration || null,
        genres: movie.genre ? JSON.stringify(movie.genre.split(',').map(g => g.trim())) : '[]',
        imdbRating: movie.rating ? parseFloat(movie.rating) * 10 : null
      }).onDuplicateKeyUpdate({ 
        set: { 
          title: movie.name,
          streamUrl: streamUrl,
          posterUrl: movie.stream_icon || movie.cover || null
        } 
      });
    }
  }

  console.log(`✅ ${totalMovies} filmes extraídos`);
}

// 5. Extrair categorias de séries
async function extractSeriesCategories() {
  console.log('\n📺 Extraindo categorias de séries...');
  const data = await apiRequest('/app/_series.php', { type: 1 });
  
  if (!data || !data.categories) {
    console.log('⚠️  Nenhuma categoria de séries encontrada');
    return [];
  }

  const categories = data.categories;
  console.log(`✅ ${categories.length} categorias de séries encontradas`);
  
  for (const cat of categories) {
    await db.insert(schema.categories).values({
      externalId: String(cat.category_id),
      name: cat.category_name,
      type: 'series'
    }).onDuplicateKeyUpdate({ set: { name: cat.category_name } });
  }
  
  return categories;
}

// 6. Extrair séries
async function extractSeries(categories) {
  console.log('\n🎭 Extraindo séries...');
  let totalSeries = 0;
  let totalEpisodes = 0;

  for (const category of categories.slice(0, 3)) { // Limitar a 3 categorias para teste
    console.log(`  Categoria: ${category.category_name}...`);
    const data = await apiRequest('/app/_series.php', { 
      type: 1,
      category_id: category.category_id 
    });

    if (!data || !data.series) continue;

    const seriesList = data.series;
    totalSeries += seriesList.length;

    const dbCategory = await db.select().from(schema.categories)
      .where(schema.categories.externalId.eq(String(category.category_id)))
      .limit(1);
    
    const categoryId = dbCategory[0]?.id;

    for (const series of seriesList.slice(0, 5)) { // Limitar a 5 séries por categoria
      await db.insert(schema.series).values({
        externalId: String(series.series_id),
        categoryId: categoryId,
        title: series.name,
        posterUrl: series.cover || null,
        description: series.plot || null,
        year: series.releaseDate ? parseInt(series.releaseDate.split('-')[0]) : null,
        genres: series.genre ? JSON.stringify(series.genre.split(',').map(g => g.trim())) : '[]',
        imdbRating: series.rating ? parseFloat(series.rating) * 10 : null
      }).onDuplicateKeyUpdate({ 
        set: { 
          title: series.name,
          posterUrl: series.cover || null
        } 
      });

      // Extrair episódios da série
      const episodesData = await apiRequest('/app/_series.php', { 
        type: 2,
        series_id: series.series_id 
      });

      if (episodesData && episodesData.episodes) {
        const dbSeries = await db.select().from(schema.series)
          .where(schema.series.externalId.eq(String(series.series_id)))
          .limit(1);
        
        const seriesId = dbSeries[0]?.id;

        for (const episode of episodesData.episodes) {
          const streamUrl = `${BASE_URL}/series/${USERNAME}/${PASSWORD}/${episode.id}.mp4`;
          
          await db.insert(schema.episodes).values({
            externalId: String(episode.id),
            seriesId: seriesId,
            title: episode.title || `Episódio ${episode.episode_num}`,
            seasonNumber: episode.season || 1,
            episodeNumber: episode.episode_num || 1,
            streamUrl: streamUrl,
            posterUrl: episode.info?.movie_image || null,
            description: episode.info?.plot || null,
            duration: episode.info?.duration || null
          }).onDuplicateKeyUpdate({ 
            set: { 
              title: episode.title || `Episódio ${episode.episode_num}`,
              streamUrl: streamUrl
            } 
          });

          totalEpisodes++;
        }
      }
    }
  }

  console.log(`✅ ${totalSeries} séries e ${totalEpisodes} episódios extraídos`);
}

// Executar extração completa
async function main() {
  try {
    // Live TV
    const liveTVCategories = await extractLiveTVCategories();
    if (liveTVCategories.length > 0) {
      await extractLiveChannels(liveTVCategories);
    }

    // Filmes
    const movieCategories = await extractMovieCategories();
    if (movieCategories.length > 0) {
      await extractMovies(movieCategories);
    }

    // Séries
    const seriesCategories = await extractSeriesCategories();
    if (seriesCategories.length > 0) {
      await extractSeries(seriesCategories);
    }

    console.log('\n🎉 Extração completa finalizada com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro durante extração:', error);
    process.exit(1);
  }
}

main();
