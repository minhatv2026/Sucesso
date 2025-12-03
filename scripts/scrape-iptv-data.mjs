import axios from 'axios';
import { JSDOM } from 'jsdom';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Credenciais autorizadas
const USERNAME = '066693644';
const PASSWORD = '066693644';
const BASE_URL = 'http://player.iptvperfeito.com/online';

// Database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://databasetv_user:E2HXzWVDo4UXYaPV8Pmr9Y8HuaSQmyqe@dpg-d4niieuuk2gs739pipog-a/databasetv';

console.log('🚀 Iniciando scraping do IPTV Perfeito...\n');

// Criar sessão com cookies
const session = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// Fazer login
async function login() {
  console.log('🔐 Fazendo login...');
  
  try {
    const response = await session.post('/index.php', new URLSearchParams({
      username: USERNAME,
      password: PASSWORD,
      login: 'Entrar'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('✅ Login realizado com sucesso!\n');
    return true;
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    return false;
  }
}

// Extrair canais
async function scrapeChannels() {
  console.log('📺 Extraindo canais...');
  
  try {
    const response = await session.get('/index.php?page=livetv');
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extrair categorias do dropdown
    const categorySelect = document.querySelector('#live_cat');
    const categories = [];
    
    if (categorySelect) {
      const options = categorySelect.querySelectorAll('option');
      options.forEach(option => {
        categories.push({
          name: option.textContent.trim(),
          value: option.value
        });
      });
    }
    
    console.log(`✅ ${categories.length} categorias de canais encontradas`);
    
    // Extrair canais da lista
    const channelItems = document.querySelectorAll('li');
    const channels = [];
    
    channelItems.forEach(item => {
      const text = item.textContent.trim();
      if (text && text.match(/^\d+\s+-\s+/)) {
        const match = text.match(/^(\d+)\s+-\s+(.+)$/);
        if (match) {
          channels.push({
            id: match[1],
            name: match[2]
          });
        }
      }
    });
    
    console.log(`✅ ${channels.length} canais extraídos\n`);
    
    return { categories, channels };
  } catch (error) {
    console.error('❌ Erro ao extrair canais:', error.message);
    return { categories: [], channels: [] };
  }
}

// Extrair filmes
async function scrapeMovies() {
  console.log('🎬 Extraindo filmes...');
  
  try {
    const response = await session.get('/index.php?page=vod');
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extrair categorias
    const categorySelect = document.querySelector('#vod_cat');
    const categories = [];
    
    if (categorySelect) {
      const options = categorySelect.querySelectorAll('option');
      options.forEach(option => {
        categories.push({
          name: option.textContent.trim(),
          value: option.value
        });
      });
    }
    
    console.log(`✅ ${categories.length} categorias de filmes encontradas`);
    
    // Extrair filmes
    const movieItems = document.querySelectorAll('.movie-item, .vod-item, li');
    const movies = [];
    
    movieItems.forEach(item => {
      const title = item.querySelector('.title, .name')?.textContent.trim();
      const img = item.querySelector('img')?.src;
      
      if (title) {
        movies.push({
          title,
          poster: img
        });
      }
    });
    
    console.log(`✅ ${movies.length} filmes extraídos\n`);
    
    return { categories, movies };
  } catch (error) {
    console.error('❌ Erro ao extrair filmes:', error.message);
    return { categories: [], movies: [] };
  }
}

// Extrair séries
async function scrapeSeries() {
  console.log('📺 Extraindo séries...');
  
  try {
    const response = await session.get('/index.php?page=series');
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extrair categorias
    const categorySelect = document.querySelector('#series_cat');
    const categories = [];
    
    if (categorySelect) {
      const options = categorySelect.querySelectorAll('option');
      options.forEach(option => {
        categories.push({
          name: option.textContent.trim(),
          value: option.value
        });
      });
    }
    
    console.log(`✅ ${categories.length} categorias de séries encontradas`);
    
    // Extrair séries
    const seriesItems = document.querySelectorAll('.series-item, li');
    const series = [];
    
    seriesItems.forEach(item => {
      const title = item.querySelector('.title, .name')?.textContent.trim();
      const img = item.querySelector('img')?.src;
      
      if (title) {
        series.push({
          title,
          poster: img
        });
      }
    });
    
    console.log(`✅ ${series.length} séries extraídas\n`);
    
    return { categories, series };
  } catch (error) {
    console.error('❌ Erro ao extrair séries:', error.message);
    return { categories: [], series: [] };
  }
}

// Salvar resultados
async function saveResults(data) {
  console.log('💾 Salvando resultados...');
  
  const fs = await import('fs');
  await fs.promises.writeFile(
    '/tmp/iptv-scraped-data.json',
    JSON.stringify(data, null, 2)
  );
  
  console.log('✅ Resultados salvos em /tmp/iptv-scraped-data.json');
}

// Main
async function main() {
  try {
    const loggedIn = await login();
    if (!loggedIn) {
      console.error('❌ Falha no login. Abortando.');
      process.exit(1);
    }
    
    const channelsData = await scrapeChannels();
    const moviesData = await scrapeMovies();
    const seriesData = await scrapeSeries();
    
    const allData = {
      channels: channelsData,
      movies: moviesData,
      series: seriesData,
      extractedAt: new Date().toISOString()
    };
    
    await saveResults(allData);
    
    console.log('\n🎉 Scraping completo!');
    console.log(`📊 Total extraído:`);
    console.log(`   - ${channelsData.categories.length} categorias de canais`);
    console.log(`   - ${channelsData.channels.length} canais`);
    console.log(`   - ${moviesData.categories.length} categorias de filmes`);
    console.log(`   - ${moviesData.movies.length} filmes`);
    console.log(`   - ${seriesData.categories.length} categorias de séries`);
    console.log(`   - ${seriesData.series.length} séries`);
    
  } catch (error) {
    console.error('\n❌ Erro durante scraping:', error);
    process.exit(1);
  }
}

main();
