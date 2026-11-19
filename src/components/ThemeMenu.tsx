"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";
import { THEMES, type ThemeId } from "@/themes/registry";
import { setTheme, useThemeId } from "@/themes/use-theme";

/**
 * The palette button and its theme menu. Each option previews its theme in a
 * swatch that carries `data-theme`, so the swatch renders in that theme's own
 * tokens and fonts.
 */
export default function ThemeMenu() {
  const active = useThemeId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const activeIndex = Math.max(
    0,
    THEMES.findIndex((theme) => theme.id === active),
  );

  function close({ restoreFocus }: { restoreFocus: boolean }) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function focusOption(index: number) {
    const count = THEMES.length;
    optionRefs.current[((index % count) + count) % count]?.focus();
  }

  // Focus the checked option when the menu opens.
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
    // Only on open; arrow keys move focus afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on a pointer press outside the menu.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function select(id: ThemeId, event: React.MouseEvent) {
    const rect = triggerRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    // Keyboard activation (Enter/Space) fires a click with detail 0. Only then is
    // focus handed back to the trigger, so a mouse pick doesn't leave a focus ring.
    close({ restoreFocus: event.detail === 0 });
    setTheme(id, origin);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onMenuKeyDown(event: React.KeyboardEvent) {
    const current = optionRefs.current.findIndex(
      (option) => option === document.activeElement,
    );
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(THEMES.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        close({ restoreFocus: true });
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
        data-ui="theme-trigger"
        className="action-quiet size-11 shrink-0 p-0 text-neutral-500"
      >
        <Palette size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Theme"
            data-ui="theme-menu"
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: -4,
              transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
            }}
            className="absolute right-0 top-full z-[70] mt-2 w-72 max-w-[calc(100vw-32px)] origin-top-right rounded-[var(--radius-panel)] border border-neutral-200 bg-paper p-1.5 text-ink shadow-xl shadow-black/10"
          >
            <p
              aria-hidden="true"
              className="px-2 pb-1.5 pt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500"
            >
              Theme
            </p>
            {THEMES.map((theme, index) => {
              const checked = theme.id === active;
              return (
                <button
                  key={theme.id}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={checked}
                  tabIndex={-1}
                  onClick={(event) => select(theme.id, event)}
                  className="mx-0 flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-offset-0"
                >
                  <span
                    data-theme={theme.id}
                    aria-hidden="true"
                    className="relative flex h-9 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[5px] border border-neutral-200 bg-paper font-display text-sm font-medium text-ink"
                  >
                    Aa
                    <span className="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug">
                      {theme.label}
                    </span>
                    <span className="block truncate text-xs leading-snug text-neutral-500">
                      {theme.description}
                    </span>
                  </span>
                  <Check
                    size={14}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className={`shrink-0 ${checked ? "text-ink" : "invisible"}`}
                  />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
