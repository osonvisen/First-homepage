import { DIFFICULTY_LEVELS } from "../games/catalog";
import type { Difficulty } from "../types";

interface Props { level: Difficulty; describe: (level: number, max: number) => string }

// The word «Krevende» is shown next to the dots by the caller, so the scale is not mistaken
// for the Lett/Middels/Vanskelig levels inside the games. Screen readers hear "2 av 3".
export function DifficultyDots({ level, describe }: Props) {
  return (
    <span className="difficulty" role="img" aria-label={describe(level, DIFFICULTY_LEVELS.length)}>
      {DIFFICULTY_LEVELS.map((n) => <span key={n} className={n <= level ? "filled" : undefined} />)}
    </span>
  );
}
