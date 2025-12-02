import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { iptvService } from "./iptv-service";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  categories: router({
    listByType: publicProcedure
      .input(z.object({ type: z.enum(["channel", "movie", "series"]) }))
      .query(async ({ input }) => {
        return await db.getCategoriesByType(input.type);
      }),
  }),

  channels: router({
    listByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        const channels = await db.getChannelsByCategory(input.categoryId);
        // Gerar URLs de streaming com credenciais ocultas
        return channels.map((ch) => ({
          ...ch,
          streamUrl: iptvService.generateStreamUrl("live", ch.id),
        }));
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const channel = await db.getChannelById(input.id);
        if (!channel) return null;
        return {
          ...channel,
          streamUrl: iptvService.generateStreamUrl("live", channel.id),
        };
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchChannels(input.query);
      }),

    getEpg: publicProcedure
      .input(z.object({ channelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEpgByChannel(input.channelId);
      }),
  }),

  movies: router({
    listByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        const movies = await db.getMoviesByCategory(input.categoryId);
        return movies.map((m) => ({
          ...m,
          streamUrl: iptvService.generateStreamUrl("movie", m.id),
        }));
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const movie = await db.getMovieById(input.id);
        if (!movie) return null;
        return {
          ...movie,
          streamUrl: iptvService.generateStreamUrl("movie", movie.id),
        };
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchMovies(input.query);
      }),
  }),

  series: router({
    listByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSeriesByCategory(input.categoryId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getSeriesById(input.id);
      }),

    getEpisodes: publicProcedure
      .input(z.object({ seriesId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEpisodesBySeries(input.seriesId);
      }),

    getEpisodeById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const episode = await db.getEpisodeById(input.id);
        if (!episode) return null;
        return {
          ...episode,
          streamUrl: iptvService.generateStreamUrl("series", episode.id),
        };
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchSeries(input.query);
      }),
  }),

  search: router({
    global: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const [channels, movies, series] = await Promise.all([
          db.searchChannels(input.query),
          db.searchMovies(input.query),
          db.searchSeries(input.query),
        ]);

        return {
          channels: channels.map((ch) => ({
            ...ch,
            streamUrl: iptvService.generateStreamUrl("live", ch.id),
          })),
          movies: movies.map((m) => ({
            ...m,
            streamUrl: iptvService.generateStreamUrl("movie", m.id),
          })),
          series,
        };
      }),
  }),

  watchlist: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWatchlist(ctx.user.id);
    }),

    add: protectedProcedure
      .input(
        z.object({
          contentType: z.enum(["movie", "series"]),
          contentId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await db.addToWatchlist(ctx.user.id, input.contentType, input.contentId);
      }),

    remove: protectedProcedure
      .input(z.object({ id: z.number(), contentType: z.enum(["movie", "series"]), contentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.removeFromWatchlist(ctx.user.id, input.contentType, input.contentId);
      }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFavorites(ctx.user.id);
    }),

    add: protectedProcedure
      .input(
        z.object({
          contentType: z.enum(["movie", "series"]),
          contentId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await db.addToFavorites(ctx.user.id, input.contentType, input.contentId);
      }),

    remove: protectedProcedure
      .input(z.object({ id: z.number(), contentType: z.enum(["movie", "series"]), contentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.removeFromFavorites(ctx.user.id, input.contentType, input.contentId);
      }),
  }),

  history: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserHistory(ctx.user.id);
    }),

    add: protectedProcedure
      .input(
        z.object({
          contentType: z.enum(["channel", "movie", "episode"]),
          contentId: z.number(),
          progress: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await db.addToHistory(ctx.user.id, input.contentType, input.contentId, input.progress);
      }),
  }),
});

export type AppRouter = typeof appRouter;
