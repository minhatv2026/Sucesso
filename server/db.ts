import { eq, and, like, or, desc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  categories, 
  channels, 
  epgData, 
  movies, 
  series, 
  episodes,
  userWatchlist,
  userHistory,
  userFavorites,
  type Category,
  type Channel,
  type Movie,
  type Series,
  type Episode,
  type EpgData
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Categories
export async function getCategoriesByType(type: "channel" | "movie" | "series"): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).where(eq(categories.type, type));
}

// Channels
export async function getChannelsByCategory(categoryId: number): Promise<Channel[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(channels).where(eq(channels.categoryId, categoryId));
}

export async function getChannelById(channelId: number): Promise<Channel | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(channels).where(eq(channels.id, channelId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchChannels(query: string): Promise<Channel[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(channels).where(like(channels.name, `%${query}%`));
}

// EPG
export async function getEpgByChannel(channelId: number): Promise<EpgData[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(epgData).where(eq(epgData.channelId, channelId));
}

// Movies
export async function getMoviesByCategory(categoryId: number): Promise<Movie[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(movies).where(eq(movies.categoryId, categoryId));
}

export async function getMovieById(movieId: number): Promise<Movie | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(movies).where(eq(movies.id, movieId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(movies).where(like(movies.title, `%${query}%`));
}

export async function getMoviesByYear(year: number): Promise<Movie[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(movies).where(eq(movies.year, year));
}

// Series
export async function getSeriesByCategory(categoryId: number): Promise<Series[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(series).where(eq(series.categoryId, categoryId));
}

export async function getSeriesById(seriesId: number): Promise<Series | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(series).where(eq(series.id, seriesId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchSeries(query: string): Promise<Series[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(series).where(like(series.title, `%${query}%`));
}

// Episodes
export async function getEpisodesBySeries(seriesId: number, season?: number): Promise<Episode[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (season !== undefined) {
    return await db.select().from(episodes)
      .where(and(eq(episodes.seriesId, seriesId), eq(episodes.season, season)));
  }
  
  return await db.select().from(episodes).where(eq(episodes.seriesId, seriesId));
}

export async function getEpisodeById(episodeId: number): Promise<Episode | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(episodes).where(eq(episodes.id, episodeId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Watchlist
export async function getUserWatchlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(userWatchlist).where(eq(userWatchlist.userId, userId));
}

export async function addToWatchlist(userId: number, contentType: "movie" | "series", contentId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userWatchlist).values({ userId, contentType, contentId });
}

export async function removeFromWatchlist(userId: number, contentType: "movie" | "series", contentId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(userWatchlist).where(
    and(
      eq(userWatchlist.userId, userId),
      eq(userWatchlist.contentType, contentType),
      eq(userWatchlist.contentId, contentId)
    )
  );
}

// History
export async function getUserHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(userHistory)
    .where(eq(userHistory.userId, userId))
    .orderBy(desc(userHistory.watchedAt));
}

export async function addToHistory(
  userId: number, 
  contentType: "channel" | "movie" | "episode", 
  contentId: number,
  progress?: number
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userHistory).values({ 
    userId, 
    contentType, 
    contentId,
    progress: progress ?? 0
  });
}

export async function updateHistoryProgress(
  userId: number,
  contentType: "channel" | "movie" | "episode",
  contentId: number,
  progress: number
) {
  const db = await getDb();
  if (!db) return;
  
  // Check if entry exists
  const existing = await db.select().from(userHistory)
    .where(
      and(
        eq(userHistory.userId, userId),
        eq(userHistory.contentType, contentType),
        eq(userHistory.contentId, contentId)
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(userHistory)
      .set({ progress, watchedAt: new Date() })
      .where(eq(userHistory.id, existing[0]!.id));
  } else {
    await addToHistory(userId, contentType, contentId, progress);
  }
}

// Favorites
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
}

export async function addToFavorites(
  userId: number, 
  contentType: "channel" | "movie" | "series", 
  contentId: number
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userFavorites).values({ userId, contentType, contentId });
}

export async function removeFromFavorites(
  userId: number, 
  contentType: "channel" | "movie" | "series", 
  contentId: number
) {
  const db = await getDb();
  if (!db) return;
  await db.delete(userFavorites).where(
    and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.contentType, contentType),
      eq(userFavorites.contentId, contentId)
    )
  );
}

// Global search
export async function globalSearch(query: string) {
  const db = await getDb();
  if (!db) return { channels: [], movies: [], series: [] };
  
  const [channelsResult, moviesResult, seriesResult] = await Promise.all([
    searchChannels(query),
    searchMovies(query),
    searchSeries(query)
  ]);
  
  return {
    channels: channelsResult,
    movies: moviesResult,
    series: seriesResult
  };
}
