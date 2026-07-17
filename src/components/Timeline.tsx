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
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary-500 dark:bg-primary-400 ring-4 ring-white dark:ring-slate-950 z-10" />
      {!isLast && (
        <div className="absolute left-[5px] top-4 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
      )}
      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
        {item.year}
      </span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
        {item.title}
      </h3>
      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
        {item.company}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
        {item.description}
      </p>
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
