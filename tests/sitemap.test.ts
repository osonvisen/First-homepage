import { describe, expect, it } from "vitest";
import { buildSitemap } from "../scripts/sitemap.ts";
import type { Game, GameId } from "../src/types.ts";

const game = (id: string, available: boolean): Game => ({ id: id as GameId, languages: "SQL", difficulty: 1, available });

const sitemap = buildSitemap([game("fjordglimt", true), game("innbruddet", false)], "2026-11-03");

/** The <url> block for a page, so its hreflang links can be checked on their own. */
const entryFor = (loc: string) => sitemap.match(new RegExp(`<url><loc>${loc}</loc>[\\s\\S]*?</url>`))?.[0] ?? "";

const hreflangsOf = (entry: string) =>
  Object.fromEntries([...entry.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));

describe("buildSitemap", () => {
  it("is one XML urlset", () => {
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset')).toBe(true);
    expect(sitemap.match(/<urlset/g)).toHaveLength(1);
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });

  it.each([
    ["https://orjans.no/", { nb: "https://orjans.no/", en: "https://orjans.no/en/", "x-default": "https://orjans.no/" }],
    ["https://orjans.no/en/", { nb: "https://orjans.no/", en: "https://orjans.no/en/", "x-default": "https://orjans.no/" }],
    ["https://orjans.no/spill/", { nb: "https://orjans.no/spill/", en: "https://orjans.no/en/games/", "x-default": "https://orjans.no/spill/" }],
    ["https://orjans.no/en/games/", { nb: "https://orjans.no/spill/", en: "https://orjans.no/en/games/", "x-default": "https://orjans.no/spill/" }],
  ])("lists %s with the language versions of the same page", (loc, hreflang) => {
    const entry = entryFor(loc);
    expect(entry).toContain("<lastmod>2026-11-03</lastmod>");
    expect(hreflangsOf(entry)).toEqual(hreflang);
  });

  it("lists a game that can be played", () => {
    expect(sitemap).toContain("<url><loc>https://orjans.no/fjordglimt/</loc></url>");
  });

  it("leaves out a game that is not available yet", () => {
    expect(sitemap).not.toContain("innbruddet");
  });
});
