"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}>
      <motion.span
        initial={{ opacity: 0, x: centered ? 0 : -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 font-mono text-sm font-medium text-primary-600 dark:text-primary-400"
      >
        <span className="h-px w-6 bg-gradient-to-r from-primary-500 to-transparent" />
        <span className="text-slate-400 dark:text-slate-500">[</span>
        {eyebrow}
        <span className="text-slate-400 dark:text-slate-500">]</span>
        {centered && <span className="h-px w-6 bg-gradient-to-l from-primary-500 to-transparent" />}
      </motion.span>
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "115%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
        >
          {title}
        </motion.h2>
      </div>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
