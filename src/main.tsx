import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { pageData } from "./content";
import "./fonts";
import "./styles.css";

// The page is already rendered to HTML at build time. Hydration makes the buttons interactive.
const lang = document.documentElement.lang === "en" ? "en" : "nb";
hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App {...pageData(lang)} />
  </StrictMode>
);
