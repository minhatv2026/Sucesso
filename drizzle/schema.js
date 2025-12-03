import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
/**
 * Categories for organizing content
 */
export const categories = mysqlTable("categories", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["channel", "movie", "series"]).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
/**
 * Live TV Channels
 */
export const channels = mysqlTable("channels", {
    id: int("id").autoincrement().primaryKey(),
    externalId: varchar("externalId", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    categoryId: int("categoryId").notNull(),
    streamUrl: text("streamUrl").notNull(),
    icon: text("icon"),
    quality: varchar("quality", { length: 10 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * EPG (Electronic Program Guide) data for channels
 */
export const epgData = mysqlTable("epgData", {
    id: int("id").autoincrement().primaryKey(),
    channelId: int("channelId").notNull(),
    startTime: varchar("startTime", { length: 10 }).notNull(),
    endTime: varchar("endTime", { length: 10 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
/**
 * Movies (VOD)
 */
export const movies = mysqlTable("movies", {
    id: int("id").autoincrement().primaryKey(),
    externalId: varchar("externalId", { length: 64 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    year: int("year"),
    genres: text("genres").notNull(), // JSON array stored as text
    duration: varchar("duration", { length: 20 }),
    imdbRating: int("imdbRating"), // stored as int (e.g., 61 for 6.1)
    description: text("description"),
    posterUrl: text("posterUrl"),
    categoryId: int("categoryId").notNull(),
    streamUrl: text("streamUrl").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * Series (VOD)
 */
export const series = mysqlTable("series", {
    id: int("id").autoincrement().primaryKey(),
    externalId: varchar("externalId", { length: 64 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    genres: text("genres").notNull(), // JSON array stored as text
    imdbRating: int("imdbRating"), // stored as int (e.g., 70 for 7.0)
    description: text("description"),
    posterUrl: text("posterUrl"),
    categoryId: int("categoryId").notNull(),
    totalSeasons: int("totalSeasons").notNull().default(1),
    totalEpisodes: int("totalEpisodes").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * Episodes for series
 */
export const episodes = mysqlTable("episodes", {
    id: int("id").autoincrement().primaryKey(),
    externalId: varchar("externalId", { length: 64 }).notNull().unique(),
    seriesId: int("seriesId").notNull(),
    season: int("season").notNull(),
    episode: int("episode").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    streamUrl: text("streamUrl").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * User watchlist (movies and series user wants to watch)
 */
export const userWatchlist = mysqlTable("userWatchlist", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    contentType: mysqlEnum("contentType", ["movie", "series"]).notNull(),
    contentId: int("contentId").notNull(),
    addedAt: timestamp("addedAt").defaultNow().notNull(),
});
/**
 * User viewing history
 */
export const userHistory = mysqlTable("userHistory", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    contentType: mysqlEnum("contentType", ["channel", "movie", "episode"]).notNull(),
    contentId: int("contentId").notNull(),
    watchedAt: timestamp("watchedAt").defaultNow().notNull(),
    progress: int("progress").default(0), // Progress in seconds
});
/**
 * User favorites (channels, movies, series)
 */
export const userFavorites = mysqlTable("userFavorites", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    contentType: mysqlEnum("contentType", ["channel", "movie", "series"]).notNull(),
    contentId: int("contentId").notNull(),
    addedAt: timestamp("addedAt").defaultNow().notNull(),
});
