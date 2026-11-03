import { UI } from "../i18n";
import type { Lang } from "../types";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

interface Props { lang: Lang }

export function SiteHeader({ lang }: Props) {
  const ui = UI[lang];
  return (
    <>
      <a className="skip-link" href="#content">{ui.skipLink}</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href={lang === "en" ? "/en/" : "/"}>
            <Logo className="brand-logo" />
            <span>orjans.no</span>
          </a>
          <nav aria-label={ui.mainNav} className="main-nav">
            <ul>
              <li><a href="#projects">{ui.nav.projects}</a></li>
              <li><a href="#experience">{ui.nav.experience}</a></li>
              <li><a href="#about">{ui.nav.about}</a></li>
              <li><a href="#games">{ui.nav.games}</a></li>
              <li><a href="#contact">{ui.nav.contact}</a></li>
            </ul>
          </nav>
          <div className="header-tools">
            <ThemeToggle labels={ui.theme} label={ui.themeLabel} />
            <a className="pill" href={ui.otherLang.href} hrefLang={ui.otherLang.lang} lang={ui.otherLang.lang} aria-label={`${ui.otherLang.code} – ${ui.otherLang.name}`}>
              {ui.otherLang.code}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
