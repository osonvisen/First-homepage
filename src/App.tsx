import type { PageData } from "./types";
import { UI, paragraphs } from "./i18n";
import { Logo } from "./components/Logo";
import { ThemeToggle } from "./components/ThemeToggle";
import { EmailReveal } from "./components/EmailReveal";

const isExternal = (url: string) => /^https?:\/\//.test(url);
const externalProps = (url: string) => (isExternal(url) ? { target: "_blank", rel: "noopener" } : {});

// A short, stable "commit hash" for each row in the experience log (decoration only).
function shortHash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export default function App({ lang, shared, text, portrait }: PageData) {
  const ui = UI[lang];
  const [firstName, ...rest] = shared.name.split(" ");
  const lastName = rest.join(" ");

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

      <main id="content" className="container main">
        <section className="hero" aria-labelledby="name">
          <figure className="portrait">
            {portrait ? (
              <img src={portrait.large} srcSet={`${portrait.small} 360w, ${portrait.large} 720w`} sizes="(max-width: 700px) 160px, 300px" width={300} height={300} alt={ui.portraitAlt(shared.name)} />
            ) : (
              <Logo title={shared.name} className="portrait-logo" />
            )}
          </figure>
          <div className="hero-text">
            {shared.openToWork && text.status && <p className="status"><span aria-hidden="true" />{text.status}</p>}
            <h1 id="name">{firstName} <em>{lastName}</em><span className="cursor" aria-hidden="true">_</span></h1>
            <p className="role">{text.role}{text.roleDetail && <span> · {text.roleDetail}</span>}</p>
            {text.intro && <p className="intro">{text.intro}</p>}
            <div className="actions">
              <a className="button filled" href="#projects">{ui.seeProjects}</a>
              <a className="button outline" href="#games">{ui.playGames}</a>
            </div>
          </div>
        </section>

        {text.now && text.now.length > 0 && (
          <section className="section" aria-labelledby="now-heading">
            <div className="section-head"><h2 id="now-heading">{ui.now}</h2></div>
            <ul className="now">
              {text.now.map((n) => (
                <li key={n.title}>
                  <span className="label">{n.label}</span>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {text.projects && text.projects.length > 0 && (
          <section className="section" id="projects" aria-labelledby="projects-heading">
            <div className="section-head"><h2 id="projects-heading">{ui.projects}</h2></div>
            <ul className="projects">
              {text.projects.map((p) => (
                <li key={p.title} className="card">
                  <p className="meta">{[p.company, p.note].filter(Boolean).join(" · ")}</p>
                  <h3>{p.title}</h3>
                  {p.highlights && <ul className="highlights">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
                  {p.tags && (
                    <ul className="tags" aria-label={ui.techLabel}>
                      {p.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {text.experience && text.experience.length > 0 && (
          <section className="section" id="experience" aria-labelledby="experience-heading">
            <div className="section-head"><h2 id="experience-heading">{ui.experience}</h2><span className="command" aria-hidden="true">git log --oneline</span></div>
            <ol className="log">
              {text.experience.map((e, i) => (
                <li key={e.period + e.place + e.role}>
                  <span className="hash" aria-hidden="true">{shortHash(e.place + e.role)}</span>
                  <span className="period">{e.period}</span>
                  <span className="what"><b>{e.place}</b> · {e.role}{i === 0 && e.current && <span className="head"> (HEAD)</span>}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="section" id="about" aria-labelledby="about-heading">
          <div className="section-head"><h2 id="about-heading">{ui.about}</h2></div>
          <div className="about">
            <div className="story">
              {paragraphs(text.about).map((p) => <p key={p}>{p}</p>)}
              {text.lookingFor && <p className="looking-for">{text.lookingFor}</p>}
            </div>
            {text.beforeCode && (
              <aside className="before-code" aria-labelledby="before-code-heading">
                <h3 id="before-code-heading">{ui.beforeCode}</h3>
                {paragraphs(text.beforeCode).map((p) => <p key={p}>{p}</p>)}
              </aside>
            )}
          </div>
        </section>

        {text.stack && text.stack.length > 0 && (
          <section className="section" aria-labelledby="stack-heading">
            <div className="section-head"><h2 id="stack-heading">{ui.stack}</h2></div>
            <dl className="stack">
              {text.stack.map((s) => (
                <div key={s.group}><dt>{s.group}</dt><dd>{s.tools}</dd></div>
              ))}
            </dl>
          </section>
        )}

        {text.games && text.games.length > 0 && (
          <section className="section" id="games" aria-labelledby="games-heading">
            <div className="section-head"><h2 id="games-heading">{ui.games}</h2>{text.gamesIntro && <span className="command">{text.gamesIntro}</span>}</div>
            <ul className="games">
              {text.games.map((g) => (
                <li key={g.title}>
                  <a className="game-card" href={g.url} {...(g.url ? externalProps(g.url) : {})}>
                    {g.status && <span className="pixel-badge">{g.status}</span>}
                    <h3 lang="nb">{g.title}</h3>
                    {g.description && <p>{g.description}</p>}
                    {g.skills && <p className="skills">{g.skills}</p>}
                    <span className="play-now">{ui.playNow} →</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="contact" id="contact" aria-labelledby="contact-heading">
          <div className="contact-text">
            <h2 id="contact-heading">{text.contactTitle}</h2>
            {text.lookingFor && <p>{text.lookingFor}</p>}
            {text.contactText && <p>{text.contactText}</p>}
          </div>
          <div className="actions">
            {shared.links?.map((l) => (
              <a key={l.url} className={`button ${l.label.toLowerCase().includes("linkedin") ? "filled" : "outline"}`} href={l.url} {...externalProps(l.url)}>
                {l.label}{isExternal(l.url) && <span aria-hidden="true"> ↗</span>}
              </a>
            ))}
            {shared.emailUser && shared.emailDomain && (
              <EmailReveal user={shared.emailUser} domain={shared.emailDomain} showLabel={ui.showEmail} copyLabel={ui.copy} copiedLabel={ui.copied} />
            )}
          </div>
        </section>
      </main>

      <footer className="container site-footer">
        <span className="footer-brand"><Logo className="footer-logo" /> © {new Date().getFullYear()} {shared.name}{shared.location && ` · ${shared.location}`}</span>
        <span className="agent">{ui.agentNote} <a href="/llms.txt">/llms.txt</a> {ui.agentNoteEnd}</span>
      </footer>
    </>
  );
}
