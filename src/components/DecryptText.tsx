"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number;
}

/**
 * Teks "mendekripsi": saat hover, karakter acak berganti cepat lalu
 * menetap menjadi teks asli — aksen terminal sci-fi.
 */
export function DecryptText({ text, className = "", speed = 26 }: DecryptTextProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Reset saat teks berubah (mis. label nav aktif bertambah bracket).
     Timer dari run sebelumnya ikut dibatalkan agar tidak menimpa teks baru. */
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplay(text);
  }, [text]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const run = () => {
    if (reduce) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    let frame = 0;
    const total = text.length;
    const settle = Math.max(8, Math.floor(total * 0.6));
    const step = () => {
      frame += 1;
      let out = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
          continue;
        }
        if (i < Math.floor((total * frame) / settle)) out += text[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (frame < settle) {
        timerRef.current = setTimeout(step, speed);
      } else {
        setDisplay(text);
      }
    };
    step();
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplay(text);
  };

  return (
    <span onMouseEnter={run} onMouseLeave={reset} aria-label={text} className={className}>
      {display}
    </span>
  );
}
