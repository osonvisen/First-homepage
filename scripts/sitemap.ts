import { PAGE_PATHS, ROUTES, pagePath } from "../src/routes.ts";
import { gameUrl } from "../src/games/catalog.ts";
import type { Game } from "../src/types.ts";
import { SITE } from "./head.ts";

/** Every page with its language versions, and every game that can be played today. */
export function buildSitemap(games: readonly Game[], lastmod: string): string {
  const pages = ROUTES.map((route) => {
    const alternates = PAGE_PATHS[route.page];
    return `  <url><loc>${SITE}${pagePath(route)}</loc><lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="nb" href="${SITE}${alternates.nb}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${alternates.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${alternates.nb}" />
  </url>`;
  });
  // A game that is not available has no folder yet, so it must not be listed.
  const playable = games.filter((game) => game.available).map((game) => `  <url><loc>${SITE}${gameUrl(game.id)}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...pages, ...playable].join("\n")}
</urlset>
`;
}
