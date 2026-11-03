// Locks the <head> of every page. The page data is a fixture with today's name and roles,
// not src/content, so that editing the role in Pages CMS does not make the deploy fail.
import { describe, expect, it } from "vitest";
import { buildHead } from "../scripts/head.ts";
import type { Route } from "../src/routes.ts";
import type { Difficulty, GameCard, GameId, Lang, PageData } from "../src/types.ts";

const ROLES: Record<Lang, string> = { nb: "Programvareutvikler", en: "Software Developer" };

const card = (id: string, difficulty: Difficulty, available: boolean): GameCard => ({
  id: id as GameId,
  languages: "SQL",
  difficulty,
  available,
  title: `Title ${id}`,
  description: `About ${id}`,
  skills: "JOIN",
  studyFit: "Early",
  url: `/${id}/`,
});

const pageData = (lang: Lang): PageData => ({
  lang,
  shared: { name: "Ørjan Sønvisen", location: "Holmestrand" },
  text: { role: ROLES[lang], intro: `Intro ${lang}`, gamesPageIntro: `Games intro ${lang}` },
  games: [card("first", 1, true), card("second", 2, true), card("third", 3, false)],
});

const head = (route: Route) => buildHead(route, pageData(route.lang));

const titleOf = (html: string) => html.match(/<title>([^<]*)<\/title>/)?.[1];
const canonicalOf = (html: string) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const hreflangsOf = (html: string) =>
  Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));

// Only the parts of the games page's structured data the tests read.
interface ListedGame { position: number; item: { name: string; url?: string; inLanguage: string; educationalLevel: string; creativeWorkStatus: string } }
interface GamesStructuredData { "@type": string; url: string; inLanguage: string; mainEntity: { "@type": string; itemListElement: ListedGame[] } }

const structuredDataOf = (html: string): GamesStructuredData => {
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (json === undefined) throw new Error("No structured data in head");
  return JSON.parse(json);
};

describe.each([
  {
    route: { page: "home", lang: "nb" },
    title: "Ørjan Sønvisen – Programvareutvikler (C#/.NET)",
    canonical: "https://orjans.no/",
    hreflang: { nb: "https://orjans.no/", en: "https://orjans.no/en/", "x-default": "https://orjans.no/" },
  },
  {
    route: { page: "home", lang: "en" },
    title: "Ørjan Sønvisen – Software Developer (C#/.NET)",
    canonical: "https://orjans.no/en/",
    hreflang: { nb: "https://orjans.no/", en: "https://orjans.no/en/", "x-default": "https://orjans.no/" },
  },
  {
    route: { page: "games", lang: "nb" },
    title: "SQL- og Python-spill – Ørjan Sønvisen",
    canonical: "https://orjans.no/spill/",
    hreflang: { nb: "https://orjans.no/spill/", en: "https://orjans.no/en/games/", "x-default": "https://orjans.no/spill/" },
  },
  {
    route: { page: "games", lang: "en" },
    title: "SQL and Python games – Ørjan Sønvisen",
    canonical: "https://orjans.no/en/games/",
    hreflang: { nb: "https://orjans.no/spill/", en: "https://orjans.no/en/games/", "x-default": "https://orjans.no/spill/" },
  },
] satisfies { route: Route; title: string; canonical: string; hreflang: Record<string, string> }[])(
  "head for $route.page ($route.lang)",
  ({ route, title, canonical, hreflang }) => {
    const html = head(route);

    it("has the title", () => {
      expect(titleOf(html)).toBe(title);
    });

    it("has the canonical URL, also as og:url", () => {
      expect(canonicalOf(html)).toBe(canonical);
      expect(html).toContain(`<meta property="og:url" content="${canonical}" />`);
    });

    it("links the page in both languages, with Norwegian as the default", () => {
      expect(hreflangsOf(html)).toEqual(hreflang);
    });
  },
);

describe("buildHead", () => {
  it("describes the front page as a person", () => {
    expect(head({ page: "home", lang: "nb" })).toContain('"@type":"Person"');
  });

  it("uses the games intro as the description of the games page", () => {
    expect(head({ page: "games", lang: "en" })).toContain('<meta name="description" content="Games intro en" />');
  });

  it("escapes text from the content", () => {
    const page = { ...pageData("nb"), text: { role: 'Dev <b> & "co"', intro: "x" } };
    expect(titleOf(buildHead({ page: "home", lang: "nb" }, page))).toBe("Ørjan Sønvisen – Dev &lt;b&gt; &amp; &quot;co&quot; (C#/.NET)");
  });
});

describe.each(["nb", "en"] as const)("structured data for the games page (%s)", (lang) => {
  const html = head({ page: "games", lang });
  const data = structuredDataOf(html);
  const listed = data.mainEntity.itemListElement;

  it("is a collection page with the canonical URL and the page's language", () => {
    expect(data["@type"]).toBe("CollectionPage");
    expect(data.url).toBe(canonicalOf(html));
    expect(data.inLanguage).toBe(lang);
  });

  it("lists the games in the recommended order", () => {
    expect(data.mainEntity["@type"]).toBe("ItemList");
    expect(listed.map((g) => [g.position, g.item.name])).toEqual([[1, "Title first"], [2, "Title second"], [3, "Title third"]]);
  });

  it("maps how demanding a game is to an educational level", () => {
    expect(listed.map((g) => g.item.educationalLevel)).toEqual(["Beginner", "Intermediate", "Advanced"]);
  });

  it("gives an available game its full URL", () => {
    expect(listed[0].item.url).toBe("https://orjans.no/first/");
    expect(listed[0].item.creativeWorkStatus).toBe("Published");
  });

  it("gives a game that is not available no URL", () => {
    expect(listed[2].item.url).toBeUndefined();
    expect(listed[2].item.creativeWorkStatus).toBe("Incomplete");
  });

  it("says the games are in Norwegian, also on the English page", () => {
    expect(listed.every((g) => g.item.inLanguage === "nb")).toBe(true);
  });
});
