import { HeroSection } from "@/components/HeroSection";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillBar } from "@/components/SkillBar";
import { Timeline } from "@/components/Timeline";
import { StatCounter } from "@/components/StatCounter";
import { Button } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { personal } from "@/content/personal";

export default function Home() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <HeroSection />

      <section id="work">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-primary-600 dark:text-primary-400 font-mono font-medium mb-2 text-sm">
                {'// karya terpilih'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Proyek Unggulan
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Beberapa proyek yang baru saja saya kerjakan.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button href="/projects" variant="outline">
                Lihat Semua Proyek &rarr;
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <AnimatedSection>
            <StatCounter items={personal.stats} />
          </AnimatedSection>
        </div>
      </section>

      <section id="about">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24 border-t border-slate-200 dark:border-slate-800">
          <AnimatedSection>
            <p className="text-primary-600 dark:text-primary-400 font-mono font-medium mb-2 text-sm">
              {'// tentang'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Tentang Saya
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
              {personal.bio}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Keahlian
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {personal.skills.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  index={index}
                />
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Pengalaman
            </h3>
            <Timeline items={personal.timeline} />
          </AnimatedSection>
        </div>
      </section>

      <section id="contact">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24 border-t border-slate-200 dark:border-slate-800">
            <p className="text-primary-600 dark:text-primary-400 font-mono font-medium mb-2 text-sm">
              {'// kontak'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Hubungi Saya
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-12">
              Ada proyek atau hanya ingin menyapa? Kirim pesan!
            </p>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex flex-col items-start justify-center gap-6 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-primary-600 dark:text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Kirim Email Langsung
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Klik tombol di bawah untuk membuka aplikasi email kamu dan langsung
                    mengirim pesan ke inbox saya.
                  </p>
                </div>
                <Button
                  href={`mailto:${personal.email}?subject=${encodeURIComponent(
                    "Halo Syamsul — dari portofolio",
                  )}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                  Kirim Email
                </Button>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  $ mail {personal.email}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Email
                  </h3>
                  <a
                    href={`mailto:${personal.email}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                  >
                    $ mail {personal.email}
                  </a>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    WhatsApp
                  </h3>
                  <a
                    href={`https://wa.me/${personal.phone.replace(/^0/, "62")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
                  >
                    $ wa {personal.phone}
                  </a>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Lokasi
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {personal.location}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Sosial Media
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={personal.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all"
                      aria-label="GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href={personal.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href={personal.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
