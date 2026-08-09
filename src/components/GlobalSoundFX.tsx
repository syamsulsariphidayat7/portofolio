"use client";

import { useEffect } from "react";
import { uiSound } from "@/lib/uiSound";

const INTERACTIVE =
  'a, button, [data-cursor], [data-sound], [role="button"], input, select, textarea, label, summary';

/**
 * GlobalSoundFX — feedback suara mikro di seluruh situs via event delegation:
 * - pointerover pada elemen interaktif → hover tick (di-throttle + per elemen)
 * - pointerdown pada elemen interaktif → click blip
 * Hanya berbunyi bila uiSound.enabled (opt-in). Pengunjung yang sebelumnya
 * mengaktifkan suara (preferensi localStorage) otomatis diaktifkan pada
 * gestur pertama — kecuali gestur itu tepat di tombol toggle itu sendiri.
 */
export function GlobalSoundFX() {
  useEffect(() => {
    /* Terapkan preferensi tersimpan setelah hidrasi (default: ON) */
    uiSound.init();

    let lastHoverAt = 0;
    let lastEl: Element | null = null;

    const onOver = (e: PointerEvent) => {
      if (!uiSound.enabled) return;
      const t = e.target as Element | null;
      const el = t?.closest?.(INTERACTIVE) ?? null;
      if (!el || el === lastEl) return; /* jangan ulangi di elemen sama */
      lastEl = el;
      const now = performance.now();
      if (now - lastHoverAt < 80) return; /* throttle agar tidak bersahut-sahutan */
      lastHoverAt = now;
      uiSound.hover();
    };

    const onDown = (e: PointerEvent) => {
      /* Gestur pertama → resume audio (autoplay) + boot sweep bila masih loading */
      uiSound.unlock();
      const t = e.target as Element | null;
      if (!uiSound.enabled || !t) return;
      if (t.closest?.(INTERACTIVE)) uiSound.click();
    };

    const onKey = () => uiSound.unlock();

    /* Reset elemen terakhir saat pointer keluar window → re-entry tetap berbunyi */
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) lastEl = null;
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("keydown", onKey, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return null;
}
