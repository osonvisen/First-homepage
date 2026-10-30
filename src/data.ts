import felles from "./content/felles.json";
import nb from "./content/nb.json";
import en from "./content/en.json";
import type { Felles, Lang, SideData, Tekst } from "./types";

// Portrettet skaleres ned ved bygging (scripts/prerender.ts) til disse filene.
// Navnet på originalen tas med i adressen, så nettleseren henter nytt bilde når du bytter.
export function portrettSrc(f: Felles) {
  if (!f.bilde) return undefined;
  const v = encodeURIComponent(f.bilde.replace(/^.*\//, "").replace(/\.[^.]+$/, ""));
  return { small: `/media/portrett-360.webp?v=${v}`, large: `/media/portrett-720.webp?v=${v}` };
}

export function sideData(lang: Lang): SideData {
  const f = felles as Felles;
  return { lang, felles: f, tekst: (lang === "en" ? en : nb) as Tekst, bildeSrc: portrettSrc(f) };
}
