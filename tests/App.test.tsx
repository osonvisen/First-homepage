// Covers the games section and the hero button on the front page, not the rest of it.
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import App from "../src/App.tsx";
import type { GameCard, GameId, Lang, PageData } from "../src/types.ts";

const card = (id: string, available: boolean): GameCard => ({
  id: id as GameId,
  languages: "SQL",
  difficulty: 1,
  available,
  title: `Title ${id}`,
  description: `Long presentation of ${id}`,
  skills: `Skills ${id}`,
  studyFit: "Early",
  url: `/${id}/`,
});

const render = (lang: Lang) => {
  const page: PageData = {
    lang,
    shared: { name: "Test Person" },
    text: { role: "Developer" },
    games: [card("ready", true), card("later", false)],
  };
  return renderToString(<App {...page} />);
};

/** The games section only, so links elsewhere on the page do not count. */
const gamesSection = (html: string) => html.match(/<section[^>]*id="games"[\s\S]*?<\/section>/)?.[0] ?? "";

describe("App games section", () => {
  it("links to the games page in the same language", () => {
    expect(gamesSection(render("nb"))).toContain('href="/spill/"');
    expect(gamesSection(render("en"))).toContain('href="/en/games/"');
  });

  it("shows a short card that links straight to the game", () => {
    const section = gamesSection(render("nb"));
    expect(section).toContain('href="/ready/"');
    expect(section).toContain("Skills ready");
    expect(section).not.toContain("Long presentation");
  });

  it("leaves a game that is not available to the games page", () => {
    expect(gamesSection(render("nb"))).not.toContain("Title later");
  });
});

describe("App hero", () => {
  it("sends «Prøv spillene» to the games page", () => {
    expect(render("nb")).toMatch(/<a class="button outline" href="\/spill\/">Prøv spillene<\/a>/);
    expect(render("en")).toMatch(/<a class="button outline" href="\/en\/games\/">Try the games<\/a>/);
  });
});
