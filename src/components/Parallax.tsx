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
  className?: string;
  /** Pakai progress scroll global (cocok untuk ornamen fixed/absolut) */
  global?: boolean;
}

export function Parallax({ children, speed = 60, className, global = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = global
    ? useScroll()
    : useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const springY = useSpring(y, { stiffness: 120, damping: 26, mass: 0.4 });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y: springY, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}
