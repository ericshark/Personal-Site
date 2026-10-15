import { ScrollProgress as GradientProgress } from "@/components/motion-primitives/scroll-progress";

/** Thin bar across the top of the viewport that fills as the page scrolls, fading in from the left. */
export default function ScrollProgress() {
  return (
    <div aria-hidden="true">
      <GradientProgress
        className="fixed z-[60] h-0.5 bg-gradient-to-r from-transparent via-ink via-75% to-ink"
        springOptions={{ stiffness: 120, damping: 30 }}
      />
    </div>
  );
}
