"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const SECTIONS = [
  { id: "start", label: "START", num: "01" },
  { id: "work", label: "KARYA", num: "02" },
  { id: "services", label: "LAYANAN", num: "03" },
  { id: "about", label: "TENTANG", num: "04" },
  { id: "stats", label: "DATA", num: "05" },
  { id: "contact", label: "KONTAK", num: "06" },
];

/**
 * Minimap section ala HUD di tepi kanan (desktop): nomor + label section aktif,
 * hover memperluas label, klik smooth-scroll via Lenis (anchor #...).
 */
export function SectionNav() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        setActive(top.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (reduce) return null;

  return (
    <nav
      aria-label="Navigasi section"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2.5 py-0.5"
          >
            <span
              className={`font-mono text-[10px] tracking-widest transition-all duration-300 ${
                isActive
                  ? "text-primary-500 opacity-100"
                  : "text-slate-400 opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.num}
            </span>
            <span
              className={`font-mono text-[10px] tracking-[0.25em] transition-all duration-300 ${
                isActive
                  ? "text-primary-500 opacity-100"
                  : "text-slate-400/80 opacity-0 group-hover:text-slate-500 group-hover:opacity-100 dark:group-hover:text-slate-300"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                isActive
                  ? "w-8 bg-primary-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                  : "w-5 bg-slate-300 group-hover:w-8 group-hover:bg-slate-400 dark:bg-slate-700"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
