"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

function TimelineEntry({
  item,
  index,
  isLast,
}: {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative pb-10 pl-12 last:pb-0"
    >
      {!isLast && (
        <span className="absolute bottom-0 left-[11px] top-8 w-px bg-gradient-to-b from-primary-500/50 via-slate-200 to-transparent dark:via-slate-800" />
      )}
      <span className="absolute left-0 top-1.5 grid h-6 w-6 place-items-center">
        <span className="animate-pulse-ring absolute h-6 w-6 rounded-full bg-primary-500/20" />
        <span className="relative h-3 w-3 rounded-full bg-gradient-to-br from-primary-500 to-teal-400 ring-2 ring-white dark:ring-slate-950" />
      </span>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 group-hover:border-primary-500/40 group-hover:shadow-lg group-hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-primary-500/10 px-3 py-1 font-mono text-xs font-semibold text-primary-700 dark:text-primary-300">
            {item.year}
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {item.company}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="max-w-2xl">
      {items.map((item, index) => (
        <TimelineEntry
          key={index}
          item={item}
          index={index}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
