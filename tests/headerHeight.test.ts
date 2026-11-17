// @vitest-environment jsdom
// jsdom has no layout or ResizeObserver, so the test supplies both.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HEADER_HEIGHT_VAR, trackHeaderHeight } from "../src/components/headerHeight.ts";

let resize: () => void;
const disconnect = vi.fn();

class FakeResizeObserver {
  constructor(callback: () => void) { resize = callback; }
  observe() {}
  disconnect() { disconnect(); }
}

function headerWithHeight(height: { value: number }): HTMLElement {
  const header = document.createElement("header");
  header.getBoundingClientRect = () => ({ height: height.value }) as DOMRect;
  return header;
}

beforeEach(() => vi.stubGlobal("ResizeObserver", FakeResizeObserver));
afterEach(() => vi.unstubAllGlobals());

describe("trackHeaderHeight", () => {
  it("publishes the header height, rounded up, as a CSS variable", () => {
    const root = document.createElement("html");
    trackHeaderHeight(headerWithHeight({ value: 65.4 }), root);
    expect(root.style.getPropertyValue(HEADER_HEIGHT_VAR)).toBe("66px");
  });

  it("follows the header when it changes size, for example when the menu wraps", () => {
    const root = document.createElement("html");
    const height = { value: 65 };
    trackHeaderHeight(headerWithHeight(height), root);
    height.value = 118;
    resize();
    expect(root.style.getPropertyValue(HEADER_HEIGHT_VAR)).toBe("118px");
  });

  it("stops observing on cleanup", () => {
    trackHeaderHeight(headerWithHeight({ value: 65 }), document.createElement("html"))();
    expect(disconnect).toHaveBeenCalled();
  });
});
