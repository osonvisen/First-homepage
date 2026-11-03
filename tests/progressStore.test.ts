import { describe, expect, it } from "vitest";
import { createLocalProgressStore } from "../src/games/progressStore.ts";
import type { GameId } from "../src/types.ts";

const FJORDGLIMT = "fjordglimt" as GameId;
const MILLIONENE = "millionene" as GameId;

const storageWith = (items: Record<string, string>) => ({
  getItem: (key: string) => items[key] ?? null,
});

const blocked = (): never => {
  throw new Error("SecurityError: storage is blocked");
};

describe("createLocalProgressStore", () => {
  it("reads the progress record the game wrote", async () => {
    const store = createLocalProgressStore(() => storageWith({ "sql-games:progress:fjordglimt": '{"version":1,"status":"solved"}' }));
    expect(await store.read(FJORDGLIMT)).toBe("solved");
  });

  it("reads each game's own record", async () => {
    const store = createLocalProgressStore(() => storageWith({ "sql-games:progress:millionene": '{"version":1,"status":"started"}' }));
    expect(await store.read(FJORDGLIMT)).toBe("notStarted");
    expect(await store.read(MILLIONENE)).toBe("started");
  });

  it("does not read the game's own save", async () => {
    const store = createLocalProgressStore(() => storageWith({ "sql-games:fjordglimt": '{"version":1,"stage":2}' }));
    expect(await store.read(FJORDGLIMT)).toBe("notStarted");
  });

  it("treats a damaged record as not started", async () => {
    const store = createLocalProgressStore(() => storageWith({ "sql-games:progress:fjordglimt": "{oops" }));
    expect(await store.read(FJORDGLIMT)).toBe("notStarted");
  });

  it("treats blocked storage as not started", async () => {
    const store = createLocalProgressStore(blocked);
    expect(await store.read(FJORDGLIMT)).toBe("notStarted");
  });

  it("treats a failing read as not started", async () => {
    const store = createLocalProgressStore(() => ({ getItem: blocked }));
    expect(await store.read(FJORDGLIMT)).toBe("notStarted");
  });
});
