interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className = "" }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className={`group relative select-none overflow-hidden border-y border-slate-200 bg-white/85 py-5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 ${className}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-28 dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-28 dark:from-slate-950" />
      <div className="animate-marquee flex w-max items-center gap-10 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono text-sm font-medium uppercase tracking-wider text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
              {item}
            </span>
            <span className="text-xs text-primary-500/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
