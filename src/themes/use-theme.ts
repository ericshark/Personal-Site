"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  getTheme,
  isThemeId,
  type ThemeId,
} from "@/themes/registry";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeId {
  const value = document.documentElement.dataset.theme;
  return isThemeId(value) ? value : DEFAULT_THEME;
}

function getServerSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

/**
 * The active theme. Server and hydration render agree on the default; components
 * update right after hydration (when a saved theme differs) and on every switch.
 */
export function useThemeId(): ThemeId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Points the browser chrome color at the active theme. Next can render a second
 * theme-color tag after hydration, so every copy is updated.
 */
export function syncThemeColor(id: ThemeId) {
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", getTheme(id).themeColor);
  }
}

const ENTERING_CLASS = "theme-entering";
let enteringTimer: number | undefined;

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  root.dataset.theme = id;
  root.classList.toggle("dark", getTheme(id).scheme === "dark");
  syncThemeColor(id);
  // Lets a theme play a one-shot "enter" effect on content already on screen.
  root.classList.add(ENTERING_CLASS);
  window.clearTimeout(enteringTimer);
  enteringTimer = window.setTimeout(
    () => root.classList.remove(ENTERING_CLASS),
    900,
  );
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Storage can be blocked; the theme still applies for this visit.
  }
}

/**
 * Switches the whole site to `id`. With View Transitions support, the new theme
 * spreads out in a circle from `origin` (the palette button's center).
 */
export function setTheme(id: ThemeId, origin?: { x: number; y: number }) {
  if (document.documentElement.dataset.theme === id) return;
  if (!origin || typeof document.startViewTransition !== "function") {
    applyTheme(id);
    return;
  }

  const transition = document.startViewTransition(() => applyTheme(id));
  transition.ready
    .then(() => {
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      // A skipped transition still applied the theme.
    });
}
