interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}>
      <span className="inline-flex items-center gap-3 font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
        <span className="h-px w-8 bg-gradient-to-r from-primary-500 to-transparent" />
        {eyebrow}
        {centered && <span className="h-px w-8 bg-gradient-to-l from-primary-500 to-transparent" />}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
}
