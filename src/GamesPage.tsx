import type { PageData } from "./types";
import { UI } from "./i18n";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { GameCard } from "./components/GameCard";
import { createLocalProgressStore, type ProgressStore } from "./games/progressStore";

// Created once. It only touches localStorage when a card reads its progress after hydration.
const browserProgressStore = createLocalProgressStore();

interface Props extends PageData { progressStore?: ProgressStore }

export function GamesPage({ lang, shared, text, games, progressStore = browserProgressStore }: Props) {
  const labels = UI[lang].gamesPage;

  return (
    <>
      <SiteHeader lang={lang} page="games" />

      <main id="content" className="container main">
        <div className="page-head">
          <h1 className="page-title">{labels.title}</h1>
          {text.gamesPageIntro && <p className="intro">{text.gamesPageIntro}</p>}
          {text.progressNote && <p className="progress-note">{text.progressNote}</p>}
        </div>

        {games.length > 0 && (
          <section className="section" aria-labelledby="path-heading">
            <div className="section-head"><h2 id="path-heading">{labels.pathHeading}</h2></div>
            {/* An ordered list, so screen readers also hear the recommended order. */}
            <ol className="game-path">
              {games.map((game, index) => (
                <li key={game.id}>
                  <span className="path-step" aria-hidden="true">{index + 1}</span>
                  <GameCard game={game} lang={lang} progressStore={progressStore} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <SiteFooter lang={lang} name={shared.name} location={shared.location} />
    </>
  );
}
