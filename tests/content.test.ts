// Checks the real content in src/content. It is edited in Pages CMS, which cannot enforce
// these rules itself, and deploy.yml runs the tests before publishing.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import shared from "../src/content/shared.json";
import nb from "../src/content/nb.json";
import en from "../src/content/en.json";

const DIFFICULTIES: unknown[] = [1, 2, 3];
const LANGUAGES: unknown[] = ["SQL", "Python + SQL"];
// Must be a valid folder name under public/, since the game is served from /<id>/.
const FOLDER_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const gameIds = shared.games.map((g) => g.id);

// Only the parts of the Pages CMS config this test reads.
interface CmsField { name: string; fields?: CmsField[]; options?: { values?: (string | { name: string })[] } }
interface CmsConfig { content: { name: string; fields?: CmsField[] }[] }

const cms = parse(readFileSync(new URL("../.pages.yml", import.meta.url), "utf8")) as CmsConfig;
const fieldNamed = (fields: CmsField[] | undefined, name: string) => fields?.find((f) => f.name === name);

/** The ids the editor can choose from for a game text, in the given content entry. */
function cmsGameIdOptions(entry: string): string[] {
  const games = fieldNamed(cms.content.find((c) => c.name === entry)?.fields, "games");
  const values = fieldNamed(games?.fields, "id")?.options?.values ?? [];
  return values.map((v) => (typeof v === "string" ? v : v.name));
}

describe("games in shared.json", () => {
  it("has unique ids", () => {
    expect(new Set(gameIds).size).toBe(gameIds.length);
  });

  it.each(shared.games)("$id has an id that works as a folder name", (game) => {
    expect(game.id).toMatch(FOLDER_NAME);
  });

  it.each(shared.games)("$id has a difficulty of 1, 2 or 3", (game) => {
    expect(DIFFICULTIES).toContain(game.difficulty);
  });

  it.each(shared.games)("$id has a known language", (game) => {
    expect(LANGUAGES).toContain(game.languages);
  });

  it.each(shared.games)("$id says whether it is available", (game) => {
    expect(typeof game.available).toBe("boolean");
  });

  // Stops a game from being marked as ready in Pages CMS before its files are published.
  it("has published every game that is marked available", () => {
    const unpublished = shared.games
      .filter((game) => game.available)
      .filter((game) => !existsSync(new URL(`../public/${game.id}/index.html`, import.meta.url)))
      .map((game) => `public/${game.id}/index.html`);
    expect(unpublished).toEqual([]);
  });
});

describe.each([
  ["nb", nb],
  ["en", en],
])("game texts in %s.json", (_, content) => {
  const textIds = content.games.map((t) => t.id);

  it("has exactly one text for every game", () => {
    expect([...textIds].sort()).toEqual([...gameIds].sort());
  });

  it.each(content.games)("$id has every field filled in", (text) => {
    for (const field of [text.title, text.description, text.skills, text.studyFit]) {
      expect(field.trim()).not.toBe("");
    }
  });

  it("has an intro and a note on where progress is saved", () => {
    expect(content.gamesPageIntro.trim()).not.toBe("");
    expect(content.progressNote.trim()).not.toBe("");
  });
});

describe.each(["norwegian", "english"])("game text select in .pages.yml (%s)", (entry) => {
  it("offers exactly the game ids in shared.json", () => {
    expect([...cmsGameIdOptions(entry)].sort()).toEqual([...gameIds].sort());
  });
});
