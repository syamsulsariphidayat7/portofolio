"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Rotasi maksimum dalam derajat */
  intensity?: number;
  /** Tampilkan glare radial mengikuti kursor */
  glare?: boolean;
  glareOpacity?: number;
}

export function TiltCard({
  children,
  className = "",
  intensity = 7,
  glare = true,
  glareOpacity = 0.12,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const srx = useSpring(rx, { stiffness: 160, damping: 18, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18, mass: 0.5 });

  const glareBg = useMotionTemplate`radial-gradient(480px circle at ${gx}% ${gy}%, rgba(255,255,255,${glareOpacity}), transparent 65%)`;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set((0.5 - py) * intensity * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function onMouseLeave() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={`group relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
