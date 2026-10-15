import { InView } from "@/components/motion-primitives/in-view";

/**
 * Reveal complete blocks near viewport entry so animation never gates reading.
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
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      viewOptions={{ margin: "0px 0px -48px 0px" }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
      once
    >
      <div className={className}>{children}</div>
    </InView>
  );
}
