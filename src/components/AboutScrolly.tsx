"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SkillBar } from "./SkillBar";
import { Timeline } from "./Timeline";
import { personal } from "@/content/personal";

/**
 * Scrollytelling "Tentang": skill bar terisi & timeline menyala mengikuti
 * scroll (scrubbed), bukan sekadar whileInView. Fallback ke reveal biasa
 * saat prefers-reduced-motion.
 */
export function AboutScrolly() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useTransform(scrollYProgress, [0.05, 0.75], [0, 1]);
  const scrubbed = reduce ? undefined : progress;

  return (
    <motion.div
      ref={ref}
      className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Keahlian
          </h3>
          <span className="font-mono text-xs text-slate-400">
            {personal.skills.length} teknologi
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {personal.skills.map((skill, index) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              index={index}
              progress={scrubbed}
              total={personal.skills.length}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
          Pengalaman
        </h3>
        <Timeline
          items={personal.timeline}
          progress={scrubbed}
          total={personal.timeline.length}
        />
      </div>
    </motion.div>
  );
}
