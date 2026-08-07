"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setShow(y > 300);
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(doc > 0 ? Math.min(1, y / doc) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const R = 21;
  const C = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white/80 shadow-lg backdrop-blur-md transition-all hover:border-primary-500/50 hover:shadow-xl md:bottom-6 md:right-6 dark:border-slate-700 dark:bg-slate-900/80"
          aria-label="Kembali ke atas"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="top-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-primary-500)" />
                <stop offset="100%" stopColor="var(--color-teal-400)" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r={R} stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
            <circle
              cx="24"
              cy="24"
              r={R}
              stroke="url(#top-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
            />
          </svg>
          <svg
            className="h-5 w-5 text-slate-600 dark:text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
