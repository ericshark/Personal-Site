import { ScrollProgress as GradientProgress } from "@/components/motion-primitives/scroll-progress";

/** Thin bar across the top of the viewport that fills as the page scrolls, fading in from the left. */
export default function ScrollProgress() {
  return (
    <div aria-hidden="true">
      <GradientProgress
        className="fixed z-[60] h-0.5 bg-[linear-gradient(to_right,rgba(0,0,0,0),#111111_75%,#111111_100%)]"
        springOptions={{ stiffness: 120, damping: 30 }}
      />
    </div>
  );
}
