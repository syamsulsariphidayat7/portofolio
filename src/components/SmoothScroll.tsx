"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/* Instance Lenis dibagikan agar komponen lain (mis. modal) bisa pause/play scroll */
let lenisInstance: Lenis | null = null;

export function stopSmoothScroll() {
  lenisInstance?.stop();
}

export function startSmoothScroll() {
  lenisInstance?.start();
}

export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch tetap native by default (lebih responsif di mobile) & hemat baterai
    });
    lenisInstance = lenis;

    // Smooth scroll untuk anchor link (termasuk /#section dari halaman yang sama)
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const [path, hash] = href.split("#");
      if (!hash) return;
      const current = window.location.pathname;
      if (path && path !== current && !(path === "/" && current === "/")) return; // lintas halaman
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -84 });
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${hash}`);
    };

    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      lenisInstance = null;
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
