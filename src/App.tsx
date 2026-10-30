import type { SideData } from "./types";
import { UI, avsnitt } from "./i18n";
import { Logo } from "./components/Logo";
import { ThemeToggle } from "./components/ThemeToggle";
import { EmailReveal } from "./components/EmailReveal";

const erEkstern = (url: string) => /^https?:\/\//.test(url);
const ekstern = (url: string) => (erEkstern(url) ? { target: "_blank", rel: "noopener" } : {});

// En kort, stabil «commit-hash» per rad i erfaringsloggen (bare pynt).
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export default function App({ lang, felles, tekst, bildeSrc }: SideData) {
  const t = UI[lang];
  const [fornavn, ...rest] = felles.navn.split(" ");
  const etternavn = rest.join(" ");

  return (
    <>
      <a className="hopp" href="#innhold">{t.skip}</a>
      <header className="topp">
        <div className="ramme topp-indre">
          <a className="merke" href={lang === "en" ? "/en/" : "/"}>
            <Logo className="merke-logo" />
            <span>orjans.no</span>
          </a>
          <nav aria-label={lang === "en" ? "Main" : "Hovedmeny"} className="meny">
            <ul>
              <li><a href="#prosjekter">{t.nav.prosjekter}</a></li>
              <li><a href="#erfaring">{t.nav.erfaring}</a></li>
              <li><a href="#om">{t.nav.om}</a></li>
              <li><a href="#spill">{t.nav.spill}</a></li>
              <li><a href="#kontakt">{t.nav.kontakt}</a></li>
            </ul>
          </nav>
          <div className="verktoy">
            <ThemeToggle labels={t.tema} label={t.temaLabel} />
            <a className="pille" href={t.annetSprak.href} hrefLang={lang === "en" ? "nb" : "en"} lang={lang === "en" ? "nb" : "en"} aria-label={`${t.annetSprak.kode} – ${t.annetSprak.navn}`}>
              {t.annetSprak.kode}
            </a>
          </div>
        </div>
      </header>

      <main id="innhold" className="ramme hoved">
        <section className="helt" aria-labelledby="navn">
          <div className="helt-tekst">
            {felles.apenForJobb && tekst.status && <p className="status"><span aria-hidden="true" />{tekst.status}</p>}
            <h1 id="navn">{fornavn} <em>{etternavn}</em><span className="markor" aria-hidden="true">_</span></h1>
            <p className="rolle">{tekst.rolle}{tekst.rolleDetalj && <span> · {tekst.rolleDetalj}</span>}</p>
            {tekst.ingress && <p className="ingress">{tekst.ingress}</p>}
            <div className="knapper">
              <a className="knapp fylt" href="#prosjekter">{t.seProsjekter}</a>
              <a className="knapp kontur" href="#spill">{t.spillKnapp}</a>
            </div>
          </div>
          <figure className="portrett">
            {bildeSrc ? (
              <img src={bildeSrc.large} srcSet={`${bildeSrc.small} 360w, ${bildeSrc.large} 720w`} sizes="(max-width: 760px) 160px, 300px" width={300} height={300} alt={t.portrett(felles.navn)} />
            ) : (
              <Logo title={felles.navn} className="portrett-logo" />
            )}
          </figure>
        </section>

        {tekst.naa && tekst.naa.length > 0 && (
          <section className="seksjon" aria-labelledby="naa-h">
            <div className="seksjon-h"><h2 id="naa-h">{t.naa}</h2></div>
            <ul className="naa">
              {tekst.naa.map((n) => (
                <li key={n.tittel}>
                  <span className="etikett">{n.etikett}</span>
                  <h3>{n.tittel}</h3>
                  <p>{n.tekst}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tekst.prosjekter && tekst.prosjekter.length > 0 && (
          <section className="seksjon" id="prosjekter" aria-labelledby="prosjekter-h">
            <div className="seksjon-h"><h2 id="prosjekter-h">{t.prosjekter}</h2></div>
            <ul className="prosjekter">
              {tekst.prosjekter.map((p) => (
                <li key={p.tittel} className="kort">
                  <p className="meta">{[p.firma, p.merknad].filter(Boolean).join(" · ")}</p>
                  <h3>{p.tittel}</h3>
                  {p.punkter && <ul className="punkter">{p.punkter.map((x) => <li key={x}>{x}</li>)}</ul>}
                  {p.tagger && (
                    <ul className="tagger" aria-label="Teknologi">
                      {p.tagger.split(",").map((x) => x.trim()).filter(Boolean).map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tekst.erfaring && tekst.erfaring.length > 0 && (
          <section className="seksjon" id="erfaring" aria-labelledby="erfaring-h">
            <div className="seksjon-h"><h2 id="erfaring-h">{t.erfaring}</h2><span className="kommando" aria-hidden="true">git log --oneline</span></div>
            <ol className="logg">
              {tekst.erfaring.map((e, i) => (
                <li key={e.periode + e.sted + e.rolle}>
                  <span className="hash" aria-hidden="true">{hash(e.sted + e.rolle)}</span>
                  <span className="periode">{e.periode}</span>
                  <span className="hva"><b>{e.sted}</b> · {e.rolle}{i === 0 && e.pagaende && <span className="head"> (HEAD)</span>}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="seksjon" id="om" aria-labelledby="om-h">
          <div className="seksjon-h"><h2 id="om-h">{t.om}</h2></div>
          <div className="om">
            <div className="fortelling">
              {avsnitt(tekst.omMeg).map((a) => <p key={a}>{a}</p>)}
              {tekst.serEtter && <p className="ser-etter">{tekst.serEtter}</p>}
            </div>
            {tekst.forKoden && (
              <aside className="for-koden" aria-labelledby="for-h">
                <h3 id="for-h">{t.forKoden}</h3>
                {avsnitt(tekst.forKoden).map((a) => <p key={a}>{a}</p>)}
              </aside>
            )}
          </div>
        </section>

        {tekst.stack && tekst.stack.length > 0 && (
          <section className="seksjon" aria-labelledby="stack-h">
            <div className="seksjon-h"><h2 id="stack-h">{t.stack}</h2></div>
            <dl className="stack">
              {tekst.stack.map((s) => (
                <div key={s.gruppe}><dt>{s.gruppe}</dt><dd>{s.verktoy}</dd></div>
              ))}
            </dl>
          </section>
        )}

        {tekst.spill && tekst.spill.length > 0 && (
          <section className="seksjon" id="spill" aria-labelledby="spill-h">
            <div className="seksjon-h"><h2 id="spill-h">{t.spill}</h2>{tekst.spillIngress && <span className="kommando">{tekst.spillIngress}</span>}</div>
            <ul className="spill">
              {tekst.spill.map((s) => (
                <li key={s.tittel}>
                  <a className="spillkort" href={s.lenke} lang="nb" {...(s.lenke ? ekstern(s.lenke) : {})}>
                    {s.status && <span className="merke-piksel">{s.status}</span>}
                    <h3>{s.tittel}</h3>
                    {s.beskrivelse && <p lang={lang}>{s.beskrivelse}</p>}
                    {s.ferdigheter && <p className="ferdigheter" lang={lang}>{s.ferdigheter}</p>}
                    <span className="spill-naa" lang={lang}>{t.spillNaa} →</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="kontakt" id="kontakt" aria-labelledby="kontakt-h">
          <div className="kontakt-tekst">
            <h2 id="kontakt-h">{tekst.kontaktTittel}</h2>
            {tekst.serEtter && <p>{tekst.serEtter}</p>}
            {tekst.kontaktTekst && <p>{tekst.kontaktTekst}</p>}
          </div>
          <div className="knapper">
            {felles.lenker?.map((l) => (
              <a key={l.url} className={`knapp ${l.tekst.toLowerCase().includes("linkedin") ? "fylt" : "kontur"}`} href={l.url} {...ekstern(l.url)}>
                {l.tekst}{erEkstern(l.url) && <span aria-hidden="true"> ↗</span>}
              </a>
            ))}
            {felles.epostBruker && felles.epostDomene && (
              <EmailReveal bruker={felles.epostBruker} domene={felles.epostDomene} vis={t.visEpost} kopier={t.kopier} kopiert={t.kopiert} />
            )}
          </div>
        </section>
      </main>

      <footer className="ramme bunn">
        <span className="bunn-merke"><Logo className="bunn-logo" /> © {new Date().getFullYear()} {felles.navn}{felles.sted && ` · ${felles.sted}`}</span>
        <span className="agent">{t.agent} <a href="/llms.txt">/llms.txt</a> {t.agentAlt}</span>
      </footer>
    </>
  );
}
