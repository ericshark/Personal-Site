export const THEME_STORAGE_KEY = "theme";

/** Page background per theme; mirrors --paper in globals.css for the browser chrome color. */
export const themeColors = {
  light: "#fafaf9",
  dark: "#0c0c0d",
} as const;

/**
 * Runs in <head> before first paint so a saved dark preference doesn't flash light.
 * Light is the default; the system color scheme is intentionally ignored.
 */
export const themeInitScript = `try{if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="dark"){document.documentElement.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",${JSON.stringify(themeColors.dark)})}}catch(e){}`;
