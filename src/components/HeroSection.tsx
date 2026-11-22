"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { Button } from "./ui/Button";
import { KineticText } from "./KineticText";
import { HeroTerminal } from "./HeroTerminal";
import { SocialLinks } from "./SocialLinks";
import { Magnetic } from "./Magnetic";
import { HologramGlobe } from "./HologramGlobe";
import { bootSignal } from "@/lib/bootSignal";
import { useLang } from "@/lib/i18n";
import dynamic from "next/dynamic";

/* WebGL 3D di-code-split: tidak menghalangi render awal halaman */
const Starfield3D = dynamic(() => import("./Starfield3D").then((m) => m.Starfield3D), { ssr: false });
import { personal } from "@/content/personal";

function useRotatingRole() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % t.hero.roles.length), 2600);
    return () => clearInterval(id);
  }, [t]);
  return t.hero.roles[index % t.hero.roles.length];
}

export function HeroSection() {
  const { t } = useLang();
  const role = useRotatingRole();
  const reduce = useReducedMotion();
  /* Gerbang boot: animasi masuk hero menunggu sinyal LoadingScreen
     (bootSignal) supaya tidak habis di balik layar boot. Fallback 5 dtk
     untuk berjaga bila sinyal tak pernah datang. */
  const booted = useSyncExternalStore(
    bootSignal.subscribe,
    bootSignal.isDone,
    () => false,
  );
  const [bootFallback, setBootFallback] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBootFallback(true), 5000);
    return () => clearTimeout(t);
  }, []);
  const heroIn = booted || bootFallback;
  const sectionRef = useRef<HTMLElement>(null);

  /* ---- Parallax kursor (kedalaman berlapis) ---- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.6 });

  const glowX = useTransform(smx, (v) => v * 36);
  const glowY = useTransform(smy, (v) => v * 30);
  const cardX = useTransform(smx, (v) => v * 16);
  const cardY = useTransform(smy, (v) => v * 12);
  const chipX = useTransform(smx, (v) => v * 30);
  const chipY = useTransform(smy, (v) => v * 22);

  function onMouseMove(e: React.MouseEvent) {
    const el = sectionRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  /* ---- Parallax scroll: kolom + grid 3D ---- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const reduceStyle = reduce ? { y: 0, opacity: 1 } : undefined;
  const reduceVisual = reduce ? { y: 0, scale: 1 } : undefined;

  return (
    <section
      id="start"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* WebGL 3D: partikel bintang + core wireframe (di belakang semua) */}
      <Starfield3D
        corePosition={[0, 0.5, -3.5]}
        className="z-0 opacity-95 dark:opacity-100 [mask-image:radial-gradient(ellipse_78%_72%_at_50%_45%,black_32%,transparent_82%)]"
      />

      {/* Shooting star */}
      <div aria-hidden="true" className="shooting-star" />
      <div aria-hidden="true" className="shooting-star shooting-star--alt" />

      {/* Grid 3D perspektif ala Tron */}
      <motion.div style={{ opacity: gridOpacity }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]">
        <div className="cyber-grid-3d" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary-500/15 via-primary-500/5 to-transparent" />
      </motion.div>

      {/* Blob dekoratif — ikut parallax kursor */}
      <motion.div style={{ x: glowX, y: glowY }}>
        <div className="animate-float-delayed pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
      </motion.div>
      <motion.div style={{ x: glowX, y: glowY }}>
        <div className="animate-float pointer-events-none absolute -bottom-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/10" />
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-[90rem] items-center gap-16 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ===== KIRI: teks ===== */}
        <motion.div style={reduceStyle ?? { y: textY, opacity: textOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Badge status terminal */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={heroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary-500/30 bg-slate-950/5 px-3 py-1.5 font-mono text-[11px] font-medium tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-slate-400">[</span>
              AVAILABLE
              <span className="text-slate-400">{"//"}</span>
              OPEN FOR WORK
              <span className="text-slate-400">]</span>
              <span className="animate-blink text-primary-400">▌</span>
            </motion.span>

            <h1 className="mb-4 mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {/* Kinetic typography: berat kata mengikuti kursor + scroll */}
              <KineticText text={`${t.hero.greeting} ${personal.name}`} className="text-gradient-animate" />
            </h1>

            {/* Role berputar */}
            <div className="mb-7 h-10" aria-live="polite">
              <p className="font-mono text-lg text-slate-500 dark:text-slate-400 sm:text-xl">
                <span className="text-glow text-primary-500">&gt; </span>
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

            {/* Timing tangga rapat (dirapikan 22 Nov 2026): delay lama
                2.2/2.4/2.6 adalah sisa era judul efek-mengetik — judul
                sekarang instan (KineticText), jadi elemen di bawahnya
                tidak perlu menunggu ±2 detik. */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mb-9 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400"
            >
              {t.hero.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.18}>
                <Button href="#work">
                  {t.hero.viewProjects}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Button href="#contact" variant="outline">
                  {t.hero.contactMe}
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-xs text-slate-400">{t.hero.follow}</span>
              <SocialLinks />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ===== KANAN: visual avatar — GESER kiri di dalam kolomnya
            (22 Nov 2026: rata tepi kiri kolom, BUKAN pindah sisi;
            globe Starfield kini di tengah hero) ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={heroIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mx-auto hidden w-full max-w-sm md:block lg:mx-0 lg:max-w-md"
        >
          {/* Parallax scroll: visual melayang lebih lambat + mengecil halus */}
          <motion.div style={reduceVisual ?? { y: visualY, scale: visualScale }} className="relative">
            {/* Halo lembut (dipertahankan) */}
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-primary-500/25 via-teal-400/15 to-indigo-500/20 blur-2xl" />

            {/* Bingkai HUD tenang (rombakan 22 Nov 2026, pilihan Syamsul
                "Varian A"): radar conic + aura muter + dua cincin lingkaran
                DIBUANG — bentuk lingkaran memaksa pada terminal persegi dan
                dua putaran bersamaan terasa seperti kipas. Gantinya ring
                persegi tipis mengikuti bentuk terminal + 4 bracket sudut
                berdenyut sangat pelan (4 dtk, bergeser fase per sudut). */}
            <motion.div style={{ x: glowX, y: glowY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -inset-3 rounded-[1.9rem] border border-primary-500/20" />
              <div className="absolute -inset-5">
                <span className="animate-bracket-pulse absolute left-0 top-0 h-6 w-6 rounded-tl-[1.1rem] border-l-2 border-t-2 border-primary-400/70" />
                <span className="animate-bracket-pulse absolute right-0 top-0 h-6 w-6 rounded-tr-[1.1rem] border-r-2 border-t-2 border-primary-400/70" style={{ animationDelay: "1s" }} />
                <span className="animate-bracket-pulse absolute bottom-0 left-0 h-6 w-6 rounded-bl-[1.1rem] border-b-2 border-l-2 border-primary-400/70" style={{ animationDelay: "2s" }} />
                <span className="animate-bracket-pulse absolute bottom-0 right-0 h-6 w-6 rounded-br-[1.1rem] border-b-2 border-r-2 border-primary-400/70" style={{ animationDelay: "3s" }} />
              </div>
            </motion.div>

            {/* Visual utama: TERMINAL (menggantikan kartu avatar —
                keputusan Syamsul 22 Nov 2026: kartu dihapus total,
                chip teknologi + globe kecil tetap melayang di sekitar
                terminal; identitas tetap terbaca dari skrip terminal) */}
            <motion.div style={{ x: cardX, y: cardY }} className="relative">
              <HeroTerminal
                size="lg"
                className="animate-float-delayed glass relative w-full rounded-[1.5rem] shadow-2xl shadow-primary-500/20"
              />
            </motion.div>

            {/* Globe hologram kecil — bisa di-drag dengan mouse/touch */}
            <motion.div style={{ x: chipX, y: chipY }} className="absolute -top-14 right-0 z-10 lg:-right-3">
              <div className="animate-float">
                <HologramGlobe
                  draggable
                  className="h-24 w-24 drop-shadow-[0_0_18px_rgba(45,212,191,0.35)] lg:h-28 lg:w-28"
                />
              </div>
            </motion.div>

            {/* Chip teknologi mengambang (parallax kursor, float via CSS).
                PERBAIKAN BUG POSISI (22 Nov 2026): pembungkus chip WAJIB
                will-change-transform. Tanpa itu, saat boot (x/y masih 0)
                framer-motion merender transform: none sehingga chip
                absolute di dalamnya berlabuh ke kolom visual (menimpa
                terminal); begitu mouse bergerak transform muncul,
                pembungkus jadi containing block, dan chip melompat ke
                posisi semestinya di bawah-kiri terminal. will-change
                membuat pembungkus containing block sejak frame pertama,
                jadi posisi boot = posisi setelah mouse bergerak. */}
            <motion.div style={{ x: chipX, y: chipY }} className="will-change-transform">
              <div className="animate-float glass absolute -left-5 top-10 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-700 shadow-lg shadow-slate-900/5 dark:text-slate-200">
                ⚡ Next.js
              </div>
            </motion.div>
            <motion.div style={{ x: chipX, y: chipY }} className="will-change-transform">
              <div className="animate-float-delayed glass absolute -left-8 top-1/3 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-700 shadow-lg shadow-slate-900/5 dark:text-slate-200">
                {"{ TS }"}
              </div>
            </motion.div>
            <motion.div style={{ x: chipX, y: chipY }} className="will-change-transform">
              <div className="animate-float glass absolute -bottom-6 right-6 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-700 shadow-lg shadow-slate-900/5 dark:text-slate-200">
                Tailwind
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>

      {/* Indikator scroll */}
      <Magnetic strength={0.35} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <motion.a
          href="#work"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroIn ? 1 : 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col items-center gap-2 text-slate-400"
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
      </Magnetic>
    </section>
  );
}
