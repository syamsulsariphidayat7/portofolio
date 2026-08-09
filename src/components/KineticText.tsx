"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* Satu kata: berat font dihitung dari jarak kursor (normalized) + boost scroll.
   Semakin dekat kursor → semakin tebal (kinetic typography). */
function KineticWord({
  word,
  center,
  cursor,
  scrollBoost,
  reduce,
  wordRef,
}: {
  word: string;
  center: number;
  cursor: MotionValue<number>;
  scrollBoost: MotionValue<number>;
  reduce: boolean | null;
  wordRef: (el: HTMLSpanElement | null) => void;
}) {
  const weight = useTransform(
    [cursor, scrollBoost] as [MotionValue<number>, MotionValue<number>],
    ([c, sb]: number[]) => {
      if (reduce) return 600;
      const d = Math.abs(c - center);
      const hover = (1 - Math.min(1, d * 2.4)) * 320; /* dekat → +320 */
      return Math.round(Math.min(900, Math.max(560, 560 + hover + sb)));
    }
  );
  const smooth = useSpring(weight, { stiffness: 280, damping: 32, mass: 0.5 });

  /* Span inline (bukan inline-block) agar wrap alami + gradient text tetap
     ter-clip per kata; spasi di-render di luar span. */
  return (
    <>
      <motion.span ref={wordRef} style={{ fontWeight: smooth }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

interface KineticTextProps {
  text: string;
  className?: string;
}

/**
 * KineticText — judul dengan berat huruf yang "mengikuti" kursor:
 * kata terdekat mengental hingga ~850, yang jauh melangsing ke ~450.
 * Ditambah boost scroll: judul makin berat saat halaman di-scroll lewat.
 * Memanfaatkan font variable Inter (axis wght).
 */
export function KineticText({ text, className = "" }: KineticTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const [centers, setCenters] = useState<number[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Posisi kursor dinormalisasi 0..1 melintasi lebar teks.
     Nilai awal -2 → semua kata ringan sebelum kursor masuk. */
  const cursor = useMotionValue(-2);

  /* Boost scroll: 0 saat judul di posisi awal, +160 saat mulai meninggalkan layar */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollBoost = useTransform(scrollYProgress, [0, 1], [0, 160]);

  /* Ukur posisi tengah tiap kata (ulang saat resize / font selesai dimuat) */
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      setCenters(
        wordRefs.current.map((w) => {
          if (!w) return 0.5;
          const r = w.getBoundingClientRect();
          return (r.left - rect.left + r.width / 2) / rect.width;
        })
      );
    };
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener("resize", measure);
  }, [words.length]);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    cursor.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
  }

  function onMouseLeave() {
    cursor.set(-2);
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {words.map((word, i) => (
        <KineticWord
          key={`${word}-${i}`}
          word={word}
          center={centers[i] ?? 0.5}
          cursor={cursor}
          scrollBoost={scrollBoost}
          reduce={reduce}
          wordRef={(el) => {
            wordRefs.current[i] = el;
          }}
        />
      ))}
    </span>
  );
}
