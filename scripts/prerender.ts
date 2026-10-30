// Kjøres etter `vite build`. Lager ferdig HTML for / og /en/, slik at søkemotorer og
// AI-agenter ser hele innholdet uten å kjøre JavaScript. Lager også agentfiler
// (llms.txt, profil.json, sitemap.xml) og nedskalerte portretter fra innholdet i src/content.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROT, "dist");
const SITE = "https://orjans.no";

const { render, sideData } = await import(pathToFileURL(join(ROT, "dist-ssr", "entry-server.js")).href);
const mal = readFileSync(join(DIST, "index.html"), "utf8");

const nb = sideData("nb");
const en = sideData("en");
const f = nb.felles;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const lenke = (tekst: string) => (f.lenker ?? []).find((l: { tekst: string; url: string }) => l.tekst.toLowerCase().includes(tekst))?.url;
const epostTekst = f.epostBruker && f.epostDomene ? `${f.epostBruker} (at) ${f.epostDomene.replace(/\./g, " (dot) ")}` : undefined;

// ---------- Portretter ----------
if (f.bilde) {
  const kilde = join(ROT, "public", f.bilde.replace(/^\//, ""));
  if (existsSync(kilde)) {
    mkdirSync(join(DIST, "media"), { recursive: true });
    for (const w of [360, 720]) {
      await sharp(kilde).resize(w, w, { fit: "cover", position: "top" }).webp({ quality: 82 }).toFile(join(DIST, "media", `portrett-${w}.webp`));
    }
  } else {
    console.warn(`Fant ikke bildet ${kilde}`);
  }
}

// ---------- Strukturerte data (schema.org) ----------
function jsonLd(d: typeof nb) {
  const t = d.tekst;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: f.navn,
    url: d.lang === "en" ? `${SITE}/en/` : `${SITE}/`,
    image: f.bilde ? `${SITE}/media/portrett-720.webp` : undefined,
    jobTitle: t.rolle,
    description: t.ingress,
    address: f.sted ? { "@type": "PostalAddress", addressLocality: f.sted, addressCountry: "NO" } : undefined,
    sameAs: (f.lenker ?? []).map((l: { url: string }) => l.url),
    knowsAbout: (t.stack ?? []).flatMap((s: { verktoy: string }) => s.verktoy.split(/,| og | and /).map((x) => x.trim()).filter(Boolean)),
    knowsLanguage: ["nb", "en"],
    alumniOf: { "@type": "EducationalOrganization", name: "Gokstad Akademiet" },
  };
}

// ---------- HTML for hvert språk ----------
function side(d: typeof nb) {
  const t = d.tekst;
  const url = d.lang === "en" ? `${SITE}/en/` : `${SITE}/`;
  const tittel = `${f.navn} – ${t.rolle} (C#/.NET)`;
  const head = [
    `<title>${esc(tittel)}</title>`,
    `<meta name="description" content="${esc(t.ingress ?? "")}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="nb" href="${SITE}/" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}/en/" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:title" content="${esc(tittel)}" />`,
    `<meta property="og:description" content="${esc(t.ingress ?? "")}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta property="og:locale" content="${d.lang === "en" ? "en_GB" : "nb_NO"}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(d)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
  return mal
    .replace('<html lang="nb">', `<html lang="${d.lang}">`)
    .replace("<!--head-->", head)
    .replace("<!--app-->", render(d.lang));
}

writeFileSync(join(DIST, "index.html"), side(nb));
mkdirSync(join(DIST, "en"), { recursive: true });
writeFileSync(join(DIST, "en", "index.html"), side(en));

// ---------- llms.txt ----------
type P = { firma?: string; merknad?: string; tittel: string; punkter?: string[]; tagger?: string };
type E = { periode: string; sted: string; rolle: string };
const prosjekter = (d: typeof nb) =>
  (d.tekst.prosjekter ?? []).map((p: P) => `### ${p.tittel}${p.firma ? ` (${p.firma}${p.merknad ? `, ${p.merknad}` : ""})` : ""}\n${(p.punkter ?? []).map((x) => `- ${x}`).join("\n")}${p.tagger ? `\n- Tech: ${p.tagger}` : ""}`).join("\n\n");
const erfaring = (d: typeof nb) => (d.tekst.erfaring ?? []).map((e: E) => `- ${e.periode}: ${e.sted}, ${e.rolle}`).join("\n");

const llms = `# ${f.navn}

> ${en.tekst.rolle} based in ${f.sted ?? "Norway"}. ${en.tekst.rolleDetalj ?? ""}. ${f.apenForJobb ? en.tekst.status + "." : ""}

${en.tekst.ingress ?? ""}

${en.tekst.serEtter ?? ""}

## Contact
- LinkedIn (preferred): ${lenke("linkedin") ?? ""}
${epostTekst ? `- Email: ${epostTekst}\n` : ""}- GitHub: ${lenke("github") ?? ""}
- Location: ${f.sted ?? ""}, Norway
- Languages: Norwegian (native), English (fluent)

## Selected projects
${prosjekter(en)}

## Experience and education
${erfaring(en)}

## Skills
${(en.tekst.stack ?? []).map((s: { gruppe: string; verktoy: string }) => `- ${s.gruppe}: ${s.verktoy}`).join("\n")}

## Background
${(en.tekst.omMeg ?? "").replace(/\n\s*\n/g, "\n\n")}

${(en.tekst.forKoden ?? "").replace(/\n\s*\n/g, "\n\n")}

## More
- [Profile page (English)](${SITE}/en/)
- [Profilside (norsk)](${SITE}/)
- [Structured profile (JSON Resume)](${SITE}/profil.json)

---

## Norsk sammendrag
${f.navn}, ${nb.tekst.rolle.toLowerCase()} i ${f.sted ?? "Norge"}. ${nb.tekst.rolleDetalj ?? ""}. ${f.apenForJobb ? nb.tekst.status + "." : ""}
${nb.tekst.serEtter ?? ""} Kontakt helst via LinkedIn${epostTekst ? `, eller e-post: ${epostTekst}` : ""}.
`;
writeFileSync(join(DIST, "llms.txt"), llms.replace(/\n{3,}/g, "\n\n"));

// ---------- profil.json (JSON Resume-format) ----------
const profil = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: f.navn,
    label: `${en.tekst.rolle} (C#/.NET)`,
    image: f.bilde ? `${SITE}/media/portrett-720.webp` : undefined,
    url: `${SITE}/en/`,
    summary: [en.tekst.ingress, en.tekst.serEtter].filter(Boolean).join(" "),
    location: { city: f.sted, countryCode: "NO" },
    profiles: (f.lenker ?? []).map((l: { tekst: string; url: string }) => ({ network: l.tekst, url: l.url })),
    contact: `LinkedIn preferred${epostTekst ? `; email: ${epostTekst}` : ""}`,
    openToWork: Boolean(f.apenForJobb),
  },
  projects: (en.tekst.prosjekter ?? []).map((p: P) => ({ name: p.tittel, entity: p.firma, description: p.merknad, highlights: p.punkter, keywords: p.tagger?.split(",").map((x) => x.trim()) })),
  work: (en.tekst.erfaring ?? []).filter((e: E) => !/degree/i.test(e.rolle)).map((e: E) => ({ name: e.sted, position: e.rolle, period: e.periode })),
  education: (en.tekst.erfaring ?? []).filter((e: E) => /degree/i.test(e.rolle)).map((e: E) => ({ institution: e.sted, studyType: e.rolle, period: e.periode })),
  skills: (en.tekst.stack ?? []).map((s: { gruppe: string; verktoy: string }) => ({ name: s.gruppe, keywords: s.verktoy.split(/,| and /).map((x) => x.trim()).filter(Boolean) })),
  languages: [{ language: "Norwegian", fluency: "Native" }, { language: "English", fluency: "Fluent" }],
};
writeFileSync(join(DIST, "profil.json"), JSON.stringify(profil, null, 2));

// ---------- sitemap.xml ----------
const idag = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${["/", "/en/"].map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${idag}</lastmod>
    <xhtml:link rel="alternate" hreflang="nb" href="${SITE}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/" />
  </url>`).join("\n")}
  <url><loc>${SITE}/fjordglimt/</loc></url>
  <url><loc>${SITE}/millionene/</loc></url>
</urlset>
`
);

console.log("Ferdig: index.html, en/index.html, llms.txt, profil.json, sitemap.xml" + (f.bilde ? ", portretter" : ""));
