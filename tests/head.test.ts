// Locks the <head> of every page. The page data is a fixture with today's name and roles,
// not src/content, so that editing the role in Pages CMS does not make the deploy fail.
import { describe, expect, it } from "vitest";
import { buildHead } from "../scripts/head.ts";
import type { Route } from "../src/routes.ts";
import type { Lang, PageData } from "../src/types.ts";

const ROLES: Record<Lang, string> = { nb: "Programvareutvikler", en: "Software Developer" };

const pageData = (lang: Lang): PageData => ({
  lang,
  shared: { name: "Ørjan Sønvisen", location: "Holmestrand" },
  text: { role: ROLES[lang], intro: `Intro ${lang}`, gamesPageIntro: `Games intro ${lang}` },
  games: [],
});

const head = (route: Route) => buildHead(route, pageData(route.lang));

const titleOf = (html: string) => html.match(/<title>([^<]*)<\/title>/)?.[1];
const canonicalOf = (html: string) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const hreflangsOf = (html: string) =>
  Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));

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
  it("describes the front page as a person and the games page without structured data", () => {
    expect(head({ page: "home", lang: "nb" })).toContain('"@type":"Person"');
    expect(head({ page: "games", lang: "nb" })).not.toContain("application/ld+json");
  });

  it("uses the games intro as the description of the games page", () => {
    expect(head({ page: "games", lang: "en" })).toContain('<meta name="description" content="Games intro en" />');
  });

  it("escapes text from the content", () => {
    const page = { ...pageData("nb"), text: { role: 'Dev <b> & "co"', intro: "x" } };
    expect(titleOf(buildHead({ page: "home", lang: "nb" }, page))).toBe("Ørjan Sønvisen – Dev &lt;b&gt; &amp; &quot;co&quot; (C#/.NET)");
  });
});
