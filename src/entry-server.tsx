import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { Page } from "./Page";
import { pageData } from "./content";
import type { Route } from "./routes";

// Only used at build time, to render static HTML for every page in ROUTES.
export function render({ page, lang }: Route) {
  return renderToString(
    <StrictMode>
      <Page page={page} {...pageData(lang)} />
    </StrictMode>
  );
}
export { pageData };
