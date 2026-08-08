"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Kursor kustom ala awwwards:
 * - Reticle crosshair HUD (ring + tick sudut + ring putus-putus berputar)
 * - Dot teal responsif cepat + glow & trail lembut
 * - Membesar saat hover elemen interaktif, menampilkan label kontekstual
 *   dari atribut `data-cursor` (mis. VIEW / OPEN / CLOSE)
 * - Hanya aktif di perangkat pointer halus (desktop) & nonaktif saat reduced-motion
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  /* Posisi mentah dari mouse */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  /* Lapisan dengan "berat" berbeda: dot cepat, ring sedang, glow lambat */
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const glowX = useSpring(x, { stiffness: 80, damping: 22 });
  const glowY = useSpring(y, { stiffness: 80, damping: 22 });
  const scale = useSpring(1, { stiffness: 300, damping: 24 });

  useEffect(() => {
    if (reduce) {
      // useReducedMotion() bernilai null di render pertama; kunci benar saat terisi
      setEnabled(false);
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest?.<HTMLElement>(
        'a, button, [data-cursor], [role="button"]',
      );
      if (interactive) {
        scale.set(1.25);
        const c = interactive.dataset.cursor;
        setLabel(c ? c : null);
      } else {
        scale.set(1);
        setLabel(null);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y, scale]);

  if (!enabled) return null;

  return (
    <>
      {/* Glow halus mengikuti kursor (kecil & redup) */}
      <motion.div
        aria-hidden="true"
        className="cursor-glow pointer-events-none fixed left-0 top-0 z-20"
        style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Reticle crosshair */}
      <motion.div
        aria-hidden="true"
        className="cursor-reticle pointer-events-none fixed left-0 top-0 z-[95]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", scale }}
      >
        <span className="cursor-tick cursor-tick--tl" />
        <span className="cursor-tick cursor-tick--tr" />
        <span className="cursor-tick cursor-tick--bl" />
        <span className="cursor-tick cursor-tick--br" />
      </motion.div>

      {/* Dot tengah */}
      <motion.div
        aria-hidden="true"
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[95]"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Label kontekstual */}
      <AnimatePresence>
        {label && (
          <motion.div
            aria-hidden="true"
            className="cursor-label pointer-events-none fixed left-0 top-0 z-[95] font-mono uppercase"
            style={{ x: ringX, y: ringY, translateX: 24, translateY: -26 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
