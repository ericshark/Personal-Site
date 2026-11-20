/**
 * The single list of site themes. The menu, the no-flash init script, the theme
 * hook and the tests all read from here; nothing else hardcodes theme ids.
 * Add a theme by adding an entry here plus its folder under src/themes/<id>/.
 */

export type ThemeId = "light" | "forma" | "observatory" | "playground";

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
    id: "forma",
    label: "Forma",
    description: "Obsidian, alabaster and liquid silver",
    scheme: "dark",
    themeColor: "#07080a",
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
];

export const DEFAULT_THEME: ThemeId = "light";

export const THEME_STORAGE_KEY = "theme";

/** Saved values from removed themes, mapped to the theme that replaced them. */
export const LEGACY_THEMES: Readonly<Record<string, ThemeId>> = {
  dark: "forma",
};

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
