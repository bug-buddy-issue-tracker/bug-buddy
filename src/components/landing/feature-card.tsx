"use client";

import { cn } from "@/lib/utils";
import { Camera, CheckCircle2, Code, GitBranch, Users } from "lucide-react";
import { motion } from "motion/react";

const iconMap = {
  camera: Camera,
  "git-branch": GitBranch,
  "check-circle-2": CheckCircle2,
  code: Code,
  users: Users,
} as const;

export type FeatureCardIcon = keyof typeof iconMap;

const entrances: Record<
  number,
  { x?: number; y?: number; rotate?: number; scale?: number }
> = {
  0: { x: -40, y: 20 },
  1: { y: 40 },
  2: { x: 40, y: 20 },
  3: { x: -30, y: 20, rotate: -3 },
  4: { y: 30, scale: 0.9 },
};

interface FeatureCardProps {
  icon: FeatureCardIcon;
  title: string;
  description: string;
  index: number;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  index,
  className,
}: FeatureCardProps) {
  const Icon = iconMap[icon];
  const entrance = entrances[index % 5] ?? { y: 30 };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: entrance.x ?? 0,
        y: entrance.y ?? 0,
        rotate: entrance.rotate ?? 0,
        scale: entrance.scale ?? 1,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
        delay: index * 0.08,
      }}
      whileHover={{
        y: -4,
        transition: { type: "spring", damping: 20, stiffness: 300 },
      }}
      className={cn(
        "glow-border group rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-primary/20 hover:bg-accent/30",
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          damping: 12,
          stiffness: 200,
          delay: 0.2 + index * 0.08,
        }}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
      >
        <Icon className="size-5" />
      </motion.div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
