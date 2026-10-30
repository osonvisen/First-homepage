# orjans.no

Personal website of Ørjan Sønvisen, built with React and TypeScript (Vite) and deployed with GitHub Pages.

## Editing content

Sign in to [Pages CMS](https://app.pagescms.org) with GitHub and select this repository:

- **Felles:** name, portrait, location, "open to work", email and links
- **Norsk tekst** / **English text:** everything else, one file per language

Saving in Pages CMS commits to `main`, which builds and deploys the site within a couple of minutes.
Remember to `git pull` before working locally.

## Running locally

Requires [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install       # first time only
npm run dev       # dev server on http://localhost:5173
npm run build     # production build in dist/
npx vite preview  # serve the production build locally
```

## How the build works

`npm run build` runs four steps:

1. Type check (`tsc`)
2. Client build (`vite build`)
3. Server build of the app (`vite build --ssr`)
4. `scripts/prerender.ts`, which generates:
   - static HTML for `/` (Norwegian) and `/en/` (English), so the content is readable without JavaScript
   - schema.org `Person` structured data on each page
   - `llms.txt` and `profile.json` for AI agents, plus `sitemap.xml`
   - resized portraits (`media/portrait-360.webp` and `-720.webp`)

## Structure

| Path | Purpose |
|---|---|
| `src/App.tsx` | The page |
| `src/components/` | Logo, theme toggle and email reveal |
| `src/styles.css` | Styling, colours and themes (contrast-checked against WCAG 2.1 AA) |
| `src/i18n.ts` | Fixed interface strings in Norwegian and English |
| `src/content/` | Content (edited in Pages CMS) |
| `src/content.ts` | Loads the content for a given language |
| `scripts/prerender.ts` | Static HTML and agent files at build time |
| `public/` | Copied as-is: games, favicon, social image, robots.txt |
| `.pages.yml` | Pages CMS field configuration |
| `.github/workflows/deploy.yml` | Builds and deploys on every push to `main` |

## Adding a game

1. Create a folder under `public/`, e.g. `public/my-game/`, containing a finished `index.html`.
2. Add it under **Spill** in both the Norwegian and English text in Pages CMS, with the URL `/my-game/`.

> Only publish the finished `index.html` of each game. Build scripts and answer keys contain the
> solutions and must not be committed here, since this repository is public.
