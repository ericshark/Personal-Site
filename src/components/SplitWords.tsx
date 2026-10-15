"use client";

import { Fragment, useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * Reveals text one word at a time, each rising out of a clipped line box.
 * Screen readers get the full sentence from visually hidden text, not the word fragments.
 */
export default function SplitWords({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Keep server and initial client markup identical; animate only after mount.
  const shouldAnimate = hasMounted;
  const words = text.split(" ");

  return (
    <span key={hasMounted ? "mounted" : "static"} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          // The space sits between the clipping boxes; inside an inline-block it would collapse.
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={shouldAnimate ? { y: "110%" } : false}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: delay + i * 0.035,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                {word}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}
