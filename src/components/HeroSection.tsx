"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { TypingEffect } from "./TypingEffect";
import { personal } from "@/content/personal";

export function HeroSection() {
  return (
    <section id="start" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-blue-50/50 dark:from-primary-950/30 dark:via-transparent dark:to-blue-950/30 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-32 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-primary-600 dark:text-primary-400 font-medium mb-4 tracking-wide uppercase text-sm font-mono"
          >
            $ {personal.role}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
          >
            Hai, saya{" "}
            <span className="bg-gradient-to-r from-primary-600 to-teal-500 dark:from-primary-400 dark:to-teal-300 bg-clip-text text-transparent">
              {personal.name}
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-10 mb-8"
          >
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-mono">
              <span className="text-primary-400">&gt; </span>
              <TypingEffect text="say syamsul..." speed={80} delay={300} />
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {personal.bio}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button href="#work">Lihat Proyek</Button>
            <Button href="#contact" variant="outline">
              Hubungi Saya
            </Button>
          </motion.div>
        </motion.div>

        <motion.a
          href="#work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}
