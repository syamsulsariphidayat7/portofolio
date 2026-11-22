"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Pointer "Normal+":
 * - Kursor bawaan browser TETAP tampil dan jadi penunjuk utama
 *   (tidak ada lagi `cursor: none` / reticle HUD / dot / glow / label).
 * - Satu ring tipis teal mengikuti mouse dengan spring longgar (lag halus)
 *   sebagai aksen identitas.
 * - Hover elemen interaktif: ring membesar 1,5x sambil memudar.
 * - Klik: ring menyusut sebentar ke 0,85x.
 * - Hanya aktif di perangkat pointer halus (desktop) & nonaktif saat
 *   reduced-motion.
 */
function subscribePointerFine(onChange: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getPointerFineSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const pointerFine = useSyncExternalStore(
    subscribePointerFine,
    getPointerFineSnapshot,
    () => false,
  );
  const enabled = !reduce && pointerFine;

  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hoveringRef = useRef(false);

  /* Posisi mentah dari mouse */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  /* Ring mengikuti dengan spring longgar — sumber lag halus khas Normal+ */
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  /* Skala + opacity ring sebagai motion value berspring */
  const scale = useMotionValue(1);
  const smoothScale = useSpring(scale, { stiffness: 300, damping: 24 });
  const opacity = useMotionValue(1);
  const smoothOpacity = useSpring(opacity, { stiffness: 300, damping: 28 });

  useEffect(() => {
    scale.set(pressed ? 0.85 : hovering ? 1.5 : 1);
    opacity.set(hovering && !pressed ? 0.55 : 1);
  }, [hovering, pressed, scale, opacity]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest?.(
        'a, button, [data-cursor], [role="button"]',
      );
      if (interactive !== hoveringRef.current) {
        hoveringRef.current = interactive;
        setHovering(interactive);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-ring pointer-events-none fixed left-0 top-0 z-[95]"
      style={{
        x: ringX,
        y: ringY,
        translateX: "-50%",
        translateY: "-50%",
        scale: smoothScale,
        opacity: smoothOpacity,
      }}
    />
  );
}
