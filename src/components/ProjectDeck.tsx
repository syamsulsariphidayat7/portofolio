"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { Badge } from "./ui/Badge";
import { stopSmoothScroll, startSmoothScroll } from "./SmoothScroll";
import { projects, type Project } from "@/content/projects";

const total = projects.length;

/* ------------------------------------------------------------------ */
/* Kartu deck: fan + tilt 3D mengikuti mouse + shadow dinamis + edge-  */
/* light pada sisi yang menghadap kursor                                */
/* ------------------------------------------------------------------ */
function DeckCard({
  project,
  i,
  fan,
  onOpen,
}: {
  project: Project;
  i: number;
  fan: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: 220, damping: 26, mass: 0.5 });
  const sTiltY = useSpring(tiltY, { stiffness: 220, damping: 26, mass: 0.5 });

  /* Shadow dinamis: offset berlawanan arah tilt + makin pekat saat miring */
  const shadowX = useTransform(sTiltY, (v) => -v * 1.7);
  const shadowY = useTransform(sTiltX, (v) => v * 1.7 + 16);
  const shadowBlur = useTransform(
    [sTiltX, sTiltY],
    ([a, b]: number[]) => 26 + (Math.abs(a) + Math.abs(b)) * 1.3
  );
  const shadowOpacity = useTransform(
    [sTiltX, sTiltY],
    ([a, b]: number[]) => 0.07 + ((Math.abs(a) + Math.abs(b)) / 14) * 0.22
  );
  const cardShadow = useMotionTemplate`${shadowX}px ${shadowY}px ${shadowBlur}px -4px rgba(2,6,23,${shadowOpacity})`;

  /* Edge-light: sisi yang menghadap kursor menyala (kanan saat tiltY>0) */
  const rightGlow = useTransform(sTiltY, [0, 8], [0, 1]);
  const leftGlow = useTransform(sTiltY, [-8, 0], [1, 0]);

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 10);
    tiltX.set(-py * 8);
  }
  function onLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="OPEN"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      whileHover={{ y: -12, rotate: 0, scale: 1.03 }}
      style={{
        rotate: fan,
        rotateX: reduce ? 0 : sTiltX,
        rotateY: reduce ? 0 : sTiltY,
        transformPerspective: 1000,
        boxShadow: cardShadow,
      }}
      className={`group relative w-[min(86vw,22rem)] shrink-0 snap-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-colors duration-300 hover:z-20 hover:border-primary-500/40 lg:w-72 dark:border-slate-800 dark:bg-slate-900 ${
        i === 0 ? "" : "lg:-ml-32"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-125"
        />
        {/* Duotone split saat hover (cyan/magenta chromatic aberration) */}
        <div
          aria-hidden="true"
          className="duotone absolute inset-0"
          style={{ "--duotone-img": `url(${project.image})` } as React.CSSProperties}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-primary-400/30 bg-slate-950/60 px-2 py-1 font-mono text-[10px] tracking-wider text-primary-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          PRJ-{String(i + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-3 left-3 font-mono text-xs tracking-widest text-white/80">
          0{i + 1} / 0{total}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {project.title}
          </h3>
          <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
            {project.tags.slice(0, 3).join(" · ")}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary-500/30 text-primary-500 transition-transform duration-300 group-hover:rotate-45">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>

      {/* Edge-light: sisi yang menghadap kursor menyala */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: reduce ? 0 : rightGlow }}
        className="pointer-events-none absolute inset-y-1 right-0 z-20 w-[3px] rounded-full bg-gradient-to-b from-transparent via-primary-300/90 to-transparent shadow-[0_0_12px_2px_rgba(45,212,191,0.4)]"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: reduce ? 0 : leftGlow }}
        className="pointer-events-none absolute inset-y-1 left-0 z-20 w-[3px] rounded-full bg-gradient-to-b from-transparent via-primary-300/90 to-transparent shadow-[0_0_12px_2px_rgba(45,212,191,0.4)]"
      />
    </motion.button>
  );
}

export function ProjectDeck() {
  const [open, setOpen] = useState<number | null>(null);

  const close = () => setOpen(null);
  const step = (dir: 1 | -1) =>
    setOpen((cur) => (cur === null ? cur : (cur + dir + total) % total));

  useEffect(() => {
    if (open === null) return;
    // Kunci scroll latar selama modal terbuka
    stopSmoothScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      startSmoothScroll();
    };
  }, [open]);

  const active = open !== null ? projects[open] : null;

  return (
    <>
      {/* Deck: fan kartu (desktop) / snap carousel (mobile & md) */}
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-0 lg:overflow-visible lg:pb-0">
        {projects.map((project, i) => {
          const fan = (i - (total - 1) / 2) * 2.4;
          return (
            <DeckCard
              key={project.id}
              project={project}
              i={i}
              fan={fan}
              onOpen={() => setOpen(i)}
            />
          );
        })}
      </div>

      {/* Modal work index */}
      <AnimatePresence>
        {active && open !== null && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-primary-500/25 bg-white shadow-2xl shadow-primary-500/10 dark:bg-slate-900"
            >
              {/* Header terminal */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 font-mono text-[10px] text-slate-400">
                    proyek_0{open + 1}.tsx — {active.id}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={close}
                  data-cursor="CLOSE"
                  aria-label="Tutup"
                  autoFocus
                  className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 font-mono text-xs text-slate-500 transition-colors hover:border-primary-500/40 hover:text-primary-500 dark:border-slate-700 dark:text-slate-400"
                >
                  ✕
                </button>
              </div>

              {/* Isi */}
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="relative aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.3em] text-primary-300">
                    PRJ-{String(open + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {active.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
                    {active.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {active.liveUrl && (
                      <a
                        href={active.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/25 transition-shadow hover:shadow-primary-500/40"
                      >
                        Buka Demo
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                    {active.repoUrl && (
                      <a
                        href={active.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-primary-500/40 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary-300"
                      >
                        Lihat Kode
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigasi prev/next */}
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-slate-500 transition-colors hover:text-primary-500 dark:text-slate-400"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  PREV
                </button>
                <span className="font-mono text-xs tracking-widest text-slate-400">
                  0{open + 1} / 0{total}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-slate-500 transition-colors hover:text-primary-500 dark:text-slate-400"
                >
                  NEXT
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
