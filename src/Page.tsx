import type { ComponentType } from "react";
import App from "./App";
import { GamesPage } from "./GamesPage";
import type { PageKind } from "./routes";
import type { PageData } from "./types";

// A lookup instead of a switch: a new page is one new line here and one in routes.ts.
const PAGES: Record<PageKind, ComponentType<PageData>> = { home: App, games: GamesPage };

export function Page({ page, ...data }: PageData & { page: PageKind }) {
  const Component = PAGES[page];
  return <Component {...data} />;
}
