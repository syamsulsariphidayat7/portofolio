"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/Badge";
import { stopSmoothScroll, startSmoothScroll } from "./SmoothScroll";
import { projects, type Project } from "@/content/projects";
import { useLang, useProjectText } from "@/lib/i18n";

const total = projects.length;

/* ------------------------------------------------------------------ */
/* Baris index: satu proyek satu baris — nomor, thumbnail, judul,     */
/* ringkasan, tag, panah. Menggantikan deck kipas (22 Nov 2026 atas   */
/* pilihan Syamsul): daftar harus bisa di-scan sekilas, tanpa tilt    */
/* 3D dan tanpa kartu bertumpuk. Klik baris membuka modal detail.     */
/* ------------------------------------------------------------------ */
function IndexRow({
  project,
  i,
  onOpen,
}: {
  project: Project;
  i: number;
  onOpen: () => void;
}) {
  const text = useProjectText(project);
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="OPEN"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: i * 0.05 }}
      className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-200 hover:bg-primary-500/5 sm:gap-6 sm:px-6"
    >
      <span className="w-8 shrink-0 font-mono text-sm font-medium text-primary-500">
        {String(i + 1).padStart(2, "0")}
      </span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className="h-12 w-[4.5rem] shrink-0 rounded-lg object-cover sm:h-14 sm:w-24"
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-primary-500 dark:text-slate-100">
          {text.title}
        </span>
        <span className="mt-0.5 block truncate text-sm text-slate-500 dark:text-slate-400">
          {text.description}
        </span>
        <span className="mt-1 block truncate font-mono text-[11px] tracking-wide text-slate-400">
          {project.tags.slice(0, 4).join(" · ")}
        </span>
      </span>

      <span className="hidden shrink-0 font-mono text-[11px] tracking-widest text-slate-400 md:block">
        PRJ-{String(i + 1).padStart(2, "0")}
      </span>

      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary-500/30 text-primary-500 transition-transform duration-300 group-hover:rotate-45">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </motion.button>
  );
}

export function ProjectIndex() {
  const { t } = useLang();
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
  }, [open ]);

  const active = open !== null ? projects[open] : null;
  const activeText = useProjectText(active ?? projects[0]);

  return (
    <>
      {/* Kepala index */}
      <div className="flex items-center justify-between px-1 pb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
        <span>{t.projectsPage.indexHead}</span>
        <span>
          {String(total).padStart(2, "0")} {t.projectsPage.items}
        </span>
      </div>

      {/* List baris */}
      <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white/60 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40">
        {projects.map((project, i) => (
          <IndexRow
            key={project.id}
            project={project}
            i={i}
            onOpen={() => setOpen(i)}
          />
        ))}
      </div>

      {/* Modal detail proyek */}
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
                    alt={activeText.title}
                    className="h-full w-full object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.3em] text-primary-300">
                    PRJ-{String(open + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {activeText.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
                    {activeText.description}
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
                        {t.projectsPage.demo}
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
                        {t.projectsPage.code}
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
