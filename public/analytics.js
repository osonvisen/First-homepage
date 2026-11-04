// Google Analytics with consent, shared by every page on orjans.no (front page and games).
// Pages include it with one line in <head>:  <script src="/analytics.js" defer></script>
//
// Flow:
//   1. No choice stored yet  -> show the consent banner. Google is NOT contacted.
//   2. Visitor accepts       -> store "granted" and load gtag.js (production host only).
//   3. Visitor declines      -> store "denied". Nothing is loaded.
//   4. Any element with [data-cookie-settings] reopens the banner so the choice can be changed.
// On preview hosts (Cloudflare, localhost) the banner works, but gtag.js is never loaded,
// so test traffic does not pollute the statistics.
(function () {
  "use strict";

  const MEASUREMENT_ID = "G-1JS7QHWQMY";
  const PRODUCTION_HOSTS = ["orjans.no", "www.orjans.no"];
  const STORAGE_KEY = "analytics-consent";
  const CONSENT = { granted: "granted", denied: "denied" };
  const BANNER_ID = "consent-banner";
  const LOG_PREFIX = "[analytics]";

  const TEXT = {
    nb: {
      label: "Samtykke til informasjonskapsler",
      message: "Jeg bruker Google Analytics for å se hvor mange som besøker siden og spiller spillene. Analyse-cookies settes bare hvis du godtar.",
      accept: "Godta",
      decline: "Avslå",
    },
    en: {
      label: "Cookie consent",
      message: "I use Google Analytics to see how many people visit the site and play the games. Analytics cookies are only set if you accept.",
      accept: "Accept",
      decline: "Decline",
    },
  };

  let analyticsLoaded = false;

  // ---------- Consent storage ----------

  function readConsent() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === CONSENT.granted || value === CONSENT.denied ? value : "";
    } catch (error) {
      console.warn(LOG_PREFIX, "Could not read consent from localStorage.", error);
      return "";
    }
  }

  function saveConsent(value) {
    if (value !== CONSENT.granted && value !== CONSENT.denied) {
      console.error(LOG_PREFIX, "Refusing to store unknown consent value:", value);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      console.warn(LOG_PREFIX, "Could not store consent; the banner will show again next visit.", error);
    }
  }

  // ---------- Google Analytics ----------

  function isProductionHost() {
    return PRODUCTION_HOSTS.includes(location.hostname);
  }

  function loadGoogleAnalytics() {
    if (analyticsLoaded) return;
    if (!isProductionHost()) {
      console.info(LOG_PREFIX, `Consent granted, but ${location.hostname} is not production. Google Analytics is not loaded.`);
      return;
    }

    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.onerror = () => console.warn(LOG_PREFIX, "gtag.js could not be loaded (blocked or offline).");
    document.head.appendChild(script);

    analyticsLoaded = true;
    console.info(LOG_PREFIX, "Google Analytics loaded.");
  }

  // Used when a visitor withdraws consent after Google Analytics has already run.
  function stopGoogleAnalytics() {
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
    deleteAnalyticsCookies();
    console.info(LOG_PREFIX, "Google Analytics disabled and its cookies removed.");
  }

  function deleteAnalyticsCookies() {
    const names = document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0].trim())
      .filter((name) => name === "_ga" || name.startsWith("_ga_"));
    const domains = ["", location.hostname, `.${location.hostname.replace(/^www\./, "")}`];
    for (const name of names) {
      for (const domain of domains) {
        const domainPart = domain ? `; domain=${domain}` : "";
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
      }
    }
  }

  // ---------- Banner ----------

  function pageText() {
    return document.documentElement.lang.toLowerCase().startsWith("en") ? TEXT.en : TEXT.nb;
  }

  function injectStyles() {
    if (document.getElementById(`${BANNER_ID}-styles`)) return;
    const style = document.createElement("style");
    style.id = `${BANNER_ID}-styles`;
    // Own colour tokens, matching the site's light and dark themes, so the banner also works on game pages.
    style.textContent = `
      #${BANNER_ID} {
        --cb-bg: #ffffff; --cb-text: #141b22; --cb-line: #6f7c88; --cb-accent: #4c49c8; --cb-on-accent: #ffffff;
        position: fixed; z-index: 2147483000; left: 16px; right: 16px; bottom: 16px;
        max-width: 640px; margin-inline: auto; padding: 16px 18px;
        display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px;
        background: var(--cb-bg); color: var(--cb-text);
        border: 1.5px solid var(--cb-line); border-radius: 12px; box-shadow: 6px 6px 0 var(--cb-accent);
        font: 400 14.5px/1.5 "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-mode="light"]) #${BANNER_ID} { --cb-bg: #161d25; --cb-text: #e9eef3; --cb-line: #7d8a96; --cb-accent: #a3a5ff; --cb-on-accent: #0f1419; }
      }
      :root[data-mode="dark"] #${BANNER_ID} { --cb-bg: #161d25; --cb-text: #e9eef3; --cb-line: #7d8a96; --cb-accent: #a3a5ff; --cb-on-accent: #0f1419; }
      #${BANNER_ID} p { margin: 0; flex: 1 1 280px; }
      #${BANNER_ID} .cb-actions { display: flex; gap: 10px; }
      #${BANNER_ID} button {
        font: 600 14px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace;
        padding: 8px 16px; border-radius: 8px; border: 1.5px solid var(--cb-accent); cursor: pointer;
        background: transparent; color: var(--cb-text);
      }
      #${BANNER_ID} button[data-choice="${CONSENT.granted}"] { background: var(--cb-accent); color: var(--cb-on-accent); }
      #${BANNER_ID} button:focus-visible { outline: 3px solid var(--cb-accent); outline-offset: 2px; }
    `;
    document.head.appendChild(style);
  }

  function createButton(label, choice) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.choice = choice;
    button.addEventListener("click", () => applyChoice(choice));
    return button;
  }

  function showBanner() {
    if (document.getElementById(BANNER_ID)) return;
    const text = pageText();
    injectStyles();

    const banner = document.createElement("section");
    banner.id = BANNER_ID;
    banner.setAttribute("aria-label", text.label);

    const message = document.createElement("p");
    message.textContent = text.message;

    const actions = document.createElement("div");
    actions.className = "cb-actions";
    // Decline and accept look equally easy to choose, as Norwegian rules require.
    actions.append(createButton(text.decline, CONSENT.denied), createButton(text.accept, CONSENT.granted));

    banner.append(message, actions);
    document.body.appendChild(banner);
  }

  function hideBanner() {
    document.getElementById(BANNER_ID)?.remove();
  }

  function applyChoice(choice) {
    saveConsent(choice);
    hideBanner();
    if (choice === CONSENT.granted) {
      loadGoogleAnalytics();
    } else if (analyticsLoaded || document.cookie.includes("_ga")) {
      stopGoogleAnalytics();
    }
  }

  // ---------- Start ----------

  function start() {
    // Event delegation: works for links/buttons rendered by React or plain HTML alike.
    document.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element ? event.target.closest("[data-cookie-settings]") : null;
      if (!trigger) return;
      event.preventDefault();
      showBanner();
    });

    const consent = readConsent();
    if (consent === CONSENT.granted) loadGoogleAnalytics();
    else if (consent === "") showBanner();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
