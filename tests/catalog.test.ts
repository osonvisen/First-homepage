import { describe, expect, it } from "vitest";
import { gameCards } from "../src/games/catalog.ts";
import type { Game, GameId, GameText } from "../src/types.ts";

const id = (value: string) => value as GameId;
const game = (gameId: string): Game => ({ id: id(gameId), languages: "SQL", difficulty: 1, available: true });
const text = (gameId: string): GameText => ({
  id: id(gameId),
  title: `Title ${gameId}`,
  description: "Description",
  skills: "Skills",
  studyFit: "Study fit",
});

describe("gameCards", () => {
  it("keeps the order of the shared list, not of the texts", () => {
    const cards = gameCards([game("a"), game("b")], [text("b"), text("a")]);
    expect(cards.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("joins facts and text and links to the game's folder", () => {
    const [card] = gameCards([game("fjordglimt")], [text("fjordglimt")]);
    expect(card).toMatchObject({ id: "fjordglimt", difficulty: 1, title: "Title fjordglimt", url: "/fjordglimt/" });
  });

  it("leaves out a game that has no text", () => {
    const cards = gameCards([game("a"), game("b")], [text("b")]);
    expect(cards.map((c) => c.id)).toEqual(["b"]);
  });

  it("ignores text for a game that does not exist", () => {
    expect(gameCards([], [text("a")])).toEqual([]);
  });
});
