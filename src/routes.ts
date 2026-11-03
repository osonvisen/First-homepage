import type { Lang } from "./types";

export type PageKind = "home" | "games";
export interface Route { page: PageKind; lang: Lang }

/** Where each page is published, per language. The prerender writes <path>index.html. */
export const PAGE_PATHS: Record<PageKind, Record<Lang, string>> = {
  home: { nb: "/", en: "/en/" },
  games: { nb: "/spill/", en: "/en/games/" },
};

const PAGE_KINDS = Object.keys(PAGE_PATHS) as PageKind[];
const LANGS: readonly Lang[] = ["nb", "en"];

export const ROUTES: readonly Route[] = PAGE_KINDS.flatMap((page) => LANGS.map((lang) => ({ page, lang })));

export const pagePath = ({ page, lang }: Route) => PAGE_PATHS[page][lang];

// GitHub Pages and Cloudflare both serve /spill/ for /spill and /spill/index.html.
const normalise = (pathname: string) => pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");

/** "/spill", "/spill/" and "/spill/index.html" are the same page. Unknown paths give undefined. */
export function findRoute(pathname: string): Route | undefined {
  const path = normalise(pathname);
  return ROUTES.find((route) => pagePath(route) === path);
}
