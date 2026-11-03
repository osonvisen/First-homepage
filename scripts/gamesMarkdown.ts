import { UI } from "../src/i18n.ts";
import { DIFFICULTY_LEVELS } from "../src/games/catalog.ts";
import { pagePath } from "../src/routes.ts";
import type { GameCard, PageData } from "../src/types.ts";
import { SITE } from "./head.ts";

function gameLine(game: GameCard, index: number, labels: typeof UI.en.gamesPage) {
  const facts = [game.languages, `${labels.difficulty.toLowerCase()} ${labels.difficultyValue(game.difficulty, DIFFICULTY_LEVELS.length)}`];
  if (!game.available) facts.push(labels.comingSoon.toLowerCase());
  const play = game.available ? ` Play: ${SITE}${game.url}` : "";
  return `${index + 1}. **${game.title}** (${facts.join(", ")}): ${game.description} ${labels.skills}: ${game.skills}.${play}`;
}

/** The games section of llms.txt, in the recommended order. */
export function gamesMarkdown(page: PageData): string {
  const labels = UI[page.lang].gamesPage;
  return [
    `## ${labels.documentTitle}`,
    page.text.gamesPageIntro ?? "",
    `- Overview: ${SITE}${pagePath({ page: "games", lang: "en" })} (Norwegian: ${SITE}${pagePath({ page: "games", lang: "nb" })})`,
    page.games.map((game, index) => gameLine(game, index, labels)).join("\n"),
  ].filter(Boolean).join("\n\n");
}
