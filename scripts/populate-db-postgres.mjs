import fs from 'fs/promises';
import pg from 'pg';

const { Client } = pg;

console.log('💾 Populando banco de dados PostgreSQL...\n');

async function main() {
  // Ler canais extraídos
  const channelsJson = await fs.readFile('/tmp/brazil-channels.json', 'utf-8');
  const channels = JSON.parse(channelsJson);
  
  console.log(`📊 ${channels.length} canais carregados do JSON\n`);
  
  // Conectar ao PostgreSQL
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL\n');
    
    // Limpar canais existentes
    await client.query('DELETE FROM channels');
    console.log('🗑️  Canais antigos removidos\n');
    
    // Inserir novos canais
    let inserted = 0;
    for (const channel of channels) {
      try {
        await client.query(
          `INSERT INTO channels (name, logo, category, stream_url, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [
            channel.name || 'Sem nome',
            channel.logo || null,
            channel.category || 'Geral',
            channel.streamUrl
          ]
        );
        inserted++;
        
        if (inserted % 50 === 0) {
          console.log(`   ${inserted}/${channels.length} canais inseridos...`);
        }
      } catch (error) {
        console.error(`   ❌ Erro ao inserir ${channel.name}:`, error.message);
      }
    }
    
    console.log(`\n✅ ${inserted} canais salvos no banco de dados!\n`);
    
    // Estatísticas por categoria
    const result = await client.query(
      'SELECT category, COUNT(*) as count FROM channels GROUP BY category ORDER BY count DESC'
    );
    
    console.log('📈 Canais por categoria:');
    result.rows.forEach(row => {
      console.log(`   - ${row.category}: ${row.count}`);
    });
    
    console.log('\n🎉 Banco de dados populado com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
