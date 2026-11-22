"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectIndex } from "@/components/ProjectIndex";
import { HologramGlobe } from "@/components/HologramGlobe";
import { HudFrame } from "@/components/HudFrame";
import { Button } from "@/components/ui/Button";
import { personal } from "@/content/personal";
import { useLang } from "@/lib/i18n";

/**
 * Isi halaman /projects sebagai komponen klien supaya bisa memakai
 * kamus bahasa (useLang). page.tsx tetap server demi metadata.
 */
export function ProjectsBody() {
  const { t } = useLang();
  return (
    <div className="pb-20 pt-24">
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Globe hologram interaktif — dekorasi sisi kanan heading */}
        <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:right-10 lg:block">
          <div className="animate-float">
            <HologramGlobe
              draggable
              className="h-28 w-28 drop-shadow-[0_0_18px_rgba(45,212,191,0.35)]"
            />
          </div>
        </div>
        <AnimatedSection>
          <SectionHeading
            eyebrow={t.projectsPage.eyebrow}
            title={
              <>
                {t.projectsPage.titleA}{" "}
                <span className="text-gradient">{t.projectsPage.titleB}</span>
              </>
            }
            description={t.projectsPage.desc}
            align="left"
          />
        </AnimatedSection>
      </section>

      <AnimatedSection delay={0.1}>
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <ProjectIndex />
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <HudFrame label="CHANNEL // OPEN" className="h-full">
            <div className="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-transparent to-teal-500/10 p-8 text-center sm:p-12">
              <div aria-hidden="true" className="circuit pointer-events-none absolute inset-0 opacity-50" />
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
              <p className="font-mono text-xs tracking-widest text-primary-600 dark:text-primary-400">
                <span className="text-slate-400">[</span> INITIATE // CHANNEL OPEN{" "}
                <span className="text-slate-400">]</span>
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                {t.projectsPage.collabTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
                {t.projectsPage.collabBody}
              </p>
              <div className="mt-6">
                <Button href={`mailto:${personal.email}?subject=${encodeURIComponent(t.projectsPage.collabSubject)}`}>
                  {t.footer.startChat}
                </Button>
              </div>
            </div>
          </HudFrame>
        </section>
      </AnimatedSection>
    </div>
  );
}
