import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";
const NEXT: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };
const STORAGE_KEY = "theme";

// The stored choice is also applied by a small script in <head> before first paint, to avoid a flash.
function readMode(): Mode {
  try {
    const m = localStorage.getItem(STORAGE_KEY);
    return m === "light" || m === "dark" ? m : "system";
  } catch {
    return "system";
  }
}

export function ThemeToggle({ labels, label }: { labels: Record<Mode, string>; label: string }) {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => setMode(readMode()), []);

  function cycle() {
    const next = NEXT[mode];
    setMode(next);
    if (next === "system") document.documentElement.removeAttribute("data-mode");
    else document.documentElement.setAttribute("data-mode", next);
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch { /* private mode etc. */ }
  }

  return (
    <button type="button" className="pill" onClick={cycle} aria-label={`${label}: ${labels[mode]}`}>
      <span aria-hidden="true" className={`theme-icon theme-${mode}`} />
      <span>{labels[mode]}</span>
    </button>
  );
}
