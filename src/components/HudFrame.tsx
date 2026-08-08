interface HudFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Label kiri atas (mis. "PROFILE // 0x01") */
  label?: string;
  /** Warna bracket sudut */
  cornerClassName?: string;
  size?: "sm" | "md";
}

/** Bingkai HUD dengan 4 bracket sudut + label opsional (estetika sci-fi). */
export function HudFrame({
  children,
  className = "",
  label,
  cornerClassName = "border-primary-500/60",
  size = "sm",
}: HudFrameProps) {
  const len = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const corner = `absolute ${len} ${cornerClassName}`;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <span className="absolute -top-2 left-3 z-10 inline-flex items-center gap-1.5 rounded border border-primary-500/30 bg-white/70 px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest text-primary-600 backdrop-blur-md dark:bg-slate-950/70 dark:text-primary-400">
          {label}
        </span>
      )}
      <span aria-hidden="true" className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
      {children}
    </div>
  );
}
