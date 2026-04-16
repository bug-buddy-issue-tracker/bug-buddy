"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Fragment } from "react";

import { SplitText } from "./split-text";

const DELAY_CHILDREN = 0.1;
const STAGGER_CHILDREN = 0.06;

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: DELAY_CHILDREN,
    },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 20, stiffness: 100 },
  },
};

interface AnimatedTextProps {
  text: string;
  highlightWords?: string[];
  className?: string;
}

export function AnimatedText({
  text,
  highlightWords = [],
  className,
}: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <motion.h1
      className={cn(
        "text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
        className,
      )}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.some((hw) =>
          word.toLowerCase().startsWith(hw.toLowerCase()),
        );

        if (isHighlight) {
          const wordDelay = DELAY_CHILDREN + i * STAGGER_CHILDREN;
          return (
            <Fragment key={`${word}-${i}`}>
              <SplitText
                text={word}
                tag="span"
                className="text-primary"
                splitType="chars"
                delay={30}
                duration={0.5}
                ease="power3.out"
                from={{ opacity: 0, y: 24 }}
                to={{ opacity: 1, y: 0, delay: wordDelay }}
                threshold={0}
                rootMargin="0px"
                textAlign="left"
              />
              {i < words.length - 1 ? "\u00A0" : null}
            </Fragment>
          );
        }

        return (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariant}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
