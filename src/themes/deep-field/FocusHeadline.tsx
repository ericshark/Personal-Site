"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import type { HeadlineProps } from "@/themes/client";

/**
 * The default word rise (see SplitWords), with each word also sharpening out of
 * a blur, like an image coming into focus. Screen readers get the full sentence.
 */
export default function FocusHeadline({ text, delay = 0 }: HeadlineProps) {
  const words = text.split(" ");
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "110%", filter: "blur(6px)", opacity: 0.4 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: delay + i * 0.04,
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
