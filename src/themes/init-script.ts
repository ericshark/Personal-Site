import {
  DEFAULT_THEME,
  LEGACY_THEMES,
  THEME_STORAGE_KEY,
  THEMES,
} from "@/themes/registry";

// id -> [isDark, themeColor], generated from the registry so new themes need no edits here.
const config = Object.fromEntries(
  THEMES.map((theme) => [
    theme.id,
    [theme.scheme === "dark" ? 1 : 0, theme.themeColor],
  ]),
);

/**
 * Runs in <head> before first paint so a saved theme doesn't flash the default.
 * The server always renders data-theme="light"; unknown stored values are ignored,
 * and ids of removed themes (LEGACY_THEMES) open their replacement and are re-saved.
 * The system color scheme is intentionally ignored.
 */
export const themeInitScript = `try{var c=${JSON.stringify(config)},l=${JSON.stringify(LEGACY_THEMES)},k=${JSON.stringify(THEME_STORAGE_KEY)},h=Object.prototype.hasOwnProperty,t=localStorage.getItem(k);if(t&&h.call(l,t)){t=l[t];localStorage.setItem(k,t)}if(t&&t!==${JSON.stringify(DEFAULT_THEME)}&&h.call(c,t)){var d=document.documentElement;d.setAttribute("data-theme",t);if(c[t][0])d.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",c[t][1])}}catch(e){}`;
