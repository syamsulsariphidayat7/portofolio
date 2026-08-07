"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "light" | "glass";
  className?: string;
  [key: string]: unknown;
}

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }, []);

  const base =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-teal-500 text-white hover:shadow-lg hover:shadow-primary-500/30 dark:from-primary-500 dark:to-teal-400 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 group-hover:before:translate-x-full",
    outline:
      "border border-slate-300 text-slate-700 hover:border-primary-400/60 hover:bg-primary-500/5 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary-300",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    light:
      "bg-white text-primary-700 shadow-md shadow-black/10 hover:bg-primary-50 hover:shadow-lg",
    glass: "border border-white/40 text-white backdrop-blur-sm hover:bg-white/10",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const handlers = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return (
      <Link href={href} className={classes} ref={ref as React.Ref<HTMLAnchorElement>} {...handlers}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} ref={ref as React.Ref<HTMLButtonElement>} {...handlers} {...props}>
      {children}
    </button>
  );
}
