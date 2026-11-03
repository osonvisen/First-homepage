import type { Difficulty, Game, GameCard, GameId, GameText, Lang } from "../types";

/** The games themselves are written in Norwegian, whatever the language of the page. */
export const GAME_LANGUAGE: Lang = "nb";

/** The scale for how demanding a game is, shown as dots on the games page. */
export const DIFFICULTY_LEVELS: readonly Difficulty[] = [1, 2, 3];

/** Games are published in public/<id>/ and served from /<id>/. */
export const gameUrl = (id: GameId) => `/${id}/`;

/**
 * Joins the shared facts about each game with its text in one language, in the recommended order.
 * A game without text is left out rather than shown half empty; tests/content.test.ts makes sure
 * the real content has text for every game in both languages.
 */
export function gameCards(games: readonly Game[], texts: readonly GameText[]): GameCard[] {
  return games.flatMap((game) => {
    const text = texts.find((t) => t.id === game.id);
    return text ? [{ ...game, ...text, url: gameUrl(game.id) }] : [];
  });
}
