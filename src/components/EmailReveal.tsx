import { useState } from "react";

// E-posten settes sammen først når noen klikker, så den ikke står i HTML-en for roboter.
export function EmailReveal({ bruker, domene, vis, kopier, kopiert }: { bruker: string; domene: string; vis: string; kopier: string; kopiert: string }) {
  const [synlig, setSynlig] = useState(false);
  const [kopi, setKopi] = useState(false);
  const adresse = `${bruker}@${domene}`;

  if (!synlig) {
    return (
      <button type="button" className="knapp kontur" onClick={() => setSynlig(true)}>
        {vis}
      </button>
    );
  }
  return (
    <span className="epost">
      <a href={`mailto:${adresse}`}>{adresse}</a>
      <button
        type="button"
        className="knapp liten kontur"
        onClick={async () => {
          try { await navigator.clipboard.writeText(adresse); setKopi(true); setTimeout(() => setKopi(false), 2000); } catch { /* ignorer */ }
        }}
      >
        {kopi ? kopiert : kopier}
      </button>
    </span>
  );
}
