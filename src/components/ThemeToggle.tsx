import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";
const NESTE: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };

// Leses og settes av et lite skript i <head> før siden tegnes, så det ikke blinker.
function lesMode(): Mode {
  try {
    const m = localStorage.getItem("tema");
    return m === "light" || m === "dark" ? m : "system";
  } catch {
    return "system";
  }
}

export function ThemeToggle({ labels, label }: { labels: Record<Mode, string>; label: string }) {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => setMode(lesMode()), []);

  function bytt() {
    const ny = NESTE[mode];
    setMode(ny);
    if (ny === "system") document.documentElement.removeAttribute("data-mode");
    else document.documentElement.setAttribute("data-mode", ny);
    try {
      if (ny === "system") localStorage.removeItem("tema");
      else localStorage.setItem("tema", ny);
    } catch { /* privat modus o.l. */ }
  }

  return (
    <button type="button" className="pille" onClick={bytt} aria-label={`${label}: ${labels[mode]}`}>
      <span aria-hidden="true" className={`tema-ikon tema-${mode}`} />
      <span>{labels[mode]}</span>
    </button>
  );
}
