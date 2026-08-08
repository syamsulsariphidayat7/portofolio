"use client";

import {
  motion,
  useInView,
  useTransform,
  motionValue,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const STATIC = motionValue(0);

interface SkillBarProps {
  name: string;
  level: number;
  index: number;
  /** Mode scrub: isi bar mengikuti progress scroll (0–1) dengan stagger per bar */
  progress?: MotionValue<number>;
  total?: number;
}

export function SkillBar({ name, level, index, progress, total = 1 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  /* Mode scrub: tiap bar mengisi pada jendela scroll-nya sendiri.
     Output string persen (unit sederhana, aman di Motion 12) agar
     style width mengikuti skala track, bukan piksel. */
  const local = useTransform(progress ?? STATIC, [index / total, (index + 1) / total], [0, 1]);
  const width = useTransform(local, [0, 1], ["0%", `${level}%`]);

  return (
    <div ref={ref} className="group space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
          <span className="font-mono text-primary-500">▸</span>
          {name}
        </span>
        <span className="font-mono text-xs font-medium text-primary-600 dark:text-primary-400">
          [{level}%]
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/70 dark:bg-slate-800/70 dark:ring-slate-700/50">
        <motion.div
          initial={progress ? undefined : { width: 0 }}
          animate={progress ? undefined : (isInView ? { width: `${level}%` } : { width: 0 })}
          transition={{ duration: 0.9, delay: index * 0.06, ease: "easeOut" }}
          style={progress ? { width } : undefined}
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary-600 via-teal-400 to-primary-500 transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(20,184,166,0.5)]"
        >
          <span className="shimmer" />
        </motion.div>
        {/* Tick marks di atas track (terlihat juga di area terisi) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_9px,rgba(255,255,255,0.25)_9px,rgba(255,255,255,0.25)_10px)] dark:bg-[repeating-linear-gradient(90deg,transparent_0,transparent_9px,rgba(2,6,23,0.25)_9px,rgba(2,6,23,0.25)_10px)]"
        />
      </div>
    </div>
  );
}
