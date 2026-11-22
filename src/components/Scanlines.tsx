"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Overlay CRT: scanlines statis + garis scan berjalan. Dinonaktifkan saat reduced-motion. */
export function Scanlines() {
  // Server snapshot false = perilaku awal lama (scanlines tampil penuh)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const fine = !reducedMotion;

  if (!fine) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[14]">
      <div className="scanlines absolute inset-0" />
      <div className="scan-bar" />
    </div>
  );
}
