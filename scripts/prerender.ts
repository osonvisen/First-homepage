// Runs after `vite build`. Renders static HTML for every page in src/routes.ts so search engines and
// AI agents see the full content without running JavaScript. Also generates agent files
// (llms.txt, profile.json, sitemap.xml) and resized portraits from the content in src/content.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import type { Experience, Link, PageData, Project, StackGroup } from "../src/types.ts";
import { PAGE_PATHS, ROUTES, pagePath, type PageKind, type Route } from "../src/routes.ts";
import { UI } from "../src/i18n.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://orjans.no";
// Same line as in index.html. Loads Google Analytics after consent (see public/analytics.js).
const ANALYTICS_TAG = '<script src="/analytics.js" defer></script>';

const { render, pageData } = await import(pathToFileURL(join(ROOT, "dist-ssr", "entry-server.js")).href);
const template = readFileSync(join(DIST, "index.html"), "utf8");

const nb: PageData = pageData("nb");
const en: PageData = pageData("en");
const shared = nb.shared;
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const linkTo = (name: string) => (shared.links ?? []).find((l: Link) => l.label.toLowerCase().includes(name))?.url;
// Written out so language models understand it, but simple scrapers looking for "name@domain" do not.
const emailText = shared.emailUser && shared.emailDomain
  ? `${shared.emailUser} (at) ${shared.emailDomain.replace(/\./g, " (dot) ")}`
  : undefined;

