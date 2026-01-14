import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";

// --- Language routing (path-based + browser language; first-visit only) ---
const SUPPORTED = ["ko", "en", "ja", "zh", "th"] as const;
type Lang = (typeof SUPPORTED)[number];

const DEFAULT_LANG: Lang = "ko";
const LS_KEY = "lang_pref";

function getLangFromPath(): Lang | null {
  const seg = window.location.pathname.split("/")[1];
  return (SUPPORTED as readonly string[]).includes(seg) ? (seg as Lang) : null;
}

function mapBrowserToSupported(): Lang {
  const raw = (navigator.language || "").toLowerCase(); // e.g. "en-US"
  const base = raw.split("-")[0];

  return (SUPPORTED as readonly string[]).includes(base)
    ? (base as Lang)
    : DEFAULT_LANG;
}

/**
 * First-visit only:
 * - If user already on /en /ja /zh /th: do nothing
 * - If user previously chose a language (localStorage): do nothing
 * - Else: redirect based on browser language (if not default)
 */
function autoRouteByBrowserLangOnce() {
  // Already on /en, /ja, /zh, /th (or /ko if you ever use it)
  if (getLangFromPath()) return;

  // Respect user's explicit choice
  const saved = localStorage.getItem(LS_KEY);
  if (saved && (SUPPORTED as readonly string[]).includes(saved)) return;

  // First visit: route by browser language
  const target = mapBrowserToSupported();
  if (target === DEFAULT_LANG) return;

  window.location.replace(`/${target}`);
}

autoRouteByBrowserLangOnce();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <App />
    </HeroUIProvider>
  </StrictMode>
);
