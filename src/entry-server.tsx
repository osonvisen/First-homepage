import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { pageData } from "./content";
import type { Lang } from "./types";

// Only used at build time, to render static HTML for / and /en/.
export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <App {...pageData(lang)} />
    </StrictMode>
  );
}
export { pageData };
