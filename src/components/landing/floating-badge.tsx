"use client";

import { Camera, GitBranch, MapPin, Monitor } from "lucide-react";
import { motion } from "motion/react";

const iconMap = {
  camera: Camera,
  "map-pin": MapPin,
  "git-branch": GitBranch,
  monitor: Monitor,
} as const;

export type FloatingBadgeIcon = keyof typeof iconMap;

interface FloatingBadgeProps {
  icon: FloatingBadgeIcon;
  label: string;
  delay?: number;
  x?: number;
  y?: number;
}

export function FloatingBadge({
  icon,
  label,
  delay = 0,
  x = 0,
  y = 0,
}: FloatingBadgeProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 1.0 + delay,
        type: "spring",
        damping: 15,
        stiffness: 100,
      }}
      className="absolute hidden lg:flex"
      style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
      >
        <Icon className="size-3.5 text-primary" />
        {label}
      </motion.div>
    </motion.div>
  );
}
