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

## Correções Urgentes

- [x] Corrigir erro de conexão frontend-backend
- [x] Remover dependência de OAuth temporariamente
- [ ] Configurar variáveis de ambiente mínimas necessárias
- [ ] Testar app funcionando sem autenticação

## Extração de Dados com Credenciais Autorizadas

- [x] Testar site atual funcionando
- [x] Criar script de extração completa usando credenciais 066693644/066693644
- [ ] Extrair todas as categorias de Live TV
- [ ] Extrair todos os canais ao vivo com IDs e metadados
- [ ] Extrair todas as categorias de filmes
- [ ] Extrair todos os filmes com metadados completos
- [ ] Extrair todas as categorias de séries
- [ ] Extrair todas as séries com temporadas e episódios
- [ ] Popular banco de dados PostgreSQL com todos os dados
- [ ] Atualizar backend para gerar URLs de streaming com credenciais ocultas
- [ ] Testar streaming de canais, filmes e séries
- [ ] Fazer checkpoint e deploy final


## Integração com Playlists M3U Públicas

- [x] Pesquisar playlists M3U brasileiras públicas e gratuitas
- [x] Criar parser de arquivos M3U/M3U8
- [x] Extrair canais, filmes e séries das playlists
- [x] Popular frontend com 205 canais brasileiros (JSON estático)
- [ ] Testar streaming dos canais no site
- [ ] Fazer checkpoint final

## Extração de Canais do IPTV Perfeito

- [x] Fazer login no webplayer do IPTV Perfeito
- [x] Extrair lista completa de canais (Globo, SBT, Record, Cartoon, SporTV, etc.) - 1.003 canais!
- [x] Gerar URLs de streaming com credenciais 066693644/066693644 embutidas
- [x] Substituir JSON de canais
- [ ] Fazer commit, push e aguardar deploy
