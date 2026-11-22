"use client";

import { useSyncExternalStore } from "react";

function subscribeSecond(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

/* Detik epoch sebagai snapshot: nilainya stabil di antara dua tick, jadi
   aman untuk useSyncExternalStore (Date baru tiap panggil akan loop). */
function getSecondSnapshot() {
  return Math.floor(Date.now() / 1000);
}

/** Widget HUD telemetry (desktop): jam live, tanggal, koordinat, status link, equalizer sinyal. */
export function Telemetry() {
  const epochSec = useSyncExternalStore(
    subscribeSecond,
    getSecondSnapshot,
    () => null,
  );
  const now = epochSec === null ? null : new Date(epochSec * 1000);

  const time = now ? now.toLocaleTimeString("id-ID", { hour12: false }) : "--:--:--";
  const date = now
    ? now.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "--/--/----";

  const bars = [10, 16, 8, 14, 11];

  return (
    <div className="fixed bottom-5 left-5 z-30 hidden lg:block">
      <div className="glass relative rounded-xl px-4 pb-3 pt-4">
        <span className="absolute -top-2 left-3 rounded border border-primary-500/30 bg-white/70 px-2 py-0.5 font-mono text-[9px] font-medium tracking-[0.25em] text-primary-600 backdrop-blur-md dark:bg-slate-950/70 dark:text-primary-400">
          TELEMETRY
        </span>
        <span aria-hidden="true" className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-primary-500/60" />
        <span aria-hidden="true" className="absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-primary-500/60" />
        <span aria-hidden="true" className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-primary-500/60" />
        <span aria-hidden="true" className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-primary-500/60" />

        {/* Baris data dekoratif (tidak dibaca screen reader) */}
        <div aria-hidden="true" className="space-y-1.5 font-mono text-[10px] leading-none text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between gap-6">
            <span>TIME</span>
            <span className="text-slate-800 dark:text-slate-100">
              {time} <span className="text-primary-500">WIB</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span>DATE</span>
            <span className="text-slate-800 dark:text-slate-100">{date}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span>GPS</span>
            <span className="text-slate-800 dark:text-slate-100">6.2°S / 106.8°E</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span>LINK</span>
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
              STABLE
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 border-t border-slate-200/70 pt-1.5 dark:border-slate-700/60">
            <span>SIGNAL</span>
            <span className="flex items-end gap-0.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="eq-bar w-0.5 rounded-sm bg-primary-500/80"
                  style={{ height: h, animationDelay: `${i * 0.13}s` }}
                />
              ))}
              <span className="ml-1.5 text-primary-500">98.7%</span>
            </span>
          </div>
        </div>
        {/* Hint terminal — terbaca screen reader */}
        <p className="mt-1.5 font-mono text-[9px] tracking-wider text-slate-400">
          HINT: tekan <kbd className="rounded border border-primary-500/30 bg-primary-500/10 px-1 text-primary-500">`</kbd> buka terminal
        </p>
      </div>
    </div>
  );
}
