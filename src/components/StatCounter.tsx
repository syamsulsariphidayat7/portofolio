"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Stat {
  label: string;
  value: number;
}

interface StatCounterProps {
  items: Stat[];
}

function StatItem({ item, index }: { item: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <span className="block text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">
        {isInView ? item.value : 0}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {item.label}
      </span>
    </motion.div>
  );
}

export function StatCounter({ items }: StatCounterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
      {items.map((item, index) => (
        <StatItem key={item.label} item={item} index={index} />
      ))}
    </div>
  );
}
