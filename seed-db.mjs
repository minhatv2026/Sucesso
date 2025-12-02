import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Sample streaming URLs based on API documentation
const STREAM_BASE = "http://iptvperfeito.ddns.net:25461";
const USERNAME = "491548830";
const PASSWORD = "491548830";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Insert categories
    console.log("📁 Creating categories...");
    await db.execute(`
      INSERT INTO categories (name, type) VALUES
      ('A Fazenda', 'channel'),
      ('Abertos', 'channel'),
      ('Esportes', 'channel'),
      ('Filmes e Séries', 'channel'),
      ('Infantil', 'channel'),
      ('Notícias', 'channel'),
      ('Lançamentos 2024', 'movie'),
      ('Ação', 'movie'),
      ('Comédia', 'movie'),
      ('Drama', 'movie'),
      ('Terror', 'movie'),
      ('Romance', 'movie'),
      ('Netflix', 'series'),
      ('Amazon Prime Video', 'series'),
      ('Disney Plus', 'series'),
      ('HBO Max', 'series'),
      ('Apple TV Plus', 'series')
    `);

    // Insert sample channels
    console.log("📺 Creating channels...");
    await db.execute(`
      INSERT INTO channels (externalId, name, categoryId, streamUrl, icon, quality) VALUES
      ('822101', 'A Fazenda - Sinal 1', 1, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/822101.m3u8', 'https://i.imgur.com/placeholder1.png', 'FHD'),
      ('822102', 'A Fazenda - Sinal 2', 1, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/822102.m3u8', 'https://i.imgur.com/placeholder2.png', 'FHD'),
      ('100001', 'Globo SP', 2, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/100001.m3u8', 'https://i.imgur.com/globo.png', 'FHD'),
      ('100002', 'SBT', 2, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/100002.m3u8', 'https://i.imgur.com/sbt.png', 'HD'),
      ('100003', 'Record', 2, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/100003.m3u8', 'https://i.imgur.com/record.png', 'HD'),
      ('100004', 'Band', 2, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/100004.m3u8', 'https://i.imgur.com/band.png', 'HD'),
      ('200001', 'ESPN', 3, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/200001.m3u8', 'https://i.imgur.com/espn.png', 'FHD'),
      ('200002', 'ESPN 2', 3, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/200002.m3u8', 'https://i.imgur.com/espn2.png', 'FHD'),
      ('200003', 'SporTV', 3, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/200003.m3u8', 'https://i.imgur.com/sportv.png', 'FHD'),
      ('300001', 'HBO', 4, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/300001.m3u8', 'https://i.imgur.com/hbo.png', 'FHD'),
      ('300002', 'HBO 2', 4, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/300002.m3u8', 'https://i.imgur.com/hbo2.png', 'FHD'),
      ('400001', 'Cartoon Network', 5, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/400001.m3u8', 'https://i.imgur.com/cartoon.png', 'HD'),
      ('400002', 'Disney Channel', 5, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/400002.m3u8', 'https://i.imgur.com/disney.png', 'HD'),
      ('500001', 'GloboNews', 6, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/500001.m3u8', 'https://i.imgur.com/globonews.png', 'FHD'),
      ('500002', 'CNN Brasil', 6, '${STREAM_BASE}/live/${USERNAME}/${PASSWORD}/500002.m3u8', 'https://i.imgur.com/cnn.png', 'HD')
    `);

    // Insert EPG data for sample channels
    console.log("📅 Creating EPG data...");
    await db.execute(`
      INSERT INTO epgData (channelId, startTime, endTime, title, description) VALUES
      (1, '20:00', '21:00', 'A Fazenda - Episódio 1', 'Acompanhe os peões na primeira semana de confinamento'),
      (1, '21:00', '22:30', 'A Fazenda - Ao Vivo', 'Transmissão ao vivo direto da sede'),
      (3, '20:30', '21:30', 'Jornal Nacional', 'Principais notícias do Brasil e do mundo'),
      (3, '21:30', '22:30', 'Novela das 9', 'Capítulo de hoje da novela'),
      (7, '19:00', '21:00', 'Futebol Ao Vivo', 'Campeonato Brasileiro - Rodada 30'),
      (7, '21:00', '22:00', 'SportsCenter', 'Melhores momentos do esporte')
    `);

    // Insert sample movies
    console.log("🎬 Creating movies...");
    await db.execute(`
      INSERT INTO movies (externalId, title, year, genres, duration, imdbRating, description, posterUrl, categoryId, streamUrl) VALUES
      ('860863', 'Uma Faísca de Natal', 2022, '["Cinema TV", "Comédia", "Drama", "Romance"]', '01:25:00', 61, 'Uma viúva relutante em dirigir o presépio de Natal da cidade encontra um amor inesperado quando conhece um homem charmoso.', 'https://image.tmdb.org/t/p/w500/placeholder1.jpg', 7, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860863.mp4'),
      ('860864', 'Velozes e Furiosos 10', 2023, '["Ação", "Aventura"]', '02:21:00', 58, 'Dom Toretto e sua família enfrentam o inimigo mais letal que já encontraram.', 'https://image.tmdb.org/t/p/w500/placeholder2.jpg', 8, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860864.mp4'),
      ('860865', 'Guardiões da Galáxia Vol. 3', 2023, '["Ação", "Aventura", "Ficção"]', '02:30:00', 79, 'A equipe dos Guardiões embarca em uma missão perigosa para salvar um dos seus.', 'https://image.tmdb.org/t/p/w500/placeholder3.jpg', 8, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860865.mp4'),
      ('860866', 'Barbie', 2023, '["Comédia", "Fantasia", "Aventura"]', '01:54:00', 70, 'Barbie e Ken vivem no colorido mundo da Barbieland, mas logo descobrem o mundo real.', 'https://image.tmdb.org/t/p/w500/placeholder4.jpg', 9, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860866.mp4'),
      ('860867', 'Oppenheimer', 2023, '["Drama", "História"]', '03:00:00', 85, 'A história de J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.', 'https://image.tmdb.org/t/p/w500/placeholder5.jpg', 10, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860867.mp4'),
      ('860868', 'A Freira II', 2023, '["Terror", "Suspense"]', '01:50:00', 56, 'A irmã Irene enfrenta novamente a força demoníaca Valak.', 'https://image.tmdb.org/t/p/w500/placeholder6.jpg', 11, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860868.mp4'),
      ('860869', 'Amor e Gelato', 2022, '["Romance", "Comédia"]', '01:58:00', 57, 'Uma jovem viaja para a Itália e descobre o amor, a aventura e a gelato.', 'https://image.tmdb.org/t/p/w500/placeholder7.jpg', 12, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860869.mp4'),
      ('860870', 'John Wick 4: Baba Yaga', 2023, '["Ação"]', '02:49:00', 78, 'John Wick descobre um caminho para derrotar a Alta Cúpula.', 'https://image.tmdb.org/t/p/w500/placeholder8.jpg', 8, '${STREAM_BASE}/movie/${USERNAME}/${PASSWORD}/860870.mp4')
    `);

    // Insert sample series
    console.log("📺 Creating series...");
    await db.execute(`
      INSERT INTO series (externalId, title, genres, imdbRating, description, posterUrl, categoryId, totalSeasons, totalEpisodes) VALUES
      ('5391', 'The Midnight Romance in Hagwon', '["Drama"]', 70, 'A vida estável e tranquila da veterana professora de uma academia é abalada quando um ex-aluno retorna como colega de trabalho.', 'https://image.tmdb.org/t/p/w500/series1.jpg', 13, 1, 6),
      ('5392', 'Stranger Things', '["Ficção", "Drama", "Terror"]', 87, 'Quando um garoto desaparece, a cidade toda participa nas buscas. Mas o que encontram são segredos, forças sobrenaturais e uma menina.', 'https://image.tmdb.org/t/p/w500/series2.jpg', 13, 4, 34),
      ('5393', 'The Boys', '["Ação", "Ficção"]', 84, 'Um grupo de vigilantes decide acabar com super-heróis corruptos que abusam de seus superpoderes.', 'https://image.tmdb.org/t/p/w500/series3.jpg', 14, 4, 32),
      ('5394', 'The Mandalorian', '["Ficção", "Aventura"]', 86, 'As aventuras de um caçador de recompensas solitário nos confins da galáxia.', 'https://image.tmdb.org/t/p/w500/series4.jpg', 15, 3, 24),
      ('5395', 'The Last of Us', '["Drama", "Ficção", "Aventura"]', 88, 'Joel e Ellie atravessam os Estados Unidos pós-apocalíptico em uma jornada mortal.', 'https://image.tmdb.org/t/p/w500/series5.jpg', 16, 1, 9),
      ('5396', 'Ted Lasso', '["Comédia", "Drama"]', 84, 'Um treinador de futebol americano é contratado para treinar um time de futebol inglês.', 'https://image.tmdb.org/t/p/w500/series6.jpg', 17, 3, 34)
    `);

    // Insert episodes for series
    console.log("🎞️ Creating episodes...");
    await db.execute(`
      INSERT INTO episodes (externalId, seriesId, season, episode, title, streamUrl) VALUES
      ('732922', 1, 1, 1, 'The Midnight Romance in Hagwon S01 E01', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/732922.mp4'),
      ('732923', 1, 1, 2, 'The Midnight Romance in Hagwon S01 E02', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/732923.mp4'),
      ('732924', 1, 1, 3, 'The Midnight Romance in Hagwon S01 E03', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/732924.mp4'),
      ('732925', 1, 1, 4, 'The Midnight Romance in Hagwon S01 E04', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/732925.mp4'),
      ('732926', 1, 1, 5, 'The Midnight Romance in Hagwon S01 E05', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/732926.mp4'),
      ('732927', 1, 1, 6, 'The Midnight Romance in Hagwon S01 E06', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/732927.mp4'),
      ('800001', 2, 1, 1, 'Stranger Things S01 E01 - Chapter One: The Vanishing of Will Byers', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/800001.mp4'),
      ('800002', 2, 1, 2, 'Stranger Things S01 E02 - Chapter Two: The Weirdo on Maple Street', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/800002.mp4'),
      ('800003', 2, 1, 3, 'Stranger Things S01 E03 - Chapter Three: Holly, Jolly', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/800003.mp4'),
      ('900001', 3, 1, 1, 'The Boys S01 E01 - The Name of the Game', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/900001.mp4'),
      ('900002', 3, 1, 2, 'The Boys S01 E02 - Cherry', '${STREAM_BASE}/series/${USERNAME}/${PASSWORD}/900002.mp4')
    `);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("🎉 Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  });
