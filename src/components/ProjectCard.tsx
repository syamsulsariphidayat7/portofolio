"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { Badge } from "./ui/Badge";
import type { Project } from "@/content/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* ---- Tilt 3D halus (spring) ---- */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 20, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20, mass: 0.6 });

  /* ---- Glare spotlight mengikuti kursor ---- */
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(460px circle at ${gx}% ${gy}%, rgba(255,255,255,0.09), transparent 60%)`;

  /* ---- Parallax gambar di dalam bingkai saat scroll ---- */
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 14);
    rx.set((0.5 - py) * 14);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function onMouseLeave() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-primary-500/50 hover:shadow-[0_0_36px_rgba(20,184,166,0.18)] dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Garis neon atas saat hover */}
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary-500/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Sudut HUD */}
        <span aria-hidden="true" className="absolute left-2.5 top-2.5 z-10 h-3 w-3 border-l-2 border-t-2 border-primary-400/60" />
        <span aria-hidden="true" className="absolute right-2.5 top-2.5 z-10 h-3 w-3 border-r-2 border-t-2 border-primary-400/60" />
        {/* Gambar dengan parallax internal */}
        <div className="relative aspect-video shrink-0 overflow-hidden">
          <div className="absolute inset-x-0 -inset-y-[14%] will-change-transform">
            <motion.div style={{ y: reduce ? 0 : imgY }} className="h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="h-full w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-[1.18]"
              />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-primary-400/30 bg-slate-950/60 px-2 py-1 font-mono text-[10px] font-medium tracking-wider text-primary-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            PRJ-{String(index + 1).padStart(2, "0")}
          </span>
          {/* Kilau saat hover */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          {/* Tombol cepat */}
          <div className="absolute bottom-3 right-3 flex translate-y-1 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Demo ${project.title}`}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-primary-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Kode ${project.title}`}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-primary-500"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Konten */}
        <div className="relative flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {project.description}
          </p>
          <div className="mb-5 mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  Demo
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Repo
                </a>
              )}
            </div>
            <span className="font-mono text-xs text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-500">
              &rarr;
            </span>
          </div>
        </div>

        {/* Glare spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
      </motion.div>
    </motion.div>
  );
}