// ---------- Portraits ----------
if (shared.image) {
  const source = join(ROOT, "public", shared.image.replace(/^\//, ""));
  if (existsSync(source)) {
    mkdirSync(join(DIST, "media"), { recursive: true });
    for (const size of [360, 720]) {
      await sharp(source)
        .resize(size, size, { fit: "cover", position: "top" })
        .webp({ quality: 82 })
        .toFile(join(DIST, "media", `portrait-${size}.webp`));
    }
  } else {
    console.warn(`Image not found: ${source}`);
  }
}

// ---------- Structured data (schema.org) ----------
function jsonLd(page: PageData) {
  const t = page.text;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: shared.name,
    url: `${SITE}${pagePath({ page: "home", lang: page.lang })}`,
    image: shared.image ? `${SITE}/media/portrait-720.webp` : undefined,
    jobTitle: t.role,
    description: t.intro,
    address: shared.location ? { "@type": "PostalAddress", addressLocality: shared.location, addressCountry: "NO" } : undefined,
    sameAs: (shared.links ?? []).map((l: Link) => l.url),
    knowsAbout: (t.stack ?? []).flatMap((s: StackGroup) => s.tools.split(/,| og | and /).map((x) => x.trim()).filter(Boolean)),
    knowsLanguage: ["nb", "en"],
    alumniOf: { "@type": "EducationalOrganization", name: "Gokstad Akademiet" },
  };
}

// ---------- HTML per page and language ----------
interface PageMeta { title: string; description: string; ogType: "profile" | "website"; structuredData?: object }

// What differs between the pages in <head>. A new page adds one entry here.
const META: Record<PageKind, (page: PageData) => PageMeta> = {
  home: (page) => ({
    title: `${shared.name} – ${page.text.role} (C#/.NET)`,
    description: page.text.intro ?? "",
    ogType: "profile",
    structuredData: jsonLd(page),
  }),
  games: (page) => ({
    title: `${UI[page.lang].gamesPage.documentTitle} – ${shared.name}`,
    description: page.text.gamesPageIntro ?? "",
    ogType: "website",
  }),
};

function renderPage(route: Route) {
  const page: PageData = pageData(route.lang);
  const meta = META[route.page](page);
  const url = `${SITE}${pagePath(route)}`;
  const alternates = PAGE_PATHS[route.page];
  const head = [
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
  return template
    .replace('<html lang="nb">', `<html lang="${page.lang}">`)
    .replace("<!--head-->", head)
    .replace("<!--app-->", render(route));
}

for (const route of ROUTES) {
  const file = join(DIST, pagePath(route), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, renderPage(route));
}

// ---------- Analytics on game pages ----------
// The games are built in the sql-games repo and copied into public/. Adding the tag here at build time
// means every game gets analytics without the game build having to know about it.
// The top-level folders of the site's own pages ("en", "spill") are not games.
const PAGE_FOLDERS = new Set(ROUTES.map((route) => pagePath(route).split("/")[1]).filter(Boolean));
const gameFolders = readdirSync(DIST, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !PAGE_FOLDERS.has(entry.name))
  .map((entry) => entry.name)
  .filter((name) => existsSync(join(DIST, name, "index.html")));
for (const folder of gameFolders) {
  const file = join(DIST, folder, "index.html");
  const html = readFileSync(file, "utf8");
  if (html.includes(ANALYTICS_TAG)) continue;
  if (!html.includes("</head>")) {
    console.warn(`No </head> in ${folder}/index.html, analytics not added.`);
    continue;
  }
  writeFileSync(file, html.replace("</head>", `    ${ANALYTICS_TAG}\n  </head>`));
  console.log(`Analytics added to /${folder}/`);
}

// ---------- llms.txt ----------
const projectsMd = (page: PageData) =>
  (page.text.projects ?? [])
    .map((p: Project) => {
      const where = p.company ? ` (${p.company}${p.note ? `, ${p.note}` : ""})` : "";
      const bullets = (p.highlights ?? []).map((h) => `- ${h}`).join("\n");
      return `### ${p.title}${where}\n${bullets}${p.tags ? `\n- Tech: ${p.tags}` : ""}`;
    })
    .join("\n\n");
const experienceMd = (page: PageData) =>
  (page.text.experience ?? []).map((e: Experience) => `- ${e.period}: ${e.place}, ${e.role}`).join("\n");
const blocks = (s?: string) => (s ?? "").replace(/\n\s*\n/g, "\n\n");

const llms = `# ${shared.name}

> ${en.text.role} based in ${shared.location ?? "Norway"}. ${en.text.roleDetail ?? ""}. ${shared.openToWork ? `${en.text.status}.` : ""}

${en.text.intro ?? ""}

${en.text.lookingFor ?? ""}

## Contact
- LinkedIn (preferred): ${linkTo("linkedin") ?? ""}
${emailText ? `- Email: ${emailText}\n` : ""}- GitHub: ${linkTo("github") ?? ""}
- Location: ${shared.location ?? ""}, Norway
- Languages: Norwegian (native), English (fluent)

## Selected projects
${projectsMd(en)}

## Experience and education
${experienceMd(en)}

## Skills
${(en.text.stack ?? []).map((s: StackGroup) => `- ${s.group}: ${s.tools}`).join("\n")}

## Background
${blocks(en.text.about)}

${blocks(en.text.beforeCode)}

## More
- [Profile page (English)](${SITE}/en/)
- [Profilside (norsk)](${SITE}/)
- [Structured profile (JSON Resume)](${SITE}/profile.json)

---

## Norsk sammendrag
${shared.name}, ${nb.text.role.toLowerCase()} i ${shared.location ?? "Norge"}. ${nb.text.roleDetail ?? ""}. ${shared.openToWork ? `${nb.text.status}.` : ""}
${nb.text.lookingFor ?? ""} Kontakt helst via LinkedIn${emailText ? `, eller e-post: ${emailText}` : ""}.
`;
writeFileSync(join(DIST, "llms.txt"), llms.replace(/\n{3,}/g, "\n\n"));

// ---------- profile.json (JSON Resume format) ----------
const isDegree = (e: Experience) => /degree/i.test(e.role);
const profile = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: shared.name,
    label: `${en.text.role} (C#/.NET)`,
    image: shared.image ? `${SITE}/media/portrait-720.webp` : undefined,
    url: `${SITE}/en/`,
    summary: [en.text.intro, en.text.lookingFor].filter(Boolean).join(" "),
    location: { city: shared.location, countryCode: "NO" },
    profiles: (shared.links ?? []).map((l: Link) => ({ network: l.label, url: l.url })),
    contact: `LinkedIn preferred${emailText ? `; email: ${emailText}` : ""}`,
    openToWork: Boolean(shared.openToWork),
  },
  projects: (en.text.projects ?? []).map((p: Project) => ({
    name: p.title,
    entity: p.company,
    description: p.note,
    highlights: p.highlights,
    keywords: p.tags?.split(",").map((x) => x.trim()),
  })),
  work: (en.text.experience ?? []).filter((e: Experience) => !isDegree(e)).map((e: Experience) => ({ name: e.place, position: e.role, period: e.period })),
  education: (en.text.experience ?? []).filter(isDegree).map((e: Experience) => ({ institution: e.place, studyType: e.role, period: e.period })),
  skills: (en.text.stack ?? []).map((s: StackGroup) => ({ name: s.group, keywords: s.tools.split(/,| and /).map((x) => x.trim()).filter(Boolean) })),
  languages: [
    { language: "Norwegian", fluency: "Native" },
    { language: "English", fluency: "Fluent" },
  ],
};
writeFileSync(join(DIST, "profile.json"), JSON.stringify(profile, null, 2));

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const pageEntry = (path: string) => `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="nb" href="${SITE}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/" />
  </url>`;
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pageEntry("/")}
${pageEntry("/en/")}
  <url><loc>${SITE}/fjordglimt/</loc></url>
  <url><loc>${SITE}/millionene/</loc></url>
</urlset>
`
);

console.log(`Done: ${ROUTES.map(pagePath).join(", ")}, llms.txt, profile.json, sitemap.xml${shared.image ? ", portraits" : ""}`);
