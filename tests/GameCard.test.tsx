import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { GameCard } from "../src/components/GameCard.tsx";
import type { ProgressStore } from "../src/games/progressStore.ts";
import type { GameCard as GameCardData, GameId } from "../src/types.ts";

// renderToString never runs the effect that reads it, so any answer will do.
const store: ProgressStore = { read: () => Promise.resolve("started") };

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
    const html = renderToString(<GameCard game={card()} lang="nb" progressStore={store} />);
    expect(html).toContain('href="/fjordglimt/"');
    expect(html).toContain("Spill nå");
    expect(html).not.toContain("Kommer snart");
  });

  it("shows a game that is not available as coming soon, without a link", () => {
    const html = renderToString(<GameCard game={card({ id: "innbruddet" as GameId, url: "/innbruddet/", available: false })} lang="nb" progressStore={store} />);
    expect(html).toContain("Kommer snart");
    expect(html).not.toContain("<a ");
  });

  it("tells screen readers how demanding the game is", () => {
    const html = renderToString(<GameCard game={card({ difficulty: 2 })} lang="nb" progressStore={store} />);
    expect(html).toContain('aria-label="2 av 3"');
    expect(html.match(/class="filled"/g)).toHaveLength(2);
  });

  it("uses English labels on the English page", () => {
    const html = renderToString(<GameCard game={card({ difficulty: 3 })} lang="en" progressStore={store} />);
    expect(html).toContain("Demanding");
    expect(html).toContain('aria-label="3 of 3"');
    expect(html).toContain("Play now");
  });

  it("says the game is in Norwegian on the English page", () => {
    expect(renderToString(<GameCard game={card()} lang="en" progressStore={store} />)).toContain('<span class="pixel-badge outline">In Norwegian</span>');
  });

  it("does not mark the language on the Norwegian page", () => {
    expect(renderToString(<GameCard game={card()} lang="nb" progressStore={store} />)).not.toContain("pixel-badge outline");
  });

  it("keeps an empty place for the progress next to the button, filled in after hydration", () => {
    expect(renderToString(<GameCard game={card()} lang="nb" progressStore={store} />)).toMatch(
      /<div class="card-actions"><a class="button filled"[^>]*>.*?<\/a><p class="progress"><\/p><\/div>/,
    );
  });

  it("shows no progress for a game that is not available", () => {
    const html = renderToString(<GameCard game={card({ available: false })} lang="nb" progressStore={store} />);
    expect(html).not.toContain('class="progress');
  });
});
