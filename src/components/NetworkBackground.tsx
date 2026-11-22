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
const CONNECTION_DIST = 125;
const SYMBOLS = ["</>", "{}", "()", "[]", "=>", "/*", "//", "const", "let", "fn"];
const MOUSE_DIST = 170;
const MAX_SPEED = 0.8;

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
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
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
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26 - 0.12,
        opacity: Math.random() * 0.12 + 0.04,
      }),
    );

    /* ---- Interaksi kursor (desktop) ---- */
    let mouseX = -9999;
    let mouseY = -9999;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    if (!isCoarse) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains("dark");
      const lineColor = isDark ? "rgba(45, 212, 191," : "rgba(13, 148, 136,";
      const nodeColor = isDark ? "rgba(45, 212, 191," : "rgba(13, 148, 136,";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.028;
        p.vy += (Math.random() - 0.5) * 0.028;
        p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));
        p.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vy));

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      /* Koneksi antar partikel */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
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

      /* Kursor: garis ke node terdekat + tarikan lembut + glow titik */
      if (!isCoarse && mouseX > -9000) {
        for (const p of particles) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_DIST) {
            const strength = 1 - d / MOUSE_DIST;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `${lineColor}${strength * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Tarikan lembut menuju kursor
            if (d > 0.01) {
              p.vx -= (dx / d) * 0.014;
              p.vy -= (dy / d) * 0.014;
            }
          }
        }
        // Titik kursor + aura
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 12, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}0.15)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}0.9)`;
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
      if (!isCoarse) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", onLeave);
      }
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
