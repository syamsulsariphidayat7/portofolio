"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

interface MarqueeProps {
  items: string[];
  className?: string;
}

const IDLE_DURATION = 32;
const FAST_DURATION = 11;

export function Marquee({ items, className = "" }: MarqueeProps) {
  const doubled = [...items, ...items];
  const reduce = useReducedMotion();

  /* Kecepatan marquee ikut kecepatan scroll (reactif, lalu kembali pelan) */
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const velocity = useSpring(rawVelocity, { stiffness: 140, damping: 32 });
  const duration = useTransform(velocity, [-1400, 0, 1400], [FAST_DURATION, IDLE_DURATION, FAST_DURATION]);

  const [dur, setDur] = useState(IDLE_DURATION);
  useMotionValueEvent(duration, "change", (v) => setDur(Math.round(v)));

  /* Parallax scroll: band melayang naik-turun saat melewati viewport */
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ["start end", "end start"],
  });
  const bandY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const bandSpring = useSpring(bandY, { stiffness: 120, damping: 26, mass: 0.4 });

  return (
    <div
      ref={marqueeRef}
      aria-hidden="true"
      className={`group relative select-none overflow-hidden border-y border-slate-200 bg-white/85 py-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 ${className}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-28 dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-28 dark:from-slate-950" />

      {/* Band miring 3D + parallax scroll: perspektif membuat ticker seperti
          receding band, naik-turun halus saat halaman digulir */}
      <motion.div
        style={{ rotateX: reduce ? 0 : 10, y: reduce ? 0 : bandSpring, transformPerspective: 900 }}
        className="relative"
      >
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
              <span className="font-mono text-[10px] text-primary-500/70">{"//"}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
