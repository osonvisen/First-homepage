import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { sideData } from "./data";
import "./fonts";
import "./styles.css";

// Siden er allerede ferdig tegnet som HTML ved bygging. Her «vekkes» den, så knappene virker.
const lang = document.documentElement.lang === "en" ? "en" : "nb";
hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App {...sideData(lang)} />
  </StrictMode>
);
