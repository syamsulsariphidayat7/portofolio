"use client";

import { useEffect, useRef } from "react";

/**
 * Hologram globe: wireframe icosahedron 3D di canvas ringan (tanpa three.js).
 * - Mode default (`draggable=false`): berputar perlahan + miring mengikuti kursor
 *   (dipakai sebagai backdrop di section stats).
 * - Mode `draggable=true`: globe kecil yang bisa di-drag dengan mouse/touch untuk
 *   diputar bebas, dengan inersia halus saat dilepas. Menampilkan hint "drag // rotate".
 * Nonaktif saat prefers-reduced-motion atau layar < 768px.
 */
export function HologramGlobe({
  className = "",
  draggable = false,
}: {
  className?: string;
  draggable?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* Mulai ulang loop saat layar cukup besar (desktop-up / rotate) */
      if (window.innerWidth >= 768 && !raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", resize);
    /* Catatan: resize() dipanggil di akhir (setelah `draw` terdefinisi) */

    /* Vertices + edges icosahedron */
    const t = (1 + Math.sqrt(5)) / 2;
    const raw = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ];
    const V = raw.map(([x, y, z]) => {
      const l = Math.hypot(x, y, z) || 1;
      return [x / l, y / l, z / l];
    });
    const edges: [number, number][] = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10], [1, 9], [1, 5], [1, 4], [1, 6],
      [2, 10], [2, 4], [2, 6], [2, 3], [3, 9], [3, 6], [3, 4], [3, 8], [4, 9],
      [4, 11], [5, 7], [5, 9], [6, 8], [6, 10], [7, 11], [7, 8], [8, 9], [8, 10],
      [9, 11], [10, 4], [11, 5],
    ];

    let rotX = 0.35;
    let rotY = 0.6;
    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* ---- Interaksi drag (mode draggable) ---- */
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    const clampX = (v: number) => Math.max(-1.4, Math.min(1.4, v));

    const onPointerDown = (e: PointerEvent) => {
      if (!draggable) return;
      dragging = true;
      grabT = 0; /* ledakan cincin energi saat mulai digenggam */
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
      /* Haptic mikro — getar singkat (aktif di perangkat touch; no-op aman di desktop) */
      if (navigator.vibrate) navigator.vibrate(8);
      e.preventDefault();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * 0.012;
      rotX = clampX(rotX + dy * 0.012);
      velY = dx * 0.012;
      velX = dy * 0.012;
    };
    const onPointerEnd = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      grabT = 0; /* ping kecil saat dilepas */
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    if (draggable) {
      canvas.style.cursor = "grab";
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerEnd);
      canvas.addEventListener("pointercancel", onPointerEnd);
    }

    const project = (p: number[]) => {
      const [x0, y0, z0] = p;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x0 * cosY + z0 * sinY;
      const z1 = -x0 * sinY + z0 * cosY;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;
      const r = Math.min(w, h) * 0.34;
      return [w / 2 + x1 * r, h / 2 + y2 * r, z2];
    };

    /* Timer feedback visual (ms sejak grab/release) */
    let grabT = -1;
    let last = performance.now();
    const draw = (now: number) => {
      /* Layar kecil: hentikan loop (hemat baterai), siap restart via resize */
      if (window.innerWidth < 768) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(draw);
      const dt = Math.min(40, now - last);
      last = now;

      if (!dragging) {
        if (Math.abs(velY) > 0.0002 || Math.abs(velX) > 0.0002) {
          /* Inersia setelah drag dilepas */
          rotY += velY;
          rotX = clampX(rotX + velX);
          velY *= 0.94;
          velX *= 0.94;
        } else if (draggable) {
          /* Idle: spin pelan dari posisi yang ditinggalkan + tilt halus ke kursor */
          rotY += 0.0016 * (dt / 16) + (mouse.x - 0.5) * 0.0035;
          rotX += (0.35 - (mouse.y - 0.5) * 0.8 - rotX) * 0.02;
        } else {
          /* Mode default (stats): ease ke arah kursor + spin */
          const targetRY = 0.6 + (mouse.x - 0.5) * 1.2;
          const targetRX = 0.35 - (mouse.y - 0.5) * 0.9;
          rotY += (targetRY - rotY) * 0.04 + 0.0016 * (dt / 16);
          rotX += (targetRX - rotX) * 0.04;
        }
      }

      /* Majukan timer feedback cincin energi */
      if (grabT >= 0) {
        grabT += dt;
        if (grabT > 450) grabT = -1;
      }

      ctx.clearRect(0, 0, w, h);
      const pts = V.map(project);

      /* Edges — lebih terang saat globe sedang di-drag */
      for (const [a, b] of edges) {
        const front = Math.max(0, (pts[a][2] + pts[b][2]) / 2);
        const alpha = (dragging ? 0.42 : 0.12) + front * (dragging ? 0.42 : 0.3);
        ctx.strokeStyle = `rgba(45,212,191,${Math.min(1, alpha).toFixed(3)})`;
        ctx.lineWidth = dragging ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.stroke();
      }

      /* Titik vertex — depan lebih besar & terang; membesar saat di-drag */
      for (let i = 0; i < pts.length; i++) {
        const z = pts[i][2];
        const front = Math.max(0, z);
        ctx.fillStyle = `rgba(94,234,212,${(0.25 + front * 0.65).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pts[i][0], pts[i][1], (dragging ? 2 : 1.4) + front * (dragging ? 2 : 1.6), 0, Math.PI * 2);
        ctx.fill();
      }

      /* Lingkaran ekuator — lebih terang saat di-drag */
      ctx.strokeStyle = dragging ? "rgba(45,212,191,0.34)" : "rgba(45,212,191,0.14)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, Math.min(w, h) * 0.34, Math.min(w, h) * 0.34 * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();

      /* Titik-titik orbit kecil */
      ctx.fillStyle = "rgba(94,234,212,0.5)";
      for (let i = 0; i < 3; i++) {
        const a = performance.now() / 3000 + (i * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(w / 2 + Math.cos(a) * Math.min(w, h) * 0.34, h / 2 + Math.sin(a) * Math.min(w, h) * 0.34 * 0.34, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Feedback grab: cincin energi yang membesar + memudar (450ms) */
      if (grabT >= 0) {
        const p = Math.min(1, grabT / 450);
        const r = Math.min(w, h) * (0.34 + p * 1.15);
        ctx.strokeStyle = `rgba(45,212,191,${(0.65 * (1 - p)).toFixed(3)})`;
        ctx.lineWidth = 2.5 * (1 - p) + 0.4;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(94,234,212,${(0.35 * (1 - p)).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r * 0.82, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    /* Set ukuran awal + mulai loop bila layar cukup besar */
    resize();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (draggable) {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerEnd);
        canvas.removeEventListener("pointercancel", onPointerEnd);
      }
    };
  }, [draggable]);

  const canvas = (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-cursor={draggable ? "DRAG" : undefined}
      className={`${draggable ? "touch-none select-none" : ""} ${className}`}
    />
  );

  if (!draggable) return canvas;

  return (
    <div className="relative">
      {canvas}
      {/* Cincin pulsa sebagai isyarat "bisa digeser" */}
      <span
        aria-hidden="true"
        className="animate-pulse-ring pointer-events-none absolute -inset-2 rounded-full border border-primary-500/30"
      />
      {/* Hint interaksi */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-6 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-primary-400/90"
      >
        ⟲ drag // rotate
      </span>
    </div>
  );
}
