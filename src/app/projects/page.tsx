import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Proyek — Syamsul",
};

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-20">
      <AnimatedSection>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-primary-600 dark:text-primary-400 font-medium mb-2 uppercase text-sm tracking-wider">
            Proyek
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Karya Saya
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Kumpulan proyek yang telah saya bangun, dari aplikasi full-stack
            hingga alat open-source.
          </p>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
