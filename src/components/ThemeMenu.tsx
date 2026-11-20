"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";
import { THEMES, getTheme, type ThemeId } from "@/themes/registry";
import { setTheme, useThemeId } from "@/themes/use-theme";

/**
 * Theme previews: the homepage hero in each theme, from
 * `npm run screenshots -- --themes`. The size matches THEME_PREVIEW in
 * scripts/capture-projects.mjs.
 */
const THEME_PREVIEW = { width: 640, height: 400 };
const previewSrc = (id: ThemeId, ext: "avif" | "webp") =>
  `/themes/${id}.${ext}`;

/** Cards per row in the menu grid; arrow keys move across and down it. */
const COLUMNS = 2;

let previewsWarmed = false;

/** Starts fetching the previews before the menu opens (on trigger hover or focus). */
function warmPreviews() {
  if (previewsWarmed) return;
  previewsWarmed = true;
  for (const theme of THEMES) {
    const image = new Image();
    image.src = previewSrc(theme.id, "avif");
  }
}

/**
 * The palette button and its theme menu: a grid of cards, each showing a
 * screenshot of the site in that theme. Each card's caption carries
 * `data-theme`, so it renders in that theme's own colors and fonts.
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
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: COLUMNS,
      ArrowUp: -COLUMNS,
    };
    if (event.key in moves) {
      event.preventDefault();
      focusOption(current + moves[event.key]);
      return;
    }
    switch (event.key) {
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
        onPointerEnter={warmPreviews}
        onFocus={warmPreviews}
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
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: -6,
              transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] },
            }}
            className="absolute right-0 top-full z-[70] mt-2 w-[30rem] max-w-[calc(100vw-48px)] origin-top-right rounded-[var(--radius-panel)] border border-neutral-200 bg-paper p-2.5 text-ink shadow-2xl shadow-black/15 sm:p-3"
          >
            <div
              aria-hidden="true"
              className="flex items-baseline justify-between gap-3 px-1 pb-2.5 pt-0.5"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                Theme
              </span>
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-700">
                {getTheme(active).label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {THEMES.map((theme, index) => {
                const checked = theme.id === active;
                return (
                  <motion.button
                    key={theme.id}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    role="menuitemradio"
                    aria-checked={checked}
                    tabIndex={-1}
                    onClick={(event) => select(theme.id, event)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.28,
                        delay: 0.04 + index * 0.035,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    data-ui="theme-option"
                    className={`group relative m-0 flex p-0 min-w-0 flex-col overflow-hidden rounded-[10px] border text-left outline-none transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                      checked
                        ? "border-accent ring-1 ring-accent"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="relative block aspect-[16/10] overflow-hidden bg-neutral-100"
                    >
                      <picture>
                        <source
                          srcSet={previewSrc(theme.id, "avif")}
                          type="image/avif"
                        />
                        <img
                          src={previewSrc(theme.id, "webp")}
                          alt=""
                          width={THEME_PREVIEW.width}
                          height={THEME_PREVIEW.height}
                          decoding="async"
                          draggable={false}
                          className="size-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                      </picture>
                      <AnimatePresence>
                        {checked && (
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-paper shadow-md shadow-black/20"
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    {/* The caption renders in the card's own theme. */}
                    <span
                      data-theme={theme.id}
                      className="block flex-1 border-t border-neutral-200 bg-paper px-2.5 py-2 text-ink sm:px-3 sm:py-2.5"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rounded-full bg-accent"
                        />
                        <span
                          className={`truncate font-display text-sm leading-snug ${
                            checked ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {theme.label}
                        </span>
                      </span>
                      <span className="mt-0.5 hidden text-pretty text-xs leading-snug text-neutral-500 sm:block">
                        {theme.description}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
