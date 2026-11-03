import { useEffect, useState } from "react";
import type { GameId } from "../types";
import type { GameProgress } from "./progress";
import type { ProgressStore } from "./progressStore";

/**
 * Reads the visitor's progress after the page has hydrated. The server cannot know it, so the first
 * render is always undefined on both sides and the HTML matches.
 */
export function useGameProgress(store: ProgressStore, gameId: GameId): GameProgress | undefined {
  const [progress, setProgress] = useState<GameProgress>();
  useEffect(() => {
    let isCurrent = true;
    store
      .read(gameId)
      .then((value) => { if (isCurrent) setProgress(value); })
      // The store promises never to fail, but a future server store might: show "not started" then.
      .catch(() => { if (isCurrent) setProgress("notStarted"); });
    return () => { isCurrent = false; };
  }, [store, gameId]);
  return progress;
}
