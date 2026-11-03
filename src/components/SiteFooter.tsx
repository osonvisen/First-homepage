import { UI } from "../i18n";
import type { Lang } from "../types";
import { Logo } from "./Logo";

interface Props { lang: Lang; name: string; location?: string }

export function SiteFooter({ lang, name, location }: Props) {
  const ui = UI[lang];
  return (
    <footer className="container site-footer">
      <span className="footer-brand"><Logo className="footer-logo" /> © {new Date().getFullYear()} {name}{location && ` · ${location}`}</span>
      <span className="agent">{ui.agentNote} <a href="/llms.txt">/llms.txt</a> {ui.agentNoteEnd}</span>
      {/* Opens the consent banner from public/analytics.js. */}
      <button type="button" className="footer-link" data-cookie-settings>{ui.cookieSettings}</button>
    </footer>
  );
}
