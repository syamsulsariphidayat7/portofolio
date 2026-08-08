interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-primary-500/25 bg-primary-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary-700 backdrop-blur-sm dark:text-primary-300">
      <span className="text-slate-400/70">[</span>
      {children}
      <span className="text-slate-400/70">]</span>
    </span>
  );
}
