"use client";

import { CircleDot, Globe, ImageIcon, Monitor } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const item = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export function GitHubIssueMock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-xl border border-border/50 bg-card"
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <div className="size-3 rounded-full bg-red-500/70" />
        <div className="size-3 rounded-full bg-yellow-500/70" />
        <div className="size-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-muted-foreground">GitHub Issue</span>
      </div>

      <motion.div
        className="space-y-4 p-5"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 1.0 },
          },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Issue status + title */}
        <motion.div variants={item} className="flex items-start gap-3">
          <CircleDot className="mt-0.5 size-5 shrink-0 text-green-500" />
          <div>
            <p className="font-semibold leading-tight">
              Checkout button overlaps on mobile
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              #142 opened just now by{" "}
              <span className="text-foreground">bug-buddy[bot]</span>
            </p>
          </div>
        </motion.div>

        {/* Labels */}
        <motion.div variants={item} className="flex gap-2">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            bug
          </span>
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-500">
            from-widget
          </span>
        </motion.div>

        {/* Screenshot placeholder */}
        <motion.div
          variants={item}
          className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30"
        >
          <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
            <ImageIcon className="size-6" />
            <span className="text-xs">screenshot.png</span>
          </div>
        </motion.div>

        {/* Metadata */}
        <motion.div
          variants={item}
          className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <Globe className="size-3" />
            /checkout
          </span>
          <span className="flex items-center gap-1.5">
            <Monitor className="size-3" />
            iPhone 14 &middot; Safari 17
          </span>
        </motion.div>

        {/* Annotation note */}
        <motion.div
          variants={item}
          className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs"
        >
          <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            1
          </span>
          <span className="text-muted-foreground">
            &ldquo;This button is hidden behind the footer on small
            screens&rdquo;
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
