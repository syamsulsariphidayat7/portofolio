"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal } from "@/content/personal";

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(timer);
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
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 text-2xl font-bold text-white shadow-2xl shadow-primary-500/30"
            >
              {personal.brand[0]}
            </motion.div>
            <div className="flex items-center gap-1 font-mono text-lg text-slate-200">
              {personal.brand.toLowerCase()}<span className="text-primary-400">.dev</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary-400"
              >
                _
              </motion.span>
            </div>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-400"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
