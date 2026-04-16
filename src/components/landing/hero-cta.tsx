"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { TextType } from "./text-type";

interface HeroCtaProps {
  isSignedIn: boolean;
  compact?: boolean;
  variant?: "header";
}

export function HeroCta({ isSignedIn, compact, variant }: HeroCtaProps) {
  if (variant === "header") {
    return (
      <Link
        href="/dashboard"
        className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Go to dashboard
      </Link>
    );
  }

  return (
    <div className={cn(!compact && "mt-10")}>
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8 min-h-16 text-lg text-muted-foreground sm:min-h-10 sm:text-xl"
        >
          <TextType
            text={[
              "Capture screenshots and annotate bugs.",
              "Turn user reports into GitHub issues.",
              "One script tag. Zero config.",
            ]}
            typingSpeed={50}
            deletingSpeed={25}
            pauseDuration={2000}
            showCursor
            cursorCharacter="|"
            cursorClassName="text-primary"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: compact ? 0.2 : 0.9,
          type: "spring",
          damping: 20,
          stiffness: 150,
        }}
        className={cn("flex items-center justify-center", compact && "mt-6")}
      >
        <Link href={isSignedIn ? "/dashboard" : "/signin"}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground"
          >
            {isSignedIn ? "Go to dashboard" : "Get started free"}
            <ArrowRight className="size-4" />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
