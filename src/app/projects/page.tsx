import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { HudFrame } from "@/components/HudFrame";
import { Button } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { personal } from "@/content/personal";

export const metadata: Metadata = {
  title: "Proyek — Syamsul",
};

export default function ProjectsPage() {
  return (
    <div className="pb-20 pt-24">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <AnimatedSection>
          <SectionHeading
            eyebrow="// proyek"
            title={
              <>
                Karya <span className="text-gradient">Saya</span>
              </>
            }
            description="Kumpulan proyek yang telah saya bangun — dari aplikasi full-stack hingga alat open-source."
            align="left"
          />
        </AnimatedSection>
      </section>

      <AnimatedSection delay={0.1}>
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
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
                Tertarik berkolaborasi?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
                Punya ide atau proyek yang ingin dibangun? Mari diskusikan bersama.
              </p>
              <div className="mt-6">
                <Button href={`mailto:${personal.email}?subject=${encodeURIComponent("Kolaborasi proyek")}`}>
                  Mulai Percakapan
                </Button>
              </div>
            </div>
          </HudFrame>
        </section>
      </AnimatedSection>
    </div>
  );
}
