"use client";

import { useEffect, useState } from "react";

/** Overlay CRT: scanlines statis + garis scan berjalan. Dinonaktifkan saat reduced-motion. */
export function Scanlines() {
  const [fine, setFine] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setFine(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!fine) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[14]">
      <div className="scanlines absolute inset-0" />
      <div className="scan-bar" />
    </div>
  );
}
