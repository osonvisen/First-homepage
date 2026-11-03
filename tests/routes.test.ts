import { describe, expect, it } from "vitest";
import { findRoute, pagePath, ROUTES } from "../src/routes.ts";

describe("findRoute", () => {
  it.each([
    ["/", { page: "home", lang: "nb" }],
    ["/en/", { page: "home", lang: "en" }],
    ["/spill/", { page: "games", lang: "nb" }],
    ["/en/games/", { page: "games", lang: "en" }],
  ])("finds the page for %s", (path, route) => {
    expect(findRoute(path)).toEqual(route);
  });

  it.each(["/spill", "/spill/", "/spill/index.html"])("treats %s as the games page", (path) => {
    expect(findRoute(path)).toEqual({ page: "games", lang: "nb" });
  });

  it.each(["/fjordglimt/", "/games/", "/en/spill/", "/nope"])("does not know %s", (path) => {
    expect(findRoute(path)).toBeUndefined();
  });

  it("finds every route again from its own path", () => {
    for (const route of ROUTES) expect(findRoute(pagePath(route))).toEqual(route);
  });

  it("has a page for every language", () => {
    expect(ROUTES).toHaveLength(4);
  });
});
