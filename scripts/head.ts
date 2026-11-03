// Builds the <head> tags for each page: title, description, canonical, hreflang, Open Graph and
// structured data. Kept apart from scripts/prerender.ts so it can be tested without a build.
import type { Difficulty, Link, PageData, StackGroup } from "../src/types.ts";
import { PAGE_PATHS, pagePath, type PageKind, type Route } from "../src/routes.ts";
import { UI } from "../src/i18n.ts";

export const SITE = "https://orjans.no";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Structured data (schema.org) ----------
function personJsonLd({ lang, shared, text }: PageData) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: shared.name,
    url: `${SITE}${pagePath({ page: "home", lang })}`,
    image: shared.image ? `${SITE}/media/portrait-720.webp` : undefined,
    jobTitle: text.role,
    description: text.intro,
    address: shared.location ? { "@type": "PostalAddress", addressLocality: shared.location, addressCountry: "NO" } : undefined,
    sameAs: (shared.links ?? []).map((l: Link) => l.url),
    knowsAbout: (text.stack ?? []).flatMap((s: StackGroup) => s.tools.split(/,| og | and /).map((x) => x.trim()).filter(Boolean)),
    knowsLanguage: ["nb", "en"],
    alumniOf: { "@type": "EducationalOrganization", name: "Gokstad Akademiet" },
  };
}

// The games themselves are written in Norwegian, whatever the language of the page.
const GAME_LANGUAGE = "nb";

// How demanding a game is (1–3), in the words schema.org consumers expect for educationalLevel.
const EDUCATIONAL_LEVELS: Record<Difficulty, string> = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };

function gamesJsonLd(page: PageData, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: page.text.gamesPageIntro,
    url: `${SITE}${pagePath({ page: "games", lang: page.lang })}`,
    inLanguage: page.lang,
    author: { "@type": "Person", name: page.shared.name, url: `${SITE}${pagePath({ page: "home", lang: page.lang })}` },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: page.games.length,
      itemListElement: page.games.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "LearningResource",
          name: game.title,
          description: game.description,
          // A game that is not available has no page yet, so it gets no URL.
          url: game.available ? `${SITE}${game.url}` : undefined,
          inLanguage: GAME_LANGUAGE,
          learningResourceType: "game",
          educationalLevel: EDUCATIONAL_LEVELS[game.difficulty],
          teaches: game.skills,
          keywords: game.languages,
          isAccessibleForFree: true,
          creativeWorkStatus: game.available ? "Published" : "Incomplete",
        },
      })),
    },
  };
}

// ---------- What differs between the pages ----------
interface PageMeta { title: string; description: string; ogType: "profile" | "website"; structuredData?: object }

// A new page adds one entry here.
const META: Record<PageKind, (page: PageData) => PageMeta> = {
  home: (page) => ({
    title: `${page.shared.name} – ${page.text.role} (C#/.NET)`,
    description: page.text.intro ?? "",
    ogType: "profile",
    structuredData: personJsonLd(page),
  }),
  games: (page) => ({
    title: `${UI[page.lang].gamesPage.documentTitle} – ${page.shared.name}`,
    description: page.text.gamesPageIntro ?? "",
    ogType: "website",
    structuredData: gamesJsonLd(page, UI[page.lang].gamesPage.documentTitle),
  }),
};

/** The tags that replace <!--head--> in index.html for this page. */
export function buildHead(route: Route, page: PageData): string {
  const meta = META[route.page](page);
  const url = `${SITE}${pagePath(route)}`;
  const alternates = PAGE_PATHS[route.page];
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="nb" href="${SITE}${alternates.nb}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}${alternates.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}${alternates.nb}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta property="og:locale" content="${page.lang === "en" ? "en_GB" : "nb_NO"}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(meta.structuredData ? [`<script type="application/ld+json">${JSON.stringify(meta.structuredData).replace(/</g, "\\u003c")}</script>`] : []),
  ].join("\n    ");
}
