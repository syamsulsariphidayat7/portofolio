"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal } from "@/content/personal";
import { HologramGlobe } from "./HologramGlobe";
import { uiSound } from "@/lib/uiSound";

const BOOT_LINES = [
  "> init core modules ............... OK",
  "> load stack: next/react/ts ....... OK",
  "> establish secure link ........... OK",
  "> mount avatar.profile ............ OK",
  "> system online — welcome",
];

const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/**
 * LoadingScreen — boot hologram "pro": core globe wireframe berputar, ring
 * progress SVG mengelilinginya, persentase besar dengan easing, log boot,
 * sapuan scanline, dan penutup ala tirai sinema (dua panel membuka).
 */
export function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [visible, setVisible] = useState(0);
  const [progress, setProgress] = useState(0);
  /* Sinkron dengan modul uiSound — chip & toggle global berbagi status */
  const soundOn = useSyncExternalStore(
    uiSound.subscribe,
    uiSound.getEnabled,
    uiSound.getEnabled /* getServerSnapshot: modul statis → false di server */
  );
  const milestoneRef = useRef(25);
  const chimeRef = useRef(false);
  const unlockedOnceRef = useRef(false);

  /* Suara boot: aktifkan lewat gestur (chip) → sweep + tick tiap 25% + chime di 100% */
  const toggleSound = () => {
    if (uiSound.enabled) {
      uiSound.disable();
    } else {
      uiSound.enable();
      uiSound.bootSweep();
      /* Seed milestone ke nilai berikutnya agar tidak ada double-tick saat enable tengah jalan */
      milestoneRef.current = Math.max(25, Math.ceil(progress / 25) * 25);
    }
  };

  useEffect(() => {
    /* Tandai fase boot aktif → gestur pertama (unlock) memutar boot sweep */
    uiSound.setBootActive(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 1100 : 2350;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      const eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic: cepat di awal, halus di akhir */
      const pct = Math.round(eased * 100);
      setProgress(pct);
      /* Frame pertama setelah audio ter-unlock → seed milestone (cegah double-tick) */
      if (uiSound.isUnlocked() && !unlockedOnceRef.current) {
        unlockedOnceRef.current = true;
        milestoneRef.current = Math.max(25, Math.ceil(pct / 25) * 25);
      }
      /* Sinkron suara dengan progress — hanya bila audio sudah ter-unlock (autoplay) */
      if (uiSound.enabled && uiSound.isUnlocked()) {
        if (pct >= 100 && !chimeRef.current) {
          uiSound.chime();
          chimeRef.current = true;
        } else if (pct >= milestoneRef.current) {
          uiSound.tick();
          milestoneRef.current += 25;
        }
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const hide = setTimeout(() => setShow(false), total + 460);
    const interval = setInterval(
      () => setVisible((v) => Math.min(v + 1, BOOT_LINES.length)),
      reduce ? 90 : 200
    );
    return () => {
      uiSound.setBootActive(false);
      cancelAnimationFrame(raf);
      clearTimeout(hide);
      clearInterval(interval);
    };
  }, []);

  /* Ring progress SVG mengelilingi globe */
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - progress / 100);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Tirai atas & bawah — membuka saat loading selesai */}
          <motion.div
            key="curtain-top"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.75, ease: CURTAIN_EASE }}
            className="fixed inset-x-0 top-0 z-[100] h-1/2 bg-slate-950"
          />
          <motion.div
            key="curtain-bottom"
            exit={{ y: "100%" }}
            transition={{ duration: 0.75, ease: CURTAIN_EASE }}
            className="fixed inset-x-0 bottom-0 z-[100] h-1/2 bg-slate-950"
          />

          {/* Konten boot */}
          <motion.div
            key="content"
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="fixed inset-0 z-[101] flex items-center justify-center overflow-hidden bg-slate-950"
          >
            {/* Grid + glow sentral */}
            <div
              aria-hidden="true"
              className="cyber-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-3xl"
            />
            {/* Sapuan scanline */}
            <motion.div
              aria-hidden="true"
              animate={{ y: ["-12%", "112%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary-400/[0.06] to-transparent"
            />

            <div className="relative flex flex-col items-center">
              {/* Core: globe hologram + ring progress */}
              <div className="relative grid h-44 w-44 place-items-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-primary-500/5 blur-xl"
                />
                <HologramGlobe className="relative h-40 w-40" />
                <svg
                  aria-hidden="true"
                  className="absolute -inset-2 h-48 w-48 -rotate-90"
                  viewBox="0 0 130 130"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="boot-ring" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <circle cx="65" cy="65" r={R} stroke="rgba(45,212,191,0.14)" strokeWidth="1.5" />
                  <circle
                    cx="65"
                    cy="65"
                    r={R}
                    stroke="url(#boot-ring)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={offset}
                    style={{ filter: "drop-shadow(0 0 6px rgba(45,212,191,0.5))" }}
                  />
                </svg>
              </div>

              {/* Persentase besar */}
              <div className="mt-3 font-mono text-5xl font-black tabular-nums tracking-tight text-slate-100">
                {progress}
                <span className="text-primary-400">%</span>
              </div>

              {/* Log boot */}
              <div className="mt-4 min-h-[6.5rem] w-[min(88vw,380px)] font-mono text-[11px] leading-relaxed">
                {BOOT_LINES.slice(0, visible).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18 }}
                    className={i === BOOT_LINES.length - 1 ? "text-emerald-400" : "text-slate-400"}
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-primary-400"
                >
                  ▌
                </motion.span>
              </div>

              {/* Bar progress — lebar langsung dari state (sinkron dengan angka) */}
              <div className="mt-3 h-1 w-[min(88vw,380px)] overflow-hidden rounded-full bg-slate-800/80">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 via-teal-400 to-primary-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]"
                />
              </div>

              {/* Brand + versi */}
              <div className="mt-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-slate-500">
                <span className="h-px w-6 bg-gradient-to-r from-transparent to-primary-500/60" />
                {personal.brand.toUpperCase()} {"//"} PORTFOLIO
                <span className="h-px w-6 bg-gradient-to-l from-transparent to-primary-500/60" />
              </div>
              <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-slate-600">v3.0.0 — SYSTEM.READY</p>
            </div>

            {/* Chip suara — aktifkan via gestur (kebijakan autoplay browser) */}
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              data-sound-toggle
              data-cursor="TOGGLE"
              className={`absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] backdrop-blur-sm transition-colors ${
                soundOn
                  ? "border-primary-500/40 bg-primary-500/10 text-primary-300"
                  : "border-slate-700/80 bg-slate-900/70 text-slate-400 hover:border-primary-500/40 hover:text-primary-300"
              }`}
            >
              <span className={`relative flex h-1.5 w-1.5 ${soundOn ? "" : "opacity-40"}`}>
                {soundOn && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    soundOn ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
              </span>
              SOUND: {soundOn ? "ON" : "OFF"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
