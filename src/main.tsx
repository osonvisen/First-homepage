import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Page } from "./Page";
import { pageData } from "./content";
import { findRoute, type Route } from "./routes";
import "./fonts";
import "./styles.css";

// The page is already rendered to HTML at build time. Hydration makes the buttons interactive.
// The URL decides which page this is; the html lang is the fallback for a path we do not know.
const fallback: Route = { page: "home", lang: document.documentElement.lang === "en" ? "en" : "nb" };
const route = findRoute(location.pathname) ?? fallback;
hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <Page page={route.page} {...pageData(route.lang)} />
  </StrictMode>
);
