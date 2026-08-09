"use client";

import { useSyncExternalStore } from "react";
import { uiSound } from "@/lib/uiSound";

/**
 * SoundToggle — tombol suara persisten (pojok kiri bawah) yang selalu
 * tersedia setelah loading screen selesai. Status sinkron dengan modul
 * uiSound (termasuk chip di loading screen) via useSyncExternalStore.
 */
export function SoundToggle() {
  const on = useSyncExternalStore(
    uiSound.subscribe,
    uiSound.getEnabled,
    uiSound.getEnabled /* getServerSnapshot: modul statis → false di server */
  );

  return (
    <button
      type="button"
      data-sound-toggle
      data-cursor="SOUND"
      aria-pressed={on}
      aria-label={on ? "Nonaktifkan suara" : "Aktifkan suara"}
      onClick={() => {
        if (on) {
          uiSound.disable();
        } else {
          uiSound.enable();
          uiSound.click();
        }
      }}
      className="group fixed bottom-20 left-6 z-40 grid h-11 w-11 place-items-center rounded-full border bg-white/80 text-slate-600 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-primary-500/50 hover:text-primary-500 md:bottom-6 md:h-12 md:w-12 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-primary-300"
    >
      {on ? (
        /* Speaker + gelombang suara */
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          />
        </svg>
      ) : (
        /* Speaker senyap (mute) */
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          />
        </svg>
      )}
      <span
        className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white transition-colors dark:border-slate-900 ${
          on ? "bg-emerald-400" : "bg-slate-400"
        }`}
      />
    </button>
  );
}
