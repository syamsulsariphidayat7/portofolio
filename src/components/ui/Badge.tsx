interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/20 bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium text-primary-700 backdrop-blur-sm dark:text-primary-300">
      {children}
    </span>
  );
}
