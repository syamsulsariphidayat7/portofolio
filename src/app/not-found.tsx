"use client";

import { Button } from "@/components/ui/Button";
import { GlitchText } from "@/components/GlitchText";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden="true"
        className="cyber-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      />
      <div className="relative text-center">
        <p className="font-mono text-sm font-medium tracking-widest text-primary-600 dark:text-primary-400">
          <span className="text-slate-400">[</span> ERROR 404{" "}
          <span className="text-slate-400">{"//"}</span> SIGNAL LOST{" "}
          <span className="text-slate-400">]</span>
        </p>
        <h1 className="mt-4 text-8xl font-bold tracking-tighter sm:text-9xl">
          <GlitchText text="404" auto className="text-gradient-animate" />
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          {t.notFound.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md font-mono text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <span className="text-primary-500">&gt;</span> request: resource
          <br />
          <span className="text-primary-500">&gt;</span> status:{" "}
          <span className="text-red-500">404_NOT_FOUND</span>
          <br />
          {t.notFound.body}
        </p>
        <div className="mt-8">
          <Button href="/">
            <span className="font-mono">&lt;- REBOOT // {t.notFound.back}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
