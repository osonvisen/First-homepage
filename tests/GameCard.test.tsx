import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { GameCard } from "../src/components/GameCard.tsx";
import type { GameCard as GameCardData, GameId } from "../src/types.ts";

const card = (overrides: Partial<GameCardData> = {}): GameCardData => ({
  id: "fjordglimt" as GameId,
  languages: "SQL",
  difficulty: 2,
  available: true,
  title: "Mordet på Hotell Fjordglimt",
  description: "Description",
  skills: "JOIN",
  studyFit: "Early",
  url: "/fjordglimt/",
  ...overrides,
});

describe("GameCard", () => {
  it("links an available game to its folder", () => {
    const html = renderToString(<GameCard game={card()} lang="nb" />);
    expect(html).toContain('href="/fjordglimt/"');
    expect(html).toContain("Spill nå");
    expect(html).not.toContain("Kommer snart");
  });

  it("shows a game that is not available as coming soon, without a link", () => {
    const html = renderToString(<GameCard game={card({ id: "innbruddet" as GameId, url: "/innbruddet/", available: false })} lang="nb" />);
    expect(html).toContain("Kommer snart");
    expect(html).not.toContain("<a ");
  });

  it("tells screen readers how demanding the game is", () => {
    const html = renderToString(<GameCard game={card({ difficulty: 2 })} lang="nb" />);
    expect(html).toContain('aria-label="2 av 3"');
    expect(html.match(/class="filled"/g)).toHaveLength(2);
  });

  it("uses English labels on the English page", () => {
    const html = renderToString(<GameCard game={card({ difficulty: 3 })} lang="en" />);
    expect(html).toContain("Demanding");
    expect(html).toContain('aria-label="3 of 3"');
    expect(html).toContain("Play now");
  });

  it("says the game is in Norwegian on the English page", () => {
    expect(renderToString(<GameCard game={card()} lang="en" />)).toContain('<span class="pixel-badge outline">In Norwegian</span>');
  });

  it("does not mark the language on the Norwegian page", () => {
    expect(renderToString(<GameCard game={card()} lang="nb" />)).not.toContain("pixel-badge outline");
  });
});
