"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY, themeColors } from "@/lib/theme";

export default function ThemeToggle() {
  // The server can't know the saved theme, so the icon swap is CSS-driven and
  // aria-pressed syncs from the class set by the inline head script after mount.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        nextIsDark ? themeColors.dark : themeColors.light,
      );
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
    setIsDark(nextIsDark);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={isDark}
      className="action-quiet size-11 shrink-0 p-0 text-neutral-500"
    >
      <Moon
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="dark:hidden"
      />
      <Sun
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="hidden dark:block"
      />
    </button>
  );
}
