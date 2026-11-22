"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Teks berjalan dengan kecepatan KONSTAN (32s, dari `.animate-marquee`
 * di globals.css). Dulu kecepatannya reaktif terhadap velocity scroll
 * (32s <-> 11s) dan band-nya parallax naik-turun saat scroll — terasa
 * seperti bug (tersentak tiap halaman digulir), jadi dicabut 22 Nov 2026
 * atas permintaan Syamsul: normal saja. Sisa efek: kemiringan 3D statis
 * + pause saat hover.
 */
export function Marquee({ items, className = "" }: MarqueeProps) {
  const doubled = [...items, ...items];
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`group relative select-none overflow-hidden border-y border-slate-200 bg-white/85 py-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 ${className}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-28 dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-28 dark:from-slate-950" />

      {/* Band miring 3D statis: perspektif membuat ticker seperti
          receding band. Tidak lagi digerakkan scroll. */}
      <motion.div
        style={{ rotateX: reduce ? 0 : 10, transformPerspective: 900 }}
        className="relative"
      >
        <div className="animate-marquee flex w-max items-center gap-10 group-hover:[animation-play-state:paused]">
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
