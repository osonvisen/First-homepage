import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CV_PATHS } from "../src/cv.ts";

describe("CV files", () => {
  it.each(Object.entries(CV_PATHS))("has a published file for %s", (_lang, path) => {
    expect(existsSync(new URL(`../public${path}`, import.meta.url))).toBe(true);
  });
});
