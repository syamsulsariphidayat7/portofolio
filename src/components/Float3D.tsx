"use client";

import { useReducedMotion } from "framer-motion";

interface Float3DProps {
  /** "rings" = cincin bersilangan (gyro), "cube" = kubus wireframe */
  variant?: "rings" | "cube";
  /** Ukuran kotak penampung dalam px */
  size?: number;
  className?: string;
}

/* Kubus wireframe: 6 sisi dengan transformasi 3D */
function Cube({ size }: { size: number }) {
  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(270deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <div
      className="animate-3d-spin relative"
      style={{ width: size, height: size, transformStyle: "preserve-3d" }}
    >
      {faces.map((t, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0 rounded-md border border-primary-400/40 bg-primary-400/[0.04] shadow-[inset_0_0_18px_rgba(45,212,191,0.06)]"
          style={{ transform: t }}
        />
      ))}
    </div>
  );
}

/* Cincin bersilangan ala gyroscope: 4 ring pada bidang 3D berbeda */
function Rings({ size }: { size: number }) {
  const ring =
    "absolute inset-0 rounded-full border-2 border-primary-400/35 shadow-[0_0_16px_rgba(45,212,191,0.12)]";
  return (
    <div
      className="animate-3d-spin relative"
      style={{ width: size, height: size, transformStyle: "preserve-3d" }}
    >
      <div className={`${ring} border-primary-400/45`} style={{ transform: "rotateX(72deg)" }} />
      <div className={`${ring} border-indigo-400/40`} style={{ transform: "rotateY(58deg)" }} />
      <div className={`${ring} border-primary-400/25`} style={{ transform: "rotateY(122deg) rotateZ(24deg)" }} />
      <div className={`${ring} border-teal-400/30`} style={{ transform: "rotateX(-70deg) rotateY(20deg)" }} />
      {/* Inti titik bercahaya di tengah */}
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/70 shadow-[0_0_14px_rgba(45,212,191,0.9)]"
        style={{ transform: "translate(-50%, -50%) translateZ(0)" }}
      />
    </div>
  );
}

/**
 * Float3D — ornamen wireframe 3D melayang untuk latar konten. Murni dekoratif
 * (aria-hidden, pointer-events-none). Berputar penuh di sumbu X+Y via CSS
 * preserve-3d; disembunyikan total untuk prefers-reduced-motion.
 */
export function Float3D({ variant = "rings", size = 96, className = "" }: Float3DProps) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ perspective: size * 4 }}
    >
      {variant === "cube" ? <Cube size={size} /> : <Rings size={size} />}
    </div>
  );
}
