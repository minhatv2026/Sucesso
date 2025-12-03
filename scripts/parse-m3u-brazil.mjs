import fs from 'fs/promises';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// URL da playlist brasileira do IPTV-org
const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/countries/br.m3u';

console.log('🇧🇷 Iniciando extração de canais brasileiros...\n');

async function downloadPlaylist(url) {
  console.log(`📥 Baixando playlist de ${url}...`);
  const response = await fetch(url);
  const content = await response.text();
  console.log(`✅ Playlist baixada (${content.length} bytes)\n`);
  return content;
}

function parseM3U(content) {
  console.log('🔍 Parseando arquivo M3U...');
  
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Linha de informação do canal (#EXTINF)
    if (line.startsWith('#EXTINF:')) {
      currentChannel = {};
      
      // Extrair atributos
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = line.match(/group-title="([^"]*)"/);
      
      if (tvgIdMatch) currentChannel.tvgId = tvgIdMatch[1];
      if (tvgNameMatch) currentChannel.tvgName = tvgNameMatch[1];
      if (tvgLogoMatch) currentChannel.logo = tvgLogoMatch[1];
      if (groupTitleMatch) currentChannel.category = groupTitleMatch[1];
      
      // Extrair nome do canal (última parte após a vírgula)
      const nameMatch = line.match(/,(.+)$/);
      if (nameMatch) {
        currentChannel.name = nameMatch[1].trim();
      }
    }
    
    // Linha de URL do stream
    else if (line && !line.startsWith('#') && currentChannel) {
      currentChannel.streamUrl = line;
      channels.push(currentChannel);
      currentChannel = null;
    }
  }
  
  console.log(`✅ ${channels.length} canais extraídos\n`);
  return channels;
}

async function saveToDatabase(channels) {
  console.log('💾 Salvando canais no banco de dados...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // Limpar canais existentes
    await connection.execute('DELETE FROM channels');
    console.log('🗑️  Canais antigos removidos');
    
    // Inserir novos canais
    for (const channel of channels) {
      await connection.execute(
        `INSERT INTO channels (name, logo, category, stream_url, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          channel.name || 'Sem nome',
          channel.logo || null,
          channel.category || 'Geral',
          channel.streamUrl
        ]
      );
    }
    
    console.log(`✅ ${channels.length} canais salvos no banco de dados\n`);
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    // Baixar playlist
    const content = await downloadPlaylist(PLAYLIST_URL);
    
    // Salvar cópia local
    await fs.writeFile('/tmp/brazil-playlist.m3u', content);
    console.log('💾 Cópia salva em /tmp/brazil-playlist.m3u\n');
    
    // Parsear M3U
    const channels = parseM3U(content);
    
    // Salvar JSON para análise
    await fs.writeFile(
      '/tmp/brazil-channels.json',
      JSON.stringify(channels, null, 2)
    );
    console.log('💾 JSON salvo em /tmp/brazil-channels.json\n');
    
    // Salvar no banco de dados
    await saveToDatabase(channels);
    
    console.log('🎉 Extração completa!');
    console.log(`📊 Total: ${channels.length} canais brasileiros`);
    
    // Mostrar estatísticas por categoria
    const categoryCounts = {};
    channels.forEach(ch => {
      const cat = ch.category || 'Sem categoria';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    console.log('\n📈 Canais por categoria:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   - ${cat}: ${count}`);
      });
    
  } catch (error) {
    console.error('\n❌ Erro:', error);
    process.exit(1);
  }
}

main();
