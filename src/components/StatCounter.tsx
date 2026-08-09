"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

interface Stat {
  label: string;
  value: number;
}

interface StatCounterProps {
  items: Stat[];
}

function StatItem({
  item,
  index,
  progress,
  total,
}: {
  item: Stat;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();

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

  /* Parallax berjenjang: kolom tengah melayang lebih lambat dari tepi
     (kedalaman relatif). Amplitude sengaja kecil agar tetap subtle. */
  const mid = (total - 1) / 2;
  const drift = useTransform(progress, [0, 1], [(index - mid) * -46, (index - mid) * 46]);
  const springDrift = useSpring(drift, { stiffness: 110, damping: 24, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative text-center"
    >
      <motion.div style={{ y: reduce ? 0 : springDrift }}>
        <span className="text-gradient block text-4xl font-bold sm:text-5xl">{value}</span>
        <span className="mt-1.5 block text-sm font-medium text-slate-500 dark:text-slate-400">
          {item.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function StatCounter({ items }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} className="mx-auto grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
      {items.map((item, index) => (
        <StatItem
          key={item.label}
          item={item}
          index={index}
          progress={scrollYProgress}
          total={items.length}
        />
      ))}
    </div>
  );
}
