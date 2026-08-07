"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SkillBarProps {
  name: string;
  level: number;
  index: number;
}

export function SkillBar({ name, level, index }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="group space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary-500 to-teal-400" />
          {name}
        </span>
        <span className="font-mono text-xs font-medium text-primary-600 dark:text-primary-400">
          {level}%
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/70 dark:bg-slate-800/70 dark:ring-slate-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay: index * 0.06, ease: "easeOut" }}
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary-600 via-teal-400 to-primary-500 transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(20,184,166,0.5)]"
        >
          <span className="shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
