"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Page transition ala awwwards (View Transitions API, ala Cyd Stumpel):
 * Navigasi antar halaman internal dibungkus startViewTransition sehingga
 * browser memainkan curtain wipe (lihat ::view-transition-* di globals.css).
 * - Capture phase agar berjalan sebelum handler Link/React
 * - Anchor hash (#...) diserahkan ke Lenis smooth scroll
 * - Link eksternal / target _blank / klik modifikasi dibiarkan normal
 * - Fallback mulus: tanpa dukungan API → navigasi biasa
 */
export function ViewTransitions() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("#")) return; // hash → Lenis
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // halaman sama

      if (typeof document.startViewTransition === "undefined") return;

      e.preventDefault();
      // Hentikan propagasi agar handler onClick Link/React tidak ikut router.push
      // (navigasi ganda bisa membatalkan transisi)
      e.stopPropagation();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const next = url.pathname + url.search + url.hash;
      if (reduce) {
        router.push(next);
        return;
      }
      document.startViewTransition(() => {
        router.push(next);
      });
    };

    // Capture: tangani sebelum Link/React menjalankan navigasinya sendiri
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
