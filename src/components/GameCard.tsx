import { UI } from "../i18n";
import { GAME_LANGUAGE } from "../games/catalog";
import type { ProgressStore } from "../games/progressStore";
import { useGameProgress } from "../games/useGameProgress";
import type { GameCard as GameCardData, Lang } from "../types";
import { DifficultyDots } from "./DifficultyDots";
import { ProgressBadge } from "./ProgressBadge";

interface Props { game: GameCardData; lang: Lang; progressStore: ProgressStore }

export function GameCard({ game, lang, progressStore }: Props) {
  const ui = UI[lang];
  const labels = ui.gamesPage;
  const titleId = `game-${game.id}-title`;
  const isInOtherLanguage = lang !== GAME_LANGUAGE;
  const progress = useGameProgress(progressStore, game.id);

  return (
    <article className={game.available ? "path-card" : "path-card unavailable"} aria-labelledby={titleId}>
      <div className="badges">
        <span className="pixel-badge">{game.languages}</span>
        {isInOtherLanguage && <span className="pixel-badge outline">{labels.gameLanguage}</span>}
      </div>
      {/* The games themselves are in Norwegian, so the titles are too. */}
      <h3 id={titleId} lang={GAME_LANGUAGE}>{game.title}</h3>
      <p>{game.description}</p>
      <dl className="game-facts">
        <div><dt>{labels.languages}</dt><dd>{game.languages}</dd></div>
        <div><dt>{labels.difficulty}</dt><dd><DifficultyDots level={game.difficulty} describe={labels.difficultyValue} /></dd></div>
        <div><dt>{labels.skills}</dt><dd>{game.skills}</dd></div>
        <div><dt>{labels.studyFit}</dt><dd>{game.studyFit}</dd></div>
      </dl>
      {game.available ? (
        <div className="card-actions">
          {/* Every card has the same button text; aria-describedby tells screen readers which game it is. */}
          <a className="button filled" href={game.url} aria-describedby={titleId}>{ui.playNow} →</a>
          <ProgressBadge progress={progress} labels={labels.progress} />
        </div>
      ) : (
        <p className="coming-soon">{labels.comingSoon}</p>
      )}
    </article>
  );
}
