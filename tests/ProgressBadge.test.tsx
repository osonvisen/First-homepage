import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ProgressBadge } from "../src/components/ProgressBadge.tsx";
import type { GameProgress } from "../src/games/progress.ts";
import { UI } from "../src/i18n.ts";

// renderToString puts <!-- --> between text nodes that sit next to each other; they are not visible.
const render = (progress: GameProgress | undefined, lang: "nb" | "en" = "nb") =>
  renderToString(<ProgressBadge progress={progress} labels={UI[lang].gamesPage.progress} />).replace(/<!-- -->/g, "");

/** The text a sighted visitor sees, without the hidden heading and markup. */
const visibleText = (html: string) => html.replace(/<span class="visually-hidden">[^<]*<\/span>/, "").replace(/<[^>]+>/g, "");

describe("ProgressBadge", () => {
  it("is empty while the progress is not known yet", () => {
    expect(render(undefined)).toBe('<p class="progress"></p>');
  });

  it.each([
    ["notStarted", "Ikke startet", "Not started"],
    ["started", "Påbegynt", "In progress"],
    ["solved", "Løst ✓", "Solved ✓"],
  ] as const)("shows %s in both languages", (progress, nb, en) => {
    expect(visibleText(render(progress, "nb"))).toBe(nb);
    expect(visibleText(render(progress, "en"))).toBe(en);
  });

  it("hides the check mark from screen readers", () => {
    expect(render("solved")).toContain('<span aria-hidden="true"> ✓</span>');
    expect(render("started")).not.toContain("✓");
  });

  it("tells screen readers what the status is about", () => {
    expect(render("started")).toContain('<span class="visually-hidden">Fremgang: </span>');
  });

  it("gives each status its own class for styling", () => {
    expect(render("solved")).toContain('class="progress progress-solved"');
  });
});
