"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { TypingEffect } from "./TypingEffect";
import { SocialLinks } from "./SocialLinks";
import { personal } from "@/content/personal";

function useRotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % personal.roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return personal.roles[index];
}

export function HeroSection() {
  const role = useRotatingRole();

  return (
    <section id="start" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Blob dekoratif */}
      <div className="animate-float-delayed pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
      <div className="animate-float pointer-events-none absolute -bottom-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/10" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ===== KIRI: teks ===== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Badge ketersediaan */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
            </span>
            Tersedia untuk proyek baru
          </motion.span>

          <h1 className="mb-4 mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <TypingEffect text={`Hai, saya ${personal.name}`} speed={70} delay={500} className="text-gradient" />
          </h1>

          {/* Role berputar */}
          <div className="mb-7 h-10" aria-live="polite">
            <p className="font-mono text-lg text-slate-500 dark:text-slate-400 sm:text-xl">
              <span className="text-primary-500">&gt; </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block text-slate-700 dark:text-slate-200"
                >
                  {role}
                </motion.span>
              </AnimatePresence>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary-500"
              >
                _
              </motion.span>
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="mb-9 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400"
          >
            {personal.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="mb-8 flex flex-wrap items-center gap-4"
          >
            <Button href="#work">
              Lihat Proyek
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
            <Button href="#contact" variant="outline">
              Hubungi Saya
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="font-mono text-xs text-slate-400">ikuti saya:</span>
            <SocialLinks />
          </motion.div>
        </motion.div>

        {/* ===== KANAN: visual avatar ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mx-auto hidden w-full max-w-sm md:block lg:max-w-md"
        >
          {/* Halo */}
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-primary-500/25 via-teal-400/15 to-indigo-500/20 blur-2xl" />

          {/* Kartu avatar */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[2rem] bg-gradient-to-br from-primary-500 via-teal-400 to-indigo-500 p-[2px] shadow-2xl shadow-primary-500/20"
          >
            <div className="overflow-hidden rounded-[calc(2rem-2px)] bg-white dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personal.avatar}
                alt={`Foto ${personal.name}`}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="glass absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {personal.name}
                </p>
                <p className="truncate font-mono text-xs text-primary-600 dark:text-primary-400">
                  {personal.role}
                </p>
              </div>
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
          </motion.div>

          {/* Chip teknologi mengambang */}
          <div className="animate-float glass absolute -right-5 -top-5 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-700 shadow-lg shadow-slate-900/5 dark:text-slate-200">
            ⚡ Next.js
          </div>
          <div className="animate-float-delayed glass absolute -left-8 top-1/3 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-700 shadow-lg shadow-slate-900/5 dark:text-slate-200">
            {"{ TS }"}
          </div>
          <div className="animate-float glass absolute -bottom-6 right-6 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-700 shadow-lg shadow-slate-900/5 dark:text-slate-200">
            Tailwind
          </div>

          {/* Kartu kode */}
          <div className="animate-float-delayed glass absolute -bottom-10 -left-10 hidden w-64 rounded-2xl shadow-2xl shadow-slate-900/10 sm:block">
            <div className="flex items-center gap-1.5 px-4 pb-0 pt-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 font-mono text-[10px] text-slate-400">developer.ts</span>
            </div>
            <pre className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              <code>
                <span className="text-purple-500">const</span> dev = {"{"}
                {"\n"}  name: <span className="text-emerald-600 dark:text-emerald-400">"{personal.name}"</span>,
                {"\n"}  role: <span className="text-emerald-600 dark:text-emerald-400">"{personal.role}"</span>,
                {"\n"}  stack: [<span className="text-sky-600 dark:text-sky-400">"Next.js"</span>,{" "}
                <span className="text-sky-600 dark:text-sky-400">"TS"</span>],
                {"\n"}  hireable: <span className="text-amber-600 dark:text-amber-400">true</span>,
                {"\n"}{"}"};
              </code>
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Indikator scroll */}
      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 md:flex"
        aria-label="Scroll ke karya"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 justify-center rounded-full border-2 border-current pt-1.5"
        >
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-current"
          />
        </motion.span>
      </motion.a>
    </section>
  );
}
