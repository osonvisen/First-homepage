# Backlog

Tasks we have agreed to do later, sorted in the order we think they should be done.

Sizes are rough: **S** is one small step, **M** a few steps, **L** needs to be split up and planned first. Finished tasks are removed, but the other tasks keep their numbers.

## 1. Header buttons are smaller than 44 × 44 px (S)

- **What:** `.pill` has `min-height: 40px`. It is used for the language button and the theme button in the header.
- **Where:** `src/styles.css › .pill`.
- **Rule:** Accessibility in `CLAUDE.md`, click targets of at least 44 × 44 px.

## 2. Fixed colours on the game cards (S)

- **What:** `#c9cbe0` (soft text), `#ffd34d` (accent) and `#a3a5ff` (solved) are written out in several rules instead of being colour tokens like `--game-bg` and `--game-text`. `#1b1d2a` in `.pixel-badge` belongs with them.
- **Where:** `src/styles.css › .game-card p`, `.pixel-badge`, `.pixel-badge.outline`, `.play-now`, `.path-card :focus-visible`, `.game-facts dt`, `.difficulty`, `.coming-soon`, `.progress`, `.progress-started`, `.progress-solved`.
- **Rule:** No magic values. Colours are defined once as tokens on `:root`, so light and dark mode stay in one place.

## 3. No visual mark for the current page in the menu (S)

- **What:** the menu link for the page you are on has `aria-current="page"`, so screen readers announce it, but it looks the same as the other links. Sighted users get no sign that «Spill» is the page they are on.
- **Where:** `src/styles.css › .main-nav a`, set by `src/components/SiteHeader.tsx › SiteHeader`.
- **Rule:** Accessibility in `CLAUDE.md`. Style it with `.main-nav a[aria-current="page"]`, not colour alone (for example an underline or a weight change), and check the contrast in both light and dark mode.
