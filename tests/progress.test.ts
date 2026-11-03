import { describe, expect, it } from "vitest";
import { parseProgress } from "../src/games/progress.ts";

describe("parseProgress", () => {
  it("reads a started record", () => {
    expect(parseProgress('{"version":1,"status":"started"}')).toBe("started");
  });

  it("reads a solved record", () => {
    expect(parseProgress('{"version":1,"status":"solved"}')).toBe("solved");
  });

  it("ignores fields it does not know, since new fields keep version 1", () => {
    expect(parseProgress('{"version":1,"status":"solved","extra":true}')).toBe("solved");
  });

  it("treats a missing record as not started", () => {
    expect(parseProgress(null)).toBe("notStarted");
  });

  it.each([
    ["empty text", ""],
    ["text that is not JSON", "{version:1"],
    ["JSON null", "null"],
    ["an array", "[]"],
    ["a bare string", '"solved"'],
    ["a missing version", '{"status":"solved"}'],
    ["another version", '{"version":2,"status":"solved"}'],
    ["a version given as text", '{"version":"1","status":"solved"}'],
    ["a missing status", '{"version":1}'],
    ["an unknown status", '{"version":1,"status":"finished"}'],
    ["notStarted as a stored status", '{"version":1,"status":"notStarted"}'],
    ["a status in the wrong case", '{"version":1,"status":"SOLVED"}'],
  ])("treats %s as not started", (_, raw) => {
    expect(parseProgress(raw)).toBe("notStarted");
  });
});
