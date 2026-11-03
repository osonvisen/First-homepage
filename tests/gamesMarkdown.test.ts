import { describe, expect, it } from "vitest";
import { gamesMarkdown } from "../scripts/gamesMarkdown.ts";
import type { Difficulty, GameCard, GameId, PageData } from "../src/types.ts";

const card = (id: string, title: string, difficulty: Difficulty, available: boolean): GameCard => ({
  id: id as GameId,
  languages: "SQL",
  difficulty,
  available,
  title,
  description: `About ${title}.`,
  skills: "JOIN",
  studyFit: "Early",
  url: `/${id}/`,
});

const page: PageData = {
  lang: "en",
  shared: { name: "Test Person" },
  text: { role: "Developer", gamesPageIntro: "Optional games for students." },
  games: [card("first", "First game", 1, true), card("second", "Second game", 2, true), card("third", "Third game", 3, false)],
};

const markdown = gamesMarkdown(page);
const lineFor = (title: string) => markdown.split("\n").find((line) => line.includes(`**${title}**`)) ?? "";

describe("gamesMarkdown", () => {
  it("starts with a heading and the intro from the content", () => {
    expect(markdown.startsWith("## SQL and Python games\n\nOptional games for students.")).toBe(true);
  });

  it("links the overview page in both languages", () => {
    expect(markdown).toContain("- Overview: https://orjans.no/en/games/ (Norwegian: https://orjans.no/spill/)");
  });

  it("numbers the games in the recommended order", () => {
    expect(lineFor("First game").startsWith("1. ")).toBe(true);
    expect(lineFor("Second game").startsWith("2. ")).toBe(true);
    expect(lineFor("Third game").startsWith("3. ")).toBe(true);
  });

  it("gives an available game its full URL", () => {
    expect(lineFor("Second game")).toBe(
      "2. **Second game** (SQL, demanding 2 of 3): About Second game. Practises: JOIN. Play: https://orjans.no/second/",
    );
  });

  it("marks a game that is not available as coming soon, without a URL", () => {
    expect(lineFor("Third game")).toContain("(SQL, demanding 3 of 3, coming soon)");
    expect(lineFor("Third game")).not.toContain("https://");
  });
});
