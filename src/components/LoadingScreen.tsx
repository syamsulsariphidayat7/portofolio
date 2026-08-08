"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal } from "@/content/personal";

const BOOT_LINES = [
  "> init core modules ............... OK",
  "> load stack: next/react/ts ....... OK",
  "> establish secure link ........... OK",
  "> mount avatar.profile ............ OK",
  "> system online — welcome",
];

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const hide = setTimeout(() => setShow(false), 2400);
    const interval = setInterval(() => {
      setVisible((v) => Math.min(v + 1, BOOT_LINES.length));
    }, 260);
    return () => {
      clearTimeout(hide);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
        >
          <div className="relative w-[min(90vw,430px)] overflow-hidden rounded-xl border border-primary-500/30 bg-slate-900/90 shadow-2xl shadow-primary-500/10">
            {/* Garis neon atas */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/80 to-transparent" />
            {/* Header terminal */}
            <div className="flex items-center justify-between border-b border-primary-500/20 px-4 py-2.5">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-[10px] text-slate-400">
                  {personal.brand.toLowerCase()}.core — boot
                </span>
              </span>
              <span className="font-mono text-[10px] text-primary-400">v2.1.0</span>
            </div>
            {/* Log boot */}
            <div className="min-h-[7.5rem] px-4 py-4 font-mono text-xs leading-relaxed">
              {BOOT_LINES.slice(0, visible).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={i === BOOT_LINES.length - 1 ? "text-emerald-400" : "text-slate-300"}
                >
                  {line}
                </motion.p>
              ))}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary-400"
              >
                ▌
              </motion.span>
            </div>
            {/* Progress */}
            <div className="px-4 pb-4">
              <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.9, ease: "easeInOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 via-teal-400 to-primary-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
