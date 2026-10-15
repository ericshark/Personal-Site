import { InView } from "@/components/motion-primitives/in-view";

/**
 * Blur-and-fade-up as content scrolls into view (motion-primitives InView, "Basic" example).
 * Plays regardless of prefers-reduced-motion (see CLAUDE.md).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      viewOptions={{ margin: "0px 0px -200px 0px" }}
      transition={{ duration: 0.3, ease: "easeInOut", delay }}
      once
    >
      <div className={className}>{children}</div>
    </InView>
  );
}
