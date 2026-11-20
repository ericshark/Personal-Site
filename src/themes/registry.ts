/**
 * The single list of site themes. The menu, the no-flash init script, the theme
 * hook and the tests all read from here; nothing else hardcodes theme ids.
 * Add a theme by adding an entry here plus its folder under src/themes/<id>/.
 */

export type ThemeId =
  "light" | "dark" | "observatory" | "playground" | "deep-field" | "forma";

export type ThemeDefinition = {
  id: ThemeId;
  /** Menu label. */
  label: string;
  /** One line under the label in the menu. */
  description: string;
  /** Dark themes also get the `.dark` class so existing `dark:` utilities apply. */
  scheme: "light" | "dark";
  /** <meta name="theme-color"> while the theme is active. */
  themeColor: string;
};

/** Menu order. */
export const THEMES: readonly ThemeDefinition[] = [
  {
    id: "light",
    label: "Light",
    description: "Paper and ink, the default",
    scheme: "light",
    themeColor: "#fafaf9",
  },
  {
    id: "dark",
    label: "Dark",
    description: "The same site, after hours",
    scheme: "dark",
    themeColor: "#0c0c0d",
  },
  {
    id: "observatory",
    label: "Observatory",
    description: "Cyberpunk command HUD",
    scheme: "dark",
    themeColor: "#05040d",
  },
  {
    id: "playground",
    label: "Playground",
    description: "Interface studies, jellyfish and glyphs",
    scheme: "light",
    themeColor: "#ffffff",
  },
  {
    id: "deep-field",
    label: "Deep Field",
    description: "A quiet voyage through the stars",
    scheme: "dark",
    themeColor: "#020609",
  },
  {
    id: "forma",
    label: "Forma",
    description: "Obsidian, alabaster and liquid silver",
    scheme: "dark",
    themeColor: "#07080a",
  },
];

export const DEFAULT_THEME: ThemeId = "light";

export const THEME_STORAGE_KEY = "theme";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
