import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { sideData } from "./data";
import type { Lang } from "./types";

// Brukes bare ved bygging, for å lage ferdig HTML for / og /en/.
export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <App {...sideData(lang)} />
    </StrictMode>
  );
}
export { sideData };
