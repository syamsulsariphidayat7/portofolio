"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal } from "@/content/personal";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);
  // Baca status dismiss langsung saat init (guard typeof window untuk SSR);
  // prompt belum tampil di render pertama, jadi tak ada hydration mismatch.
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      !!localStorage.getItem("pwa-dismissed"),
  );

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt) return;
    (deferredPrompt as Event & { prompt: () => void }).prompt();
    setShow(false);
  }

  function handleDismiss() {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("pwa-dismissed", "true");
  }

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 md:bottom-6 left-4 right-4 z-50 max-w-md mx-auto md:mx-0 md:left-auto md:right-6"
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Install Aplikasi {personal.brand}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Akses cepat dari layar utama
              </p>
            </div>
            <button
              onClick={handleInstall}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Tutup"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
