import innhold from "./content/forside.json";
import type { Forside, Prosjekt } from "./types";

const data = innhold as Forside;

// Bilder fra Pages CMS lagres som "media/navn.jpg". BASE_URL gjør stien riktig uansett hvor siden ligger.
const bildeUrl = (sti?: string) =>
  !sti ? undefined : /^https?:\/\//.test(sti) ? sti : `${import.meta.env.BASE_URL}${sti.replace(/^\//, "")}`;

const erEkstern = (url: string) => /^https?:\/\//.test(url);

function initialer(navn: string) {
  return navn
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((d) => d[0]!.toUpperCase())
    .join("");
}

function ProsjektKort({ p }: { p: Prosjekt }) {
  const kommer = p.status === "Kommer snart" || !p.lenke;
  const innholdIKort = (
    <>
      {p.bilde && <img className="kort-bilde" src={bildeUrl(p.bilde)} alt="" loading="lazy" />}
      <div className="kort-topp">
        <h3>{p.tittel}</h3>
        {p.status && <span className={`status status-${p.status.replace(/\s+/g, "-").toLowerCase()}`}>{p.status}</span>}
      </div>
      {p.beskrivelse && <p>{p.beskrivelse}</p>}
      {p.ferdigheter && (
        <p className="ferdigheter">
          <span className="etikett">Øver på</span> {p.ferdigheter}
        </p>
      )}
      {!kommer && <span className="aapne">Åpne {erEkstern(p.lenke!) ? "↗" : "→"}</span>}
    </>
  );
  return (
    <li>
      {kommer ? (
        <div className="kort kort-inaktiv">{innholdIKort}</div>
      ) : (
        <a className="kort" href={p.lenke} {...(erEkstern(p.lenke!) ? { target: "_blank", rel: "noopener" } : {})}>
          {innholdIKort}
        </a>
      )}
    </li>
  );
}

export default function App() {
  const avsnitt = (data.intro ?? "").split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);
  const prosjekter = data.prosjekter ?? [];

  return (
    <div className="side">
      <header className="topp">
        <span className="domene">orjans.no</span>
      </header>

      <main>
        <section className="intro" aria-labelledby="navn">
          <div className="portrett" aria-hidden={!data.bilde}>
            {data.bilde ? <img src={bildeUrl(data.bilde)} alt={data.navn} /> : <span>{initialer(data.navn)}</span>}
          </div>
          <div className="intro-tekst">
            <h1 id="navn">{data.navn}</h1>
            {data.tittel && <p className="tittel">{data.tittel}</p>}
            {avsnitt.map((a, i) => (
              <p key={i}>{a}</p>
            ))}
            {data.lenker && data.lenker.length > 0 && (
              <ul className="lenker">
                {data.lenker.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} {...(erEkstern(l.url) ? { target: "_blank", rel: "noopener" } : {})}>
                      {l.tekst}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="prosjekter-tittel" className="prosjekter">
          <h2 id="prosjekter-tittel">Spill og prosjekter</h2>
          {prosjekter.length ? (
            <ul className="kort-liste">
              {prosjekter.map((p) => (
                <ProsjektKort key={p.tittel} p={p} />
              ))}
            </ul>
          ) : (
            <p className="tom">Prosjektene kommer her.</p>
          )}
        </section>
      </main>

      <footer className="bunn">
        <span>© {new Date().getFullYear()} {data.navn}</span>
      </footer>
    </div>
  );
}
