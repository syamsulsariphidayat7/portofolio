"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ParallaxProps {
  children?: React.ReactNode;
  /** Jarak maksimum pergeseran (px) saat elemen melewati viewport */
  speed?: number;
  /** Rotasi maksimum (deg) mengikuti scroll — positif = ikut arah scroll */
  rotate?: number;
  /** Faktor skala akhir (1 = tetap). Elemen membesar/mengecil saat melintas */
  scale?: number;
  /** Fade opacity mengikuti posisi di viewport (tampil penuh di tengah) */
  fade?: boolean;
  /** Geser horizontal alih-alih vertikal */
  horizontal?: boolean;
  className?: string;
  /** Pakai progress scroll global (cocok untuk ornamen fixed/absolut) */
  global?: boolean;
}

export function Parallax({
  children,
  speed = 60,
  rotate = 0,
  scale = 1,
  fade = false,
  horizontal = false,
  className,
  global = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* Kedua hook dipanggil tanpa syarat (aturan hooks); yang dipakai dipilih
     sesudahnya. Dulu dipilih lewat ternary — urutan hook bisa berubah bila
     prop `global` berubah antar-render. */
  const globalScroll = useScroll();
  const localScroll = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollYProgress = global
    ? globalScroll.scrollYProgress
    : localScroll.scrollYProgress;

  /* Lapisan kedalaman: posisi (Y atau X), rotasi, skala, dan opacity semuanya
     digerakkan oleh progress scroll yang sama → bergerak serempak tapi tiap
     properti punya karakter sendiri. */
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const x = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);
  const s = useTransform(scrollYProgress, [0, 1], [1, scale]);
  const o = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 1, 1, 0]);

  const springY = useSpring(y, { stiffness: 110, damping: 24, mass: 0.4 });
  const springX = useSpring(x, { stiffness: 110, damping: 24, mass: 0.4 });
  const springR = useSpring(r, { stiffness: 90, damping: 22, mass: 0.5 });
  const springS = useSpring(s, { stiffness: 100, damping: 24, mass: 0.4 });
  const springO = useSpring(o, { stiffness: 80, damping: 24 });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{
        y: horizontal ? 0 : springY,
        x: horizontal ? springX : 0,
        rotate: rotate !== 0 ? springR : undefined,
        scale: scale !== 1 ? springS : undefined,
        opacity: fade ? springO : undefined,
        willChange: "transform",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
