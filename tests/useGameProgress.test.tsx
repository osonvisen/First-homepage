// @vitest-environment jsdom
// The only test that needs a DOM: useEffect does not run in renderToString.
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { useGameProgress } from "../src/games/useGameProgress.ts";
import type { GameProgress } from "../src/games/progress.ts";
import type { ProgressStore } from "../src/games/progressStore.ts";
import type { GameId } from "../src/types.ts";

const FJORDGLIMT = "fjordglimt" as GameId;

function Probe({ store }: { store: ProgressStore }) {
  return <output>{useGameProgress(store, FJORDGLIMT) ?? "unknown"}</output>;
}

const storeReturning = (value: GameProgress): ProgressStore => ({ read: () => Promise.resolve(value) });

let container: HTMLDivElement;
let root: Root;

beforeAll(() => {
  // Tells React that this environment runs act(), so it does not warn about it.
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function mount() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
}

describe("useGameProgress", () => {
  it("knows nothing on the first render, like the server", () => {
    mount();
    // act() without await flushes the render but not the store's promise.
    act(() => root.render(<Probe store={storeReturning("solved")} />));
    expect(container.textContent).toBe("unknown");
  });

  it("shows the stored progress once it has been read", async () => {
    mount();
    await act(async () => root.render(<Probe store={storeReturning("started")} />));
    expect(container.textContent).toBe("started");
  });

  it("treats a store that fails as not started", async () => {
    const failing: ProgressStore = { read: () => Promise.reject(new Error("server down")) };
    mount();
    await act(async () => root.render(<Probe store={failing} />));
    expect(container.textContent).toBe("notStarted");
  });

  it("ignores a late answer from a store it no longer uses", async () => {
    let answerOld: (value: GameProgress) => void = () => {};
    const slowOld: ProgressStore = { read: () => new Promise((resolve) => { answerOld = resolve; }) };
    mount();
    act(() => root.render(<Probe store={slowOld} />));
    await act(async () => root.render(<Probe store={storeReturning("started")} />));
    await act(async () => answerOld("solved"));
    expect(container.textContent).toBe("started");
  });
});
