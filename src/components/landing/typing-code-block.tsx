"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const codeLines = [
  {
    tokens: [
      { text: "<", cls: "text-muted-foreground" },
      { text: "script", cls: "text-primary" },
    ],
  },
  {
    tokens: [
      { text: "  src", cls: "text-cyan-400" },
      { text: "=", cls: "text-muted-foreground" },
      { text: '"https://bugbuddy.dev/widget.js"', cls: "text-green-400" },
    ],
  },
  {
    tokens: [
      { text: "  data-project", cls: "text-cyan-400" },
      { text: "=", cls: "text-muted-foreground" },
      { text: '"your-project-key"', cls: "text-green-400" },
    ],
  },
  {
    tokens: [
      { text: "  data-theme", cls: "text-cyan-400" },
      { text: "=", cls: "text-muted-foreground" },
      { text: '"auto"', cls: "text-green-400" },
    ],
  },
  { tokens: [{ text: "  async", cls: "text-cyan-400" }] },
  {
    tokens: [
      { text: ">", cls: "text-muted-foreground" },
      { text: "</", cls: "text-muted-foreground" },
      { text: "script", cls: "text-primary" },
      { text: ">", cls: "text-muted-foreground" },
    ],
  },
];

const lineContainer = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: 0.8 + i * 0.25,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export function TypingCodeBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-xl border border-border/50 bg-card"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <div className="size-3 rounded-full bg-red-500/70" />
        <div className="size-3 rounded-full bg-yellow-500/70" />
        <div className="size-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-muted-foreground">index.html</span>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto p-4 font-mono text-xs leading-7 sm:p-5 sm:text-sm">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={lineContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="whitespace-pre"
          >
            <span className="mr-4 inline-block w-5 text-right text-muted-foreground/40 select-none">
              {i + 1}
            </span>
            {line.tokens.map((token, j) => (
              <span key={j} className={token.cls}>
                {token.text}
              </span>
            ))}
            {i === codeLines.length - 1 && isInView && (
              <span className="ml-0.5 inline-block w-2 bg-primary animate-blink">
                &nbsp;
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
