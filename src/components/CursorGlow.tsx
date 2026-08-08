"use client";

import { useEffect } from "react";

export function CursorGlow() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = document.createElement("div");
    el.className = "cursor-glow";
    const trail = document.createElement("div");
    trail.className = "cursor-glow cursor-glow-trail";
    document.body.appendChild(el);
    document.body.appendChild(trail);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const loop = () => {
      // Lapisan utama: responsif cepat
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      // Trail: lag lebih panjang (efek ekor cahaya)
      tx += (targetX - tx) * 0.06;
      ty += (targetY - ty) * 0.06;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      trail.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      el.remove();
      trail.remove();
    };
  }, []);

  return null;
}
