import { parseProgress, type GameProgress } from "./progress";
import type { GameId } from "../types";

/**
 * Where the site reads how far a visitor has come in each game. Today that is the browser;
 * the async signature lets a server-backed store replace it without changing the callers.
 */
export interface ProgressStore {
  read(gameId: GameId): Promise<GameProgress>;
}

// Written by the games, see sql-games/docs/progress-record.md. The site only reads it.
const PROGRESS_KEY_PREFIX = "sql-games:progress:";

type ReadableStorage = Pick<Storage, "getItem">;

/** Reads the progress records from this browser's localStorage. */
export function createLocalProgressStore(getStorage: () => ReadableStorage = () => localStorage): ProgressStore {
  return {
    async read(gameId) {
      try {
        return parseProgress(getStorage().getItem(`${PROGRESS_KEY_PREFIX}${gameId}`));
      } catch {
        return "notStarted"; // Storage blocked (private mode, cookies off): show the game as not started.
      }
    },
  };
}
