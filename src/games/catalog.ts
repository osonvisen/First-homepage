import type { Game, GameCard, GameText } from "../types";

/**
 * Joins the shared facts about each game with its text in one language, in the recommended order.
 * A game without text is left out rather than shown half empty; tests/content.test.ts makes sure
 * the real content has text for every game in both languages.
 */
export function gameCards(games: readonly Game[], texts: readonly GameText[]): GameCard[] {
  return games.flatMap((game) => {
    const text = texts.find((t) => t.id === game.id);
    return text ? [{ ...game, ...text, url: `/${game.id}/` }] : [];
  });
}
