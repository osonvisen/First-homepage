import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { GamesPage } from "../src/GamesPage.tsx";
import type { GameCard, GameId, Lang, PageData } from "../src/types.ts";

const card = (id: string, title: string): GameCard => ({
  id: id as GameId,
  languages: "SQL",
  difficulty: 1,
  available: true,
  title,
  description: "Description",
  skills: "Skills",
  studyFit: "Study fit",
  url: `/${id}/`,
});

const page = (lang: Lang, games: GameCard[]): PageData => ({
  lang,
  shared: { name: "Test Person" },
  text: { role: "Developer", gamesPageIntro: "Optional games for students.", progressNote: "Saved only in this browser." },
  games,
});

const render = (lang: Lang, games: GameCard[]) => renderToString(<GamesPage {...page(lang, games)} />);

describe("GamesPage", () => {
  it("shows the heading and the intro from the content", () => {
    const html = render("nb", []);
    expect(html).toMatch(/<h1[^>]*>Spill<\/h1>/);
    expect(html).toContain("Optional games for students.");
  });

  it("says where the progress is saved", () => {
    expect(render("nb", [])).toContain('<p class="progress-note">Saved only in this browser.</p>');
  });

  it("shows the games as a numbered path in the recommended order", () => {
    const html = render("nb", [card("first", "Første"), card("second", "Andre"), card("third", "Tredje")]);
    const positions = ["Første", "Andre", "Tredje"].map((title) => html.indexOf(title));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).toContain('<ol class="game-path">');
    expect(html.match(/class="path-step"[^>]*>\d+</g)?.map((s) => s.replace(/\D/g, ""))).toEqual(["1", "2", "3"]);
  });

  it("leaves out the path when there are no games", () => {
    expect(render("nb", [])).not.toContain("game-path");
  });

  it("uses English labels on the English page", () => {
    const html = render("en", [card("first", "Første")]);
    expect(html).toMatch(/<h1[^>]*>Games<\/h1>/);
    expect(html).toContain("Recommended order");
  });
});
