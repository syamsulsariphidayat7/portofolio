"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface CodeSymbol {
  x: number;
  y: number;
  text: string;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
}

const PARTICLE_COUNT = 50;
const CONNECTION_DIST = 150;
const SYMBOLS = ["</>", "{}", "()", "[]", "=>", "/*", "//", "const", "let", "fn"];

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = () => window.innerWidth < 768;

    const particles: Particle[] = Array.from(
      { length: isMobile() ? 25 : PARTICLE_COUNT },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        size: Math.random() * 2 + 1.5,
        alpha: Math.random() * 0.5 + 0.3,
      }),
    );

    const codeSymbols: CodeSymbol[] = Array.from(
      { length: isMobile() ? 4 : 8 },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        text: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size: Math.random() * 6 + 10,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55 - 0.25,
        opacity: Math.random() * 0.12 + 0.04,
      }),
    );

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains("dark");
      const lineColor = isDark
        ? "rgba(45, 212, 191,"
        : "rgba(13, 148, 136,";
      const nodeColor = isDark
        ? "rgba(45, 212, 191,"
        : "rgba(13, 148, 136,";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.07;
        p.vy += (Math.random() - 0.5) * 0.07;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}${p.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}${p.alpha * 0.2})`;
        ctx.fill();
      }

      for (const s of codeSymbols) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -60) s.x = canvas.width + 60;
        if (s.x > canvas.width + 60) s.x = -60;
        if (s.y < -60) s.y = canvas.height + 60;
        if (s.y > canvas.height + 60) s.y = -60;

        ctx.save();
        ctx.font = `${s.size}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillStyle = `${lineColor}${s.opacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.text, s.x, s.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
