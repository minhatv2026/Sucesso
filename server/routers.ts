import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
        return await db.getChannelsByCategory(input.categoryId);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getChannelById(input.id);
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
        return await db.getMoviesByCategory(input.categoryId);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMovieById(input.id);
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchMovies(input.query);
      }),
    
    listByYear: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(async ({ input }) => {
        return await db.getMoviesByYear(input.year);
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
    
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchSeries(input.query);
      }),
    
    getEpisodes: publicProcedure
      .input(z.object({ 
        seriesId: z.number(),
        season: z.number().optional()
      }))
      .query(async ({ input }) => {
        return await db.getEpisodesBySeries(input.seriesId, input.season);
      }),
    
    getEpisodeById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEpisodeById(input.id);
      }),
  }),

  watchlist: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWatchlist(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        contentType: z.enum(["movie", "series"]),
        contentId: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addToWatchlist(ctx.user.id, input.contentType, input.contentId);
        return { success: true };
      }),
    
    remove: protectedProcedure
      .input(z.object({
        contentType: z.enum(["movie", "series"]),
        contentId: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromWatchlist(ctx.user.id, input.contentType, input.contentId);
        return { success: true };
      }),
  }),

  history: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserHistory(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        contentType: z.enum(["channel", "movie", "episode"]),
        contentId: z.number(),
        progress: z.number().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addToHistory(ctx.user.id, input.contentType, input.contentId, input.progress);
        return { success: true };
      }),
    
    updateProgress: protectedProcedure
      .input(z.object({
        contentType: z.enum(["channel", "movie", "episode"]),
        contentId: z.number(),
        progress: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateHistoryProgress(ctx.user.id, input.contentType, input.contentId, input.progress);
        return { success: true };
      }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFavorites(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        contentType: z.enum(["channel", "movie", "series"]),
        contentId: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addToFavorites(ctx.user.id, input.contentType, input.contentId);
        return { success: true };
      }),
    
    remove: protectedProcedure
      .input(z.object({
        contentType: z.enum(["channel", "movie", "series"]),
        contentId: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromFavorites(ctx.user.id, input.contentType, input.contentId);
        return { success: true };
      }),
  }),

  search: router({
    global: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.globalSearch(input.query);
      }),
  }),
});

export type AppRouter = typeof appRouter;
