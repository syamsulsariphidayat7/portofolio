interface GlitchTextProps {
  text: string;
  className?: string;
  /** Glitch berjalan otomatis berkala (bukan hanya saat hover) */
  auto?: boolean;
}

/** Teks dengan efek glitch: layer RGB bergeser saat hover, atau otomatis berkala. */
export function GlitchText({ text, className = "", auto = false }: GlitchTextProps) {
  return (
    <span
      data-text={text}
      className={`${auto ? "glitch-auto" : "glitch-hover"} relative inline-block ${className}`}
    >
      {text}
    </span>
  );
}
