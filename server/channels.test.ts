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

describe("channels API", () => {
  it("should list channels by category", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const channels = await caller.channels.listByCategory({ categoryId: 1 });

    expect(channels).toBeDefined();
    expect(Array.isArray(channels)).toBe(true);
  });

  it("should get channel by id", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const channel = await caller.channels.getById({ id: 1 });

    expect(channel).toBeDefined();
    if (channel) {
      expect(channel.id).toBe(1);
      expect(channel.name).toBeDefined();
      expect(channel.streamUrl).toBeDefined();
    }
  });

  it("should search channels", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.channels.search({ query: "Fazenda" });

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });

  it("should get EPG for channel", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const epg = await caller.channels.getEpg({ channelId: 1 });

    expect(epg).toBeDefined();
    expect(Array.isArray(epg)).toBe(true);
  });
});
