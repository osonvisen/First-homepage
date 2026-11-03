import { UI } from "../i18n";
import { pagePath, type PageKind } from "../routes";
import type { Lang } from "../types";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

interface Props { lang: Lang; page: PageKind }

export function SiteHeader({ lang, page }: Props) {
  const ui = UI[lang];
  const home = pagePath({ page: "home", lang });
  const other = ui.otherLang;
  return (
    <>
      <a className="skip-link" href="#content">{ui.skipLink}</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href={home}>
            <Logo className="brand-logo" />
            <span>orjans.no</span>
          </a>
          <nav aria-label={ui.mainNav} className="main-nav">
            <ul>
              <li><a href={`${home}#projects`}>{ui.nav.projects}</a></li>
              <li><a href={`${home}#experience`}>{ui.nav.experience}</a></li>
              <li><a href={`${home}#about`}>{ui.nav.about}</a></li>
              <li><a href={`${home}#games`}>{ui.nav.games}</a></li>
              <li><a href={`${home}#contact`}>{ui.nav.contact}</a></li>
            </ul>
          </nav>
          <div className="header-tools">
            <ThemeToggle labels={ui.theme} label={ui.themeLabel} />
            <a className="pill" href={pagePath({ page, lang: other.lang })} hrefLang={other.lang} lang={other.lang} aria-label={`${other.code} – ${other.name}`}>
              {other.code}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
