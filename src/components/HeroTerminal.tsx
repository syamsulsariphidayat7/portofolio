"use client";

import { useEffect, useRef, useState } from "react";

type Seg = { t: string; c: string };
type Line = { segs: Seg[]; speed?: number; pause?: number };

/* Sesi terminal: perintah + output yang "diketik" oleh mesin */
const SCRIPT: Line[] = [
  {
    segs: [
      { t: "$ ", c: "text-primary-600 dark:text-primary-400" },
      { t: "whoami", c: "text-slate-700 dark:text-slate-200" },
    ],
    pause: 500,
  },
  {
    segs: [{ t: "> syamsul — full-stack developer", c: "text-slate-500 dark:text-slate-400" }],
    speed: 14,
    pause: 380,
  },
  {
    segs: [
      { t: "$ ", c: "text-primary-600 dark:text-primary-400" },
      { t: "cat ", c: "text-slate-700 dark:text-slate-200" },
      { t: "dev.ts", c: "text-sky-600 dark:text-sky-400" },
    ],
    pause: 500,
  },
  {
    segs: [
      { t: "const ", c: "text-purple-600 dark:text-purple-400" },
      { t: "dev", c: "text-sky-600 dark:text-sky-400" },
      { t: " = {", c: "text-slate-700 dark:text-slate-200" },
    ],
    pause: 220,
  },
  {
    segs: [
      { t: "  name: ", c: "text-purple-600 dark:text-purple-400" },
      { t: '"Syamsul"', c: "text-emerald-600 dark:text-emerald-400" },
      { t: ",", c: "text-slate-700 dark:text-slate-200" },
    ],
    pause: 220,
  },
  {
    segs: [
      { t: "  stack: [", c: "text-slate-700 dark:text-slate-200" },
      { t: '"Next.js"', c: "text-emerald-600 dark:text-emerald-400" },
      { t: ", ", c: "text-slate-700 dark:text-slate-200" },
      { t: '"TS"', c: "text-emerald-600 dark:text-emerald-400" },
      { t: "]", c: "text-slate-700 dark:text-slate-200" },
    ],
    pause: 220,
  },
  {
    segs: [
      { t: "  hireable: ", c: "text-purple-600 dark:text-purple-400" },
      { t: "true", c: "text-amber-600 dark:text-amber-400" },
      { t: ",", c: "text-slate-700 dark:text-slate-200" },
    ],
    pause: 220,
  },
  {
    segs: [{ t: "};", c: "text-slate-700 dark:text-slate-200" }],
    pause: 320,
  },
  {
    segs: [
      { t: "$ ", c: "text-primary-600 dark:text-primary-400" },
      { t: "npm run deploy", c: "text-slate-700 dark:text-slate-200" },
    ],
    pause: 650,
  },
  {
    segs: [
      { t: "✓ build ok", c: "text-emerald-600 dark:text-emerald-400" },
      { t: " · 0 errors · ", c: "text-slate-500 dark:text-slate-400" },
      { t: "12.4s", c: "text-sky-600 dark:text-sky-400" },
    ],
    speed: 16,
    pause: 420,
  },
  {
    segs: [
      { t: "✓ live → ", c: "text-emerald-600 dark:text-emerald-400" },
      { t: "boundless.my.id", c: "text-primary-600 dark:text-primary-400" },
    ],
    speed: 16,
    pause: 3400,
  },
];

const lineLen = (i: number) => SCRIPT[i].segs.reduce((n, s) => n + s.t.length, 0);

/**
 * HeroTerminal — jendela terminal yang mengetik sesi kode sendiri secara
 * berulang. Berhenti saat keluar layar, dan untuk prefers-reduced-motion
 * langsung menampilkan hasil akhir (tanpa animasi).
 */
export function HeroTerminal({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const [active, setActive] = useState(true);
  const [line, setLine] = useState(0);
  const [char, setChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* Pause saat terminal keluar dari layar */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Mesin mengetik: state → timeout berikutnya */
  useEffect(() => {
    if (reduce || !active) return;

    if (done) {
      const t = setTimeout(() => {
        setLine(0);
        setChar(0);
        setDone(false);
      }, SCRIPT[SCRIPT.length - 1].pause ?? 3000);
      return () => clearTimeout(t);
    }

    if (char < lineLen(line)) {
      const t = setTimeout(() => setChar(char + 1), SCRIPT[line].speed ?? 26);
      return () => clearTimeout(t);
    }

    if (line < SCRIPT.length - 1) {
      const t = setTimeout(() => {
        setLine(line + 1);
        setChar(0);
      }, SCRIPT[line].pause ?? 300);
      return () => clearTimeout(t);
    }

    setDone(true);
  }, [line, char, done, active, reduce]);

  const showAll = reduce || done;

  return (
    <div ref={rootRef} aria-hidden="true" className={className}>
      {/* Chrome jendela */}
      <div className="flex items-center gap-1.5 px-4 pb-0 pt-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 font-mono text-[10px] text-slate-400">developer.ts</span>
        <span className="ml-auto font-mono text-[10px] text-primary-500/70">● REC</span>
      </div>

      <pre className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-[11px] leading-relaxed">
        <code>
          {SCRIPT.map((ln, i) => {
            if (!showAll && i > line) return null;
            const isCurrent = !showAll && i === line;
            const limit = showAll ? Infinity : isCurrent ? char : Infinity;
            let remaining = limit;
            return (
              <span key={i} className="block">
                {ln.segs.map((s, si) => {
                  const take = Math.max(0, Math.min(s.t.length, remaining));
                  remaining -= take;
                  return take > 0 ? (
                    <span key={si} className={s.c}>
                      {s.t.slice(0, take)}
                    </span>
                  ) : null;
                })}
                {isCurrent && (
                  <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-primary-500" />
                )}
              </span>
            );
          })}
          {showAll && (
            <span className="block">
              <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-primary-500" />
            </span>
          )}
        </code>
      </pre>
    </div>
  );
}
