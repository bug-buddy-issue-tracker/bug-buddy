"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation runs (for stagger) */
  delay?: number;
  /** Distance to translate from (default 12) */
  y?: number;
  /** Transition duration in ms (default 700) */
  duration?: number;
  /** Root margin for Intersection Observer (default "0px 0px -60px 0px") */
  rootMargin?: string;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 12,
  duration = 700,
  rootMargin = "0px 0px -60px 0px",
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transitionDuration: `${duration}ms`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
