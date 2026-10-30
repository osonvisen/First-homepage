# orjans.no

Personlig side for Ørjan Sønvisen, laget med React og TypeScript (Vite) og publisert med GitHub Pages.

## Redigere innholdet

Logg inn på [Pages CMS](https://app.pagescms.org) med GitHub og velg dette repoet:

- **Felles:** navn, bilde, sted, «Åpen for nye muligheter», e-post og lenker
- **Norsk tekst** og **English text:** alt annet, på hvert sitt språk

Når du lagrer, bygges og publiseres siden automatisk på et par minutter. Husk `git pull` før du jobber lokalt.

## Kjøre siden på egen maskin

Krever [Node.js](https://nodejs.org) 22 eller nyere.

```bash
npm install     # første gang
npm run dev     # utviklingsserver på http://localhost:5173
npm run build   # bygger ferdig side til dist/
npx vite preview  # viser den ferdige siden lokalt
```

## Hvordan siden bygges

`npm run build` gjør fire ting:

1. Sjekker TypeScript (`tsc`)
2. Bygger React-appen (`vite build`)
3. Bygger en servervariant av appen (`vite build --ssr`)
4. Kjører `scripts/prerender.ts`, som lager:
   - ferdig HTML for `/` (norsk) og `/en/` (engelsk), så innholdet er synlig uten JavaScript
   - strukturerte data (schema.org `Person`) i hver side
   - `llms.txt` og `profil.json` for AI-agenter, og `sitemap.xml`
   - nedskalerte portretter (`media/portrett-360.webp` og `-720.webp`)

## Struktur

| Fil / mappe | Hva det er |
|---|---|
| `src/App.tsx` | Hele siden |
| `src/components/` | Logo, temaknapp og e-postknapp |
| `src/styles.css` | Utseende, farger og tema (kontrastsjekket mot WCAG 2.1 AA) |
| `src/i18n.ts` | Faste tekster i grensesnittet på norsk og engelsk |
| `src/content/` | Innholdet (redigeres i Pages CMS) |
| `scripts/prerender.ts` | Ferdig HTML og agentfiler ved bygging |
| `public/` | Filer som kopieres rett ut: spill, favicon, delingsbilde, robots.txt |
| `.pages.yml` | Feltene i Pages CMS |
| `.github/workflows/deploy.yml` | Bygger og publiserer ved hver push til `main` |

## Legge til et nytt spill

1. Lag en mappe under `public/`, for eksempel `public/mitt-spill/`, med en ferdig `index.html`.
2. Legg det til under **Spill** i både norsk og engelsk tekst i Pages CMS, med lenken `/mitt-spill/`.

> Legg bare ut den ferdige `index.html` for spillene. Byggeskript og fasit inneholder løsningene
> og skal ikke ligge i dette repoet, siden det er offentlig.
