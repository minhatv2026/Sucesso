import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("movies API", () => {
  it("should list movies by category", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const movies = await caller.movies.listByCategory({ categoryId: 7 });

    expect(movies).toBeDefined();
    expect(Array.isArray(movies)).toBe(true);
  });

  it("should get movie by id", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const movie = await caller.movies.getById({ id: 1 });

    expect(movie).toBeDefined();
    if (movie) {
      expect(movie.id).toBe(1);
      expect(movie.title).toBeDefined();
      expect(movie.streamUrl).toBeDefined();
    }
  });

  it("should search movies", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.movies.search({ query: "Natal" });

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });
});

describe("series API", () => {
  it("should list series by category", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const series = await caller.series.listByCategory({ categoryId: 13 });

    expect(series).toBeDefined();
    expect(Array.isArray(series)).toBe(true);
  });

  it("should get series by id", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const show = await caller.series.getById({ id: 1 });

    expect(show).toBeDefined();
    if (show) {
      expect(show.id).toBe(1);
      expect(show.title).toBeDefined();
    }
  });

  it("should get episodes for series", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const episodes = await caller.series.getEpisodes({ seriesId: 1 });

    expect(episodes).toBeDefined();
    expect(Array.isArray(episodes)).toBe(true);
  });

  it("should get episode by id", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const episode = await caller.series.getEpisodeById({ id: 1 });

    expect(episode).toBeDefined();
    if (episode) {
      expect(episode.id).toBe(1);
      expect(episode.streamUrl).toBeDefined();
    }
  });
});

describe("search API", () => {
  it("should perform global search", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.search.global({ query: "test" });

    expect(results).toBeDefined();
    expect(results.channels).toBeDefined();
    expect(results.movies).toBeDefined();
    expect(results.series).toBeDefined();
    expect(Array.isArray(results.channels)).toBe(true);
    expect(Array.isArray(results.movies)).toBe(true);
    expect(Array.isArray(results.series)).toBe(true);
  });
});
