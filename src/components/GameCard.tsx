import { UI } from "../i18n";
import { GAME_LANGUAGE } from "../games/catalog";
import type { GameCard as GameCardData, Lang } from "../types";
import { DifficultyDots } from "./DifficultyDots";

interface Props { game: GameCardData; lang: Lang }

export function GameCard({ game, lang }: Props) {
  const ui = UI[lang];
  const labels = ui.gamesPage;
  const titleId = `game-${game.id}-title`;
  const isInOtherLanguage = lang !== GAME_LANGUAGE;

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
        // Every card has the same button text; aria-describedby tells screen readers which game it is.
        <a className="button filled" href={game.url} aria-describedby={titleId}>{ui.playNow} →</a>
      ) : (
        <p className="coming-soon">{labels.comingSoon}</p>
      )}
    </article>
  );
}
