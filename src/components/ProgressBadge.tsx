import type { GameProgress } from "../games/progress";

interface Props { progress: GameProgress | undefined; labels: { heading: string } & Record<GameProgress, string> }

// Empty until the progress is known, so nothing jumps and the server HTML matches the first render.
export function ProgressBadge({ progress, labels }: Props) {
  return (
    <p className={progress ? `progress progress-${progress}` : "progress"}>
      {progress && (
        <>
          <span className="visually-hidden">{labels.heading}: </span>
          {labels[progress]}
          {progress === "solved" && <span aria-hidden="true"> ✓</span>}
        </>
      )}
    </p>
  );
}
