"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { DecryptText } from "./DecryptText";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { projects, type Project } from "@/content/projects";

const FEATURED = projects.slice(0, 2);

/* Amplitudo maksimum rotateY pass-through (derajat). Dipakai bersama oleh
   keyframe rotasi dan rentang shadow dinamis agar selalu sinkron. */
const TILT_AMP = 10;

/* ------------------------------------------------------------------ */
/* Kartu showcase besar (dengan dock-focus + reveal scrubbed)          */
/* ------------------------------------------------------------------ */
function ShowcaseCard({
  project,
  index,
  centerP,
  progress,
}: {
  project: Project;
  index: number;
  centerP: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();

  /* Jendela "waktu" per kartu BERLABUH ke progress saat kartu benar-benar
     berada di tengah layar (diukur dari posisi track). Dijaga selalu dalam
     [0,1], lebar cukup, dan naik monoton — Motion 12 menuntut offset
     keyframe WAAPI non-decreasing & dalam rentang. centerP di-clamp karena
     kartu terakhir kadang tak pernah mencapai tengah pada layar lebar. */
  const cP = Math.min(0.85, Math.max(0.15, centerP));
  const winStart = Math.max(0, cP - 0.3);
  const winEnd = Math.min(1, cP + 0.12);
  const local = useTransform(progress, [winStart, winEnd], [0, 1]);

  /* Reveal gambar scrubbed: terbuka penuh sesaat SEBELUM kartu di tengah,
     sehingga kartu tak pernah melintas dalam keadaan tertutup. String inset()
     disusun via useMotionTemplate dari angka (aman dari error WAAPI). */
  const clipPct = useTransform(local, [0, 0.45], [100, 0]);
  const clipPath = useMotionTemplate`inset(${clipPct}% 0% 0% 0%)`;
  /* Parallax gambar di dalam bingkai saat kartu melintas (angka → template) */
  const imgPct = useTransform(local, [0.15, 0.5, 0.85], [-8, 0, 8]);
  const translateY = useMotionTemplate`${imgPct}%`;
  /* Dock-focus ala Apple: kartu membesar saat melewati tengah layar */
  const focus = useTransform(local, [0.2, 0.5, 0.8], [1, 1.06, 1]);

  /* ---- 3D pass-through: kartu "menghadap" penonton saat melintas tengah ----
     rotateY berputar +12° → 0° (flat) → −12° seiring kartu melewati layar,
     dalam perspektif nyata. Ditambah tilt halus mengikuti mouse (rotateX/Z). */
  const rotY = useTransform(local, [0, 0.3, 0.5, 0.7, 1], [0, TILT_AMP, 0, -TILT_AMP, 0]);

  /* ---- Shadow dinamis: bayangan bergeser berlawanan arah rotasi + glow ----
     Digerakkan rotY yang sama → sinkron dengan pass-through. Semakin miring,
     bayangan makin jauh & pekat, glow teal makin terang (cahaya menyapu tepi). */
  const shadowX = useTransform(rotY, [-TILT_AMP, 0, TILT_AMP], [22, 0, -22]);
  const shadowBlur = useTransform(rotY, (v) => 34 + Math.abs(v) * 1.4);
  const shadowOpacity = useTransform(rotY, (v) => 0.06 + (Math.abs(v) / 10) * 0.16);
  const glowBlur = useTransform(rotY, (v) => 16 + Math.abs(v) * 0.9);
  const glowOpacity = useTransform(rotY, (v) => 0.05 + (Math.abs(v) / 10) * 0.13);
  const cardShadow = useMotionTemplate`${shadowX}px 30px ${shadowBlur}px -6px rgba(2,6,23,${shadowOpacity}), 0 0 ${glowBlur}px rgba(45,212,191,${glowOpacity})`;

  /* ---- Edge-light: strip cahaya pada sisi kartu yang MENGHADAP penonton ----
     rotY > 0 (tepi kanan maju) → strip kanan menyala; rotY < 0 → strip kiri.
     Datar di tengah → keduanya padam. Menyala progresif = kesan menyapu. */
  const rightGlow = useTransform(rotY, [0, TILT_AMP], [0, 1]);
  const leftGlow = useTransform(rotY, [-TILT_AMP, 0], [1, 0]);

  /* Specular glare: kilau radial mengikuti kursor (pola sama dgn TiltCard) */
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sgx = useSpring(gx, { stiffness: 150, damping: 22 });
  const sgy = useSpring(gy, { stiffness: 150, damping: 22 });
  const glare = useMotionTemplate`radial-gradient(460px circle at ${sgx}% ${sgy}%, rgba(255,255,255,0.16), transparent 62%)`;

  const tiltX = useMotionValue(0);
  const tiltZ = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 220, damping: 26, mass: 0.5 });
  const smoothTiltZ = useSpring(tiltZ, { stiffness: 220, damping: 26, mass: 0.5 });

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltX.set(-py * 7);
    tiltZ.set(px * 3);
    gx.set((px + 0.5) * 100);
    gy.set((py + 0.5) * 100);
  }
  function onLeave() {
    tiltX.set(0);
    tiltZ.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <motion.article
      data-cursor="VIEW"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        scale: reduce ? 1 : focus,
        rotateY: reduce ? 0 : rotY,
        rotateX: reduce ? 0 : smoothTiltX,
        rotateZ: reduce ? 0 : smoothTiltZ,
        transformPerspective: 1500,
        boxShadow: cardShadow,
      }}
      className="group relative flex h-[62vh] min-h-[26rem] w-[82vw] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white will-change-transform sm:w-[62vw] lg:w-[44vw] dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Garis neon atas */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary-500/70 to-transparent" />
      {/* Sudut HUD */}
      <span aria-hidden="true" className="absolute left-3 top-3 z-10 h-4 w-4 border-l-2 border-t-2 border-primary-400/70" />
      <span aria-hidden="true" className="absolute right-3 top-3 z-10 h-4 w-4 border-r-2 border-t-2 border-primary-400/70" />
      <span aria-hidden="true" className="absolute bottom-3 left-3 z-10 h-4 w-4 border-b-2 border-l-2 border-primary-400/70" />
      <span aria-hidden="true" className="absolute bottom-3 right-3 z-10 h-4 w-4 border-b-2 border-r-2 border-primary-400/70" />

      {/* Nomor ghost */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-6 z-0 select-none font-mono text-[9rem] font-black leading-none text-primary-500/10 dark:text-primary-400/10"
      >
        0{index + 1}
      </span>

      {/* Edge-light: strip cahaya menyapu sisi yang menghadap saat pass-through */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: reduce ? 0 : rightGlow }}
        className="pointer-events-none absolute inset-y-2 right-0 z-20 w-[3px] rounded-full bg-gradient-to-b from-transparent via-primary-300/90 to-transparent shadow-[0_0_14px_2px_rgba(45,212,191,0.45)]"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: reduce ? 0 : leftGlow }}
        className="pointer-events-none absolute inset-y-2 left-0 z-20 w-[3px] rounded-full bg-gradient-to-b from-transparent via-primary-300/90 to-transparent shadow-[0_0_14px_2px_rgba(45,212,191,0.45)]"
      />

      {/* Specular glare: kilau menyusuri permukaan mengikuti kursor */}
      <motion.div
        aria-hidden="true"
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Gambar dengan reveal scrubbed */}
      <motion.div
        style={{ clipPath: reduce ? "inset(0% 0% 0% 0%)" : clipPath }}
        className="relative flex-1 overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div style={{ translateY: reduce ? "0%" : translateY }} className="h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-[1.16]"
            />
          </motion.div>
        </div>
        {/* Duotone split saat hover (cyan/magenta chromatic aberration) */}
        <div
          aria-hidden="true"
          className="duotone absolute inset-0"
          style={{ "--duotone-img": `url(${project.image})` } as React.CSSProperties}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md border border-primary-400/30 bg-slate-950/60 px-2 py-1 font-mono text-[10px] tracking-wider text-primary-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          PRJ-0{index + 1}
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.3em] text-white/70">
          ID:0x0{index + 1}
        </span>
      </motion.div>

      {/* Konten */}
      <div className="relative z-[1] border-t border-slate-200/70 bg-white/85 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {project.description}
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3.5 dark:border-slate-800">
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
          <span className="ml-auto font-mono text-[11px] text-slate-400">
            {project.tags.length} tech
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Section utama: pinned horizontal scroll                             */
/* ------------------------------------------------------------------ */
export function HorizontalProjects() {
  const reduce = useReducedMotion();
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [centers, setCenters] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (range > 0 && centers.length === FEATURED.length) {
      /* Kartu dengan progress-tengah terdekat → readout 01/03 akurat */
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const d = Math.abs(v - centers[i]);
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      setIdx(best);
    } else {
      setIdx(Math.min(FEATURED.length - 1, Math.max(0, Math.round(v * (FEATURED.length - 1)))));
    }
  });

  /* Ukur jarak geser track + posisi tengah tiap kartu. Posisi tengah dipakai
     sebagai jangkar jendela reveal per kartu — kartu terakhir (ke-3) tidak
     lagi melintas dalam keadaan tertutup. */
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const winW = window.innerWidth;
      const trackRect = track.getBoundingClientRect();
      setRange(Math.max(0, track.scrollWidth - winW));
      const cs: number[] = [];
      for (let i = 0; i < FEATURED.length; i++) {
        const el = track.children[i] as HTMLElement | undefined;
        if (!el) break;
        const r = el.getBoundingClientRect();
        /* Progress saat kartu benar-benar di TENGAH LAYAR:
           (pusat kartu di track − setengah viewport) / range, di-clamp [0,1]. */
        const centered =
          (r.left - trackRect.left + r.width / 2 - winW / 2) /
          Math.max(1, track.scrollWidth - winW);
        cs.push(Math.min(1, Math.max(0, centered)));
      }
      setCenters(cs);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Fallback untuk prefers-reduced-motion: grid biasa */
  if (reduce) {
    return (
      <section id="work" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <SectionHeading
            eyebrow="// karya terpilih"
            title={
              <>
                Proyek <span className="text-gradient">Unggulan</span>
              </>
            }
            description="Beberapa proyek yang baru saja saya kerjakan — dari aplikasi full-stack hingga alat berbasis AI."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FEATURED.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/projects" variant="outline">
              Lihat Semua Proyek
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={targetRef} className="relative h-[165vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-24">
        {/* Dekorasi latar */}
        <div
          aria-hidden="true"
          className="cyber-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Header overlay */}
        <div className="pointer-events-none absolute left-[6vw] top-20 z-10 lg:top-24">
          <p className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
            <span className="text-slate-400">[</span> // karya terpilih{" "}
            <span className="text-slate-400">]</span>
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Proyek <span className="text-gradient">Unggulan</span>
          </h2>
          <p className="mt-2 font-mono text-[11px] tracking-[0.25em] text-slate-400">
            SCROLL <span className="text-primary-500">▸</span> telusuri arsip
          </p>
        </div>

        {/* Track kartu */}
        <div ref={trackRef} className="flex w-max items-center gap-8 pl-[6vw] pr-[16vw] lg:gap-12">
          {FEATURED.map((project, index) => (
            <ShowcaseCard
              key={project.id}
              project={project}
              index={index}
              progress={scrollYProgress}
              centerP={
                centers[index] !== undefined
                  ? centers[index]
                  : (index + 0.5) / FEATURED.length
              }
            />
          ))}

          {/* Panel CTA penutup */}
          <a
            href="/projects"
            data-cursor="OPEN"
            className="group relative flex h-[62vh] min-h-[26rem] w-[78vw] shrink-0 flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-primary-500/25 bg-gradient-to-br from-primary-600/10 via-transparent to-teal-500/10 p-8 text-center sm:w-[44vw] lg:w-[30vw]"
          >
            <div aria-hidden="true" className="circuit pointer-events-none absolute inset-0 opacity-40" />
            <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
            <p className="font-mono text-xs tracking-widest text-primary-600 dark:text-primary-400">
              &gt; buka semua proyek
            </p>
            <h3 className="text-2xl font-bold leading-snug text-slate-900 dark:text-slate-100">
              Lihat
              <br />
              Arsip <span className="text-gradient"><DecryptText text="Lengkap" /></span>
            </h3>
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/25 transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-primary-500/40">
              {projects.length} Proyek
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </a>
        </div>

        {/* Progress bar + index */}
        <div className="absolute bottom-6 z-10 left-[6vw] right-[6vw] lg:left-[24vw]">
          <div className="mx-auto flex max-w-3xl items-end justify-between font-mono text-[11px] tracking-[0.25em] text-slate-400">
            <span>
              SCROLL <span className="text-primary-500">▸</span>
            </span>
            <span className="text-primary-600 dark:text-primary-400">
              0{idx + 1} / 0{FEATURED.length}
            </span>
          </div>
          <div className="mx-auto mt-2 h-px max-w-3xl bg-slate-300/60 dark:bg-slate-700/60">
            <motion.div
              style={{ scaleX: barScale }}
              className="h-px origin-left bg-primary-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
