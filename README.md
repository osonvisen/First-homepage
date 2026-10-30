# orjans.no

Forsiden på orjans.no, laget med React og TypeScript (Vite) og publisert med GitHub Pages.

## Redigere innholdet

Logg inn på [Pages CMS](https://app.pagescms.org) med GitHub og velg dette repoet.
Under **Forside** kan du endre navn, tittel, tekst, bilde, lenker og listen over spill og prosjekter.
Når du lagrer, bygges og publiseres siden automatisk på et par minutter.

Du kan også redigere `src/content/forside.json` direkte og pushe fra VS Code.

## Kjøre siden på egen maskin

Krever [Node.js](https://nodejs.org) (versjon 20 eller nyere).

```bash
npm install     # første gang
npm run dev     # åpner siden på http://localhost:5173 og oppdaterer når du lagrer
npm run build   # bygger den ferdige siden til mappen dist/
```

## Struktur

| Fil / mappe | Hva det er |
|---|---|
| `src/App.tsx` | Forsiden (React-komponenten) |
| `src/styles.css` | Utseendet |
| `src/content/forside.json` | Alt innholdet på forsiden |
| `src/types.ts` | TypeScript-typene for innholdet |
| `.pages.yml` | Hvilke felter som kan redigeres i Pages CMS |
| `public/media/` | Bilder lastet opp via Pages CMS |
| `public/fjordglimt/` | Spillet «Mordet på Hotell Fjordglimt» |
| `public/millionene/` | Prototypen «Millionene som forsvant» |
| `.github/workflows/deploy.yml` | Bygger og publiserer siden ved hver push til `main` |

## Legge til et nytt spill eller prosjekt

1. Lag en mappe under `public/`, for eksempel `public/mitt-spill/`, med en ferdig `index.html`.
2. Legg det til under **Spill og prosjekter** i Pages CMS, med lenken `mitt-spill/`.
3. Commit og push.

> Legg bare ut den ferdige `index.html` for spillene. Byggeskript og fasit inneholder løsningene
> og skal ikke ligge i dette repoet, siden det er offentlig.
