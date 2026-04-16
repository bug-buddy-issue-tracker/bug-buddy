"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  className?: string;
}

function CounterNumber({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 80 });
  const display = useTransform(
    spring,
    (v) => `${prefix}${Math.round(v)}${suffix}`,
  );
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, motionValue, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function AnimatedCounter({
  value,
  suffix,
  prefix,
  label,
  description,
  className,
}: AnimatedCounterProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        <CounterNumber value={value} suffix={suffix} prefix={prefix} />
      </div>
      <p className="mt-2 font-semibold">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
