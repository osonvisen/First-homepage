import shared from "./content/shared.json";
import nb from "./content/nb.json";
import en from "./content/en.json";
import type { Lang, PageData, Shared, Text } from "./types";

// The portrait is resized at build time (scripts/prerender.ts) into these files.
// The original file name is part of the URL, so browsers fetch the new image when it changes.
export function portraitSrc(s: Shared) {
  if (!s.image) return undefined;
  const v = encodeURIComponent(s.image.replace(/^.*\//, "").replace(/\.[^.]+$/, ""));
  return { small: `/media/portrait-360.webp?v=${v}`, large: `/media/portrait-720.webp?v=${v}` };
}

export function pageData(lang: Lang): PageData {
  const s = shared as Shared;
  return { lang, shared: s, text: (lang === "en" ? en : nb) as Text, portrait: portraitSrc(s) };
}
