"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf = 0;
    const duration = 1300;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * item.value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, item.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative text-center"
    >
      <span className="text-gradient block text-4xl font-bold sm:text-5xl">{value}</span>
      <span className="mt-1.5 block text-sm font-medium text-slate-500 dark:text-slate-400">
        {item.label}
      </span>
    </motion.div>
  );
}

export function StatCounter({ items }: StatCounterProps) {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
      {items.map((item, index) => (
        <StatItem key={item.label} item={item} index={index} />
      ))}
    </div>
  );
}
