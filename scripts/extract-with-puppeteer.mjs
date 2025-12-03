import puppeteer from 'puppeteer';
import fs from 'fs/promises';

// Credenciais autorizadas
const USERNAME = '066693644';
const PASSWORD = '066693644';
const BASE_URL = 'http://player.iptvperfeito.com/online';

console.log('🚀 Iniciando extração com Puppeteer...\n');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Fazer login
    console.log('🔐 Fazendo login...');
    await page.goto(`${BASE_URL}/index.php?page=login`, { waitUntil: 'networkidle2' });
    
    await page.type('#username', USERNAME);
    await page.type('#sifre', PASSWORD);
    await page.click('#login');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Login realizado!\n');
    
    // Extrair canais
    console.log('📺 Extraindo canais...');
    await page.goto(`${BASE_URL}/index.php?page=livetv`, { waitUntil: 'networkidle2' });
    
    const channelsData = await page.evaluate(() => {
      const categories = [];
      const categorySelect = document.querySelector('#live_cat');
      
      if (categorySelect) {
        const options = categorySelect.querySelectorAll('option');
        options.forEach(option => {
          categories.push({
            name: option.textContent.trim(),
            value: option.value
          });
        });
      }
      
      const channels = [];
      const channelItems = document.querySelectorAll('li');
      
      channelItems.forEach(item => {
        const text = item.textContent.trim();
        const match = text.match(/^(\d+)\s+-\s+(.+)$/);
        if (match) {
          channels.push({
            id: parseInt(match[1]),
            name: match[2].trim()
          });
        }
      });
      
      return { categories, channels };
    });
    
    console.log(`✅ ${channelsData.categories.length} categorias de canais`);
    console.log(`✅ ${channelsData.channels.length} canais extraídos\n`);
    
    // Extrair filmes
    console.log('🎬 Extraindo filmes...');
    await page.goto(`${BASE_URL}/index.php?page=vod`, { waitUntil: 'networkidle2' });
    
    const moviesData = await page.evaluate(() => {
      const categories = [];
      const categorySelect = document.querySelector('#vod_cat');
      
      if (categorySelect) {
        const options = categorySelect.querySelectorAll('option');
        options.forEach(option => {
          categories.push({
            name: option.textContent.trim(),
            value: option.value
          });
        });
      }
      
      const movies = [];
      const movieItems = document.querySelectorAll('li');
      
      movieItems.forEach(item => {
        const text = item.textContent.trim();
        const match = text.match(/^(\d+)\s+-\s+(.+)$/);
        if (match) {
          const img = item.querySelector('img');
          movies.push({
            id: parseInt(match[1]),
            title: match[2].trim(),
            poster: img ? img.src : null
          });
        }
      });
      
      return { categories, movies };
    });
    
    console.log(`✅ ${moviesData.categories.length} categorias de filmes`);
    console.log(`✅ ${moviesData.movies.length} filmes extraídos\n`);
    
    // Extrair séries
    console.log('📺 Extraindo séries...');
    await page.goto(`${BASE_URL}/index.php?page=series`, { waitUntil: 'networkidle2' });
    
    const seriesData = await page.evaluate(() => {
      const categories = [];
      const categorySelect = document.querySelector('#series_cat');
      
      if (categorySelect) {
        const options = categorySelect.querySelectorAll('option');
        options.forEach(option => {
          categories.push({
            name: option.textContent.trim(),
            value: option.value
          });
        });
      }
      
      const series = [];
      const seriesItems = document.querySelectorAll('li');
      
      seriesItems.forEach(item => {
        const text = item.textContent.trim();
        const match = text.match(/^(\d+)\s+-\s+(.+)$/);
        if (match) {
          const img = item.querySelector('img');
          series.push({
            id: parseInt(match[1]),
            title: match[2].trim(),
            poster: img ? img.src : null
          });
        }
      });
      
      return { categories, series };
    });
    
    console.log(`✅ ${seriesData.categories.length} categorias de séries`);
    console.log(`✅ ${seriesData.series.length} séries extraídas\n`);
    
    // Salvar resultados
    const allData = {
      channels: channelsData,
      movies: moviesData,
      series: seriesData,
      credentials: {
        username: USERNAME,
        password: PASSWORD
      },
      extractedAt: new Date().toISOString()
    };
    
    await fs.writeFile(
      '/tmp/iptv-extracted-data.json',
      JSON.stringify(allData, null, 2)
    );
    
    console.log('💾 Dados salvos em /tmp/iptv-extracted-data.json');
    console.log('\n🎉 Extração completa!');
    console.log(`📊 Total extraído:`);
    console.log(`   - ${channelsData.categories.length} categorias de canais`);
    console.log(`   - ${channelsData.channels.length} canais`);
    console.log(`   - ${moviesData.categories.length} categorias de filmes`);
    console.log(`   - ${moviesData.movies.length} filmes`);
    console.log(`   - ${seriesData.categories.length} categorias de séries`);
    console.log(`   - ${seriesData.series.length} séries`);
    
  } catch (error) {
    console.error('\n❌ Erro:', error);
  } finally {
    await browser.close();
  }
}

main();
