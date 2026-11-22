"use client";

import { useLang, type Lang } from "@/lib/i18n";

/** Toggle bahasa ID/EN — gaya mono kecil, pasangan ThemeToggle di navbar. */
export function LangToggle() {
  const { lang, setLang } = useLang();

  const option = (value: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      aria-pressed={lang === value}
      className={`rounded px-1 py-0.5 transition-colors ${
        lang === value
          ? "font-semibold text-primary-600 dark:text-primary-400"
          : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Bahasa / Language"
      className="flex items-center font-mono text-xs"
    >
      {option("id", "ID")}
      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
        /
      </span>
      {option("en", "EN")}
    </div>
  );
}
