"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/{}[]=+*#$%&";

// Kepadatan: hanya ~16% kolom yang aktif secara bersamaan (sangat jarang)
const DENSITY = 0.16;
// Kecepatan dasar (font-units per frame) — sangat pelan
const BASE_SPEED = 0.26;

/** Digital rain ala Matrix — jarang & tenang, sadar tema, nonaktif di reduced-motion & mobile. */
export function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const FONT = 13;

    const resize = () => {
      canvas.width = Math.max(1, canvas.offsetWidth * dpr);
      canvas.height = Math.max(1, canvas.offsetHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let cols = 1;
    // drops[i]: posisi float, atau null saat kolom "istirahat"
    let drops: (number | null)[] = [];
    // delays[i]: hitung mundur sebelum kolom kembali aktif
    let delays: number[] = [];
    // speeds[i]: kecepatan tiap kolom (variasi)
    let speeds: number[] = [];

    const reset = () => {
      cols = Math.max(1, Math.floor(canvas.width / (FONT * dpr)));
      drops = [];
      delays = [];
      speeds = [];
      for (let i = 0; i < cols; i++) {
        speeds[i] = BASE_SPEED * (0.6 + Math.random() * 1.2);
        if (Math.random() < DENSITY) {
          drops[i] = Math.floor(Math.random() * -90);
          delays[i] = 0;
        } else {
          drops[i] = null;
          delays[i] = Math.floor(Math.random() * 420);
        }
      }
    };
    reset();

    let raf = 0;
    let last = 0;
    let running = false;

    const frame = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (t - last < 60) return; // batasi ~16fps agar hemat & pelan
      last = t;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isDark = document.documentElement.classList.contains("dark");
      // Fade untuk trail (sesuai tema halaman)
      /* Fade lebih cepat → trail lebih pendek (tidak memenuhi layar) */
      ctx.fillStyle = isDark ? "rgba(2, 6, 23, 0.2)" : "rgba(255, 255, 255, 0.14)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      ctx.font = `${FONT}px "JetBrains Mono", ui-monospace, monospace`;
      for (let i = 0; i < cols; i++) {
        // Kolom kosong: hitung mundur jeda, lalu peluang kecil untuk muncul
        if (drops[i] === null) {
          if (--delays[i] <= 0 && Math.random() < 0.012) {
            drops[i] = Math.floor(Math.random() * -70);
            speeds[i] = BASE_SPEED * (0.6 + Math.random() * 1.2);
          }
          continue;
        }

        const pos = drops[i] as number;
        const y = pos * FONT;
        const x = i * FONT;
        ctx.fillStyle = isDark ? "rgba(94, 234, 212, 0.7)" : "rgba(13, 148, 136, 0.42)";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y);

        if (y > canvas.offsetHeight) {
          // 70% jadi kosong (istirahat lebih lama), 30% langsung reset
          if (Math.random() > 0.3) {
            drops[i] = null;
            delays[i] = Math.floor(Math.random() * 320);
          } else {
            drops[i] = Math.floor(Math.random() * -60);
          }
        } else {
          drops[i] = pos + speeds[i];
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onResize = () => {
      resize();
      reset();
      if (window.innerWidth < 768) stop();
      else start();
    };
    window.addEventListener("resize", onResize);

    if (window.innerWidth >= 768) start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
