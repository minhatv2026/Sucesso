# IPTV Streaming Platform - TODO

## Backend & Database
- [x] Criar schema do banco de dados (canais, filmes, séries, episódios, watchlist, histórico, favoritos)
- [x] Criar seed data com canais, filmes e séries de exemplo
- [x] Implementar APIs tRPC para Live TV (listar canais, obter URL streaming, obter EPG)
- [x] Implementar APIs tRPC para Filmes (listar por categoria, buscar, obter URL streaming)
- [x] Implementar APIs tRPC para Séries (listar por categoria, listar episódios, obter URL streaming)
- [x] Implementar APIs tRPC para Watchlist/Favoritos
- [x] Implementar APIs tRPC para Histórico de visualização
- [x] Implementar busca global (canais, filmes, séries)

## Frontend - Layout & Componentes
- [x] Criar layout responsivo base (Mobile/Desktop/TV)
- [x] Criar componente de navegação (sidebar para desktop, menu hamburger para mobile)
- [x] Criar componente VideoPlayer (suporte HLS e MP4)
- [x] Criar componente CategoryGrid para exibir conteúdo)
- [x] Criar componente EPG para guia de programação

## Frontend - Páginas
- [x] Criar página Home com destaques e recomendações
- [x] Criar página Live TV com lista de canais e player
- [x] Criar página Movies com grid de filmes e filtros
- [x] Criar página Series com grid de séries e seletor de episódios
- [x] Criar página Search com busca global
- [x] Criar página Profile com histórico e configurações

## Funcionalidades
- [x] Implementar autenticação GitHub OAuth (já configurado no template)
- [ ] Implementar navegação por teclado para TV
- [x] Implementar favoritos/marcadores
- [x] Implementar watchlist
- [x] Implementar histórico de visualização
- [x] Implementar "continuar de onde parou"
- [x] Implementar filtros avançados (ano, gênero, rating)

## Testes & Deploy
- [x] Escrever testes unitários com Vitest
- [x] Criar checkpoint final
- [ ] Configurar deploy no Render.com
- [ ] Configurar CI/CD com GitHub Actions

## Integração com API Real IPTV Perfeito
- [ ] Criar serviço para conectar com API do IPTV Perfeito
- [ ] Extrair todas as categorias de canais
- [ ] Extrair todos os canais com IDs
- [ ] Extrair todas as categorias de filmes
- [ ] Extrair todos os filmes com metadados
- [ ] Extrair todas as categorias de séries
- [ ] Extrair todas as séries com episódios
- [ ] Armazenar dados no PostgreSQL
- [ ] Gerar URLs de streaming com credenciais ocultas no backend
- [ ] Testar integração completa
- [ ] Fazer commit no GitHub
- [ ] Deploy no Render.com
