import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { SiteHeader } from "../src/components/SiteHeader.tsx";

const languageLink = (html: string) => html.match(/<a class="pill" href="([^"]+)"/)?.[1];

describe("SiteHeader", () => {
  it("links the menu to the sections on the front page, also from the games page", () => {
    const html = renderToString(<SiteHeader lang="nb" page="games" />);
    expect(html).toContain('href="/#projects"');
    expect(html).toContain('href="/#contact"');
  });

  it("keeps English menu links on the English front page", () => {
    expect(renderToString(<SiteHeader lang="en" page="games" />)).toContain('href="/en/#projects"');
  });

  it("switches language to the same page", () => {
    expect(languageLink(renderToString(<SiteHeader lang="en" page="games" />))).toBe("/spill/");
    expect(languageLink(renderToString(<SiteHeader lang="nb" page="games" />))).toBe("/en/games/");
  });

  it("switches language between the front pages", () => {
    expect(languageLink(renderToString(<SiteHeader lang="nb" page="home" />))).toBe("/en/");
    expect(languageLink(renderToString(<SiteHeader lang="en" page="home" />))).toBe("/");
  });
});
