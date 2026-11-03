# CLAUDE.md

Rules for working in this repository, the website orjans.no. Read this before every task.

## Who you work with

Ørjan is a C#/.NET developer who also writes React/TypeScript. He wants to understand every change, so the goal is not speed but that he can follow what happens in the code. Talk to him in Norwegian (bokmål). Everything in the code is in English.

## Working method

1. **One small step at a time.** A step changes one thing, usually in one file and rarely more than about 50 lines. If a task is bigger, split it up and agree on the steps first.
2. **Explain before you code.** In two or three sentences: what you will change, in which file and function, and why. Show the diff before you change existing files.
3. **After each step, report:**
   - which files and functions changed, with `file › name` or `file:line` references
   - how Ørjan can see the change (`npm run dev`, or the Cloudflare preview for the branch)
   - a suggested commit message in English
4. **Stop and wait.** Do not start the next step until Ørjan says so.
5. **Never run git commands that change anything** (`add`, `commit`, `push`, `checkout`, `branch`, `reset` and so on). Ørjan does git himself in the terminal. Reading commands like `git status`, `git diff` and `git log` are fine.
6. If you are unsure what Ørjan wants, ask instead of guessing.

### Definition of done

A step is done when:
- `npm run build` passes (it runs `tsc`, the build and the prerender)
- new behaviour has a test, once the repo has a test setup (see Testing)
- no new `TODO`, commented-out code or unused code is left behind

## Stack

- **Site:** React 19, TypeScript, Vite. Static site generation: `vite build`, then `vite build --ssr src/entry-server.tsx`, then `scripts/prerender.ts`, which writes the HTML for every page plus `llms.txt`, `profile.json`, `sitemap.xml` and the resized portraits. The browser hydrates with `hydrateRoot`.
- **Hosting:** GitHub Pages from `main` through `.github/workflows/deploy.yml`, on the domain orjans.no. Cloudflare Workers builds a preview for every other branch (`wrangler.jsonc`).
- **Content:** the text lives in `src/content/*.json` and is edited in Pages CMS (`.pages.yml`). When you add or rename a content field, update `.pages.yml` in the same step, so the field can be edited there.
- **Games:** the games are built in the private `sql-games` repo and copied to `public/<game>/`. Never edit those files here. `scripts/prerender.ts` adds `analytics.js` to every game page at build time.
- **Backend:** C#/.NET, if a server is ever needed. Do not add a Node backend.
- Node runs `.ts` scripts directly, so imports use explicit `.ts`/`.tsx` extensions.

## Language

- Code, identifiers, comments, file names, branch names and commit messages: **English**.
- The site exists in **Norwegian (bokmål)** at `/` and **English** at `/en/`. Every page and every piece of visible text exists in both. Interface text lives in `src/i18n.ts`, content in `src/content/nb.json` and `en.json`.

## Code style

- Prefer small, named functions over long inline arrow functions in JSX. Name event handlers `handle<Action>`, for example `handleThemeClick`.
- New React components get their own file in `src/components/`.
- No `any`. No primitive obsession for domain concepts.
- Depend on interfaces where something may be replaced later. Example: reading game progress goes through a small `ProgressStore` interface, so `localStorage` can later be replaced by a server.
- Never return `null` or `undefined` for collections. Expected failures are results, not exceptions. No empty `catch` blocks.
- Comments explain *why*, not *what*.

## Testing

The repo has no tests yet. The first task that adds behaviour in TypeScript should add vitest, in the same way as `sql-games` (node environment by default, jsdom only for component tests). Test behaviour, not implementation.

## Privacy and security

- The e-mail address must never appear in the HTML. It is put together only when a visitor clicks «Vis e-post» (`EmailReveal`). In `llms.txt` it is written as «osonvisen (at) gmail (dot) com».
- Never publish a phone number or references.
- Google Analytics only runs after consent, through `public/analytics.js`, and only on orjans.no. Do not add anything that sets cookies or contacts third parties without consent.
- Progress stored in the visitor's browser stays in the browser. Never send it anywhere.

## Agents and search engines

The site is made to be read by recruiters and AI agents. Keep the schema.org JSON-LD, `hreflang`, canonical links, `llms.txt`, `profile.json` and `sitemap.xml` in sync when pages are added or changed. A new page must be added to the sitemap and the prerender.

## Accessibility

The site follows WCAG 2.2 AA:
- labels on all inputs
- visible focus
- click targets of at least 44 × 44 px (our own rule, stricter than WCAG 2.2 AA; links in running text are exempt)
- contrast that works in both light and dark mode
- `prefers-reduced-motion` is respected
- everything works with the keyboard
