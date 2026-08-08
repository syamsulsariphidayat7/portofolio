"use client";

import { useState } from "react";
import {
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

interface MarqueeProps {
  items: string[];
  className?: string;
}

const IDLE_DURATION = 32;
const FAST_DURATION = 11;

export function Marquee({ items, className = "" }: MarqueeProps) {
  const doubled = [...items, ...items];

  /* Kecepatan marquee ikut kecepatan scroll (reactif, lalu kembali pelan) */
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const velocity = useSpring(rawVelocity, { stiffness: 140, damping: 32 });
  const duration = useTransform(velocity, [-1400, 0, 1400], [FAST_DURATION, IDLE_DURATION, FAST_DURATION]);

  const [dur, setDur] = useState(IDLE_DURATION);
  useMotionValueEvent(duration, "change", (v) => setDur(Math.round(v)));

  return (
    <div
      aria-hidden="true"
      className={`group relative select-none overflow-hidden border-y border-slate-200 bg-white/85 py-5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 ${className}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-28 dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-28 dark:from-slate-950" />
      <div
        className="animate-marquee flex w-max items-center gap-10 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${dur}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`font-mono text-sm font-medium tracking-wider text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 ${
                item.startsWith("0x") ? "text-primary-500/80" : "uppercase"
              }`}
            >
              {item}
            </span>
            <span className="font-mono text-[10px] text-primary-500/70">//</span>
          </span>
        ))}
      </div>
    </div>
  );
}
