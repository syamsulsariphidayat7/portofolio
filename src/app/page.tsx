import { HeroSection } from "@/components/HeroSection";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/Marquee";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { AboutScrolly } from "@/components/AboutScrolly";
import { StatCounter } from "@/components/StatCounter";
import dynamic from "next/dynamic";

/* WebGL 3D (three.js) di-code-split — chunk sama dgn yang dipakai hero */
const Starfield3D = dynamic(() =>
  import("@/components/Starfield3D").then((m) => m.Starfield3D),
);
import { Parallax } from "@/components/Parallax";
import { TiltCard } from "@/components/TiltCard";
import { Float3D } from "@/components/Float3D";
import { HudFrame } from "@/components/HudFrame";
import { RevealText } from "@/components/RevealText";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/SocialLinks";
import { personal } from "@/content/personal";

const marqueeItems = [
  "Next.js",
  "0x1F6A",
  "React",
  "0xA5",
  "TypeScript",
  "0x7E4C",
  "Node.js",
  "Tailwind CSS",
  "0x3F2B",
  "PostgreSQL",
  "Prisma",
  "GraphQL",
  "0xB9",
  "Docker",
  "Laravel",
  "Livewire",
  "Filament",
  "Figma",
  "CI/CD",
  "REST API",
  "Vercel",
];

const services = [
  {
    title: "Web Application",
    description:
      "Aplikasi web modern, responsif, dan cepat — dibangun dengan Next.js, React, dan TypeScript.",
    tags: ["Next.js", "React", "TypeScript"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
  },
  {
    title: "Backend & API",
    description:
      "API yang cepat, aman, dan skalabel dengan Node.js, Laravel, dan PostgreSQL.",
    tags: ["Node.js", "Laravel", "PostgreSQL"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    title: "UI/UX Design",
    description:
      "Dari Figma menjadi antarmuka yang hidup, intuitif, dan menyenangkan untuk dipakai.",
    tags: ["Figma", "Tailwind", "Framer Motion"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    ),
  },
  {
    title: "Optimasi & DevOps",
    description:
      "Performa tinggi, deployment otomatis, dan infrastruktur yang andal untuk produksi.",
    tags: ["Docker", "CI/CD", "Vercel"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
];

const contactInfo = [
  {
    label: "Email",
    value: personal.email,
    href: `mailto:${personal.email}`,
    mono: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    value: personal.phone,
    href: `https://wa.me/${personal.phone.replace(/^0/, "62")}`,
    mono: true,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Lokasi",
    value: personal.location,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
  },
  {
    label: "Website",
    value: personal.domain,
    href: `https://${personal.domain}`,
    mono: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
];


export default function Home() {
  return (
    <>
      <HeroSection />
      <Marquee items={marqueeItems} />

      {/* ===== KARYA — horizontal scroll showcase (teknik scrollytelling awwwards) ===== */}
      <HorizontalProjects />

      {/* ===== LAYANAN ===== */}
      <section id="services" className="relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
        <Parallax speed={80} scale={1.18} fade className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <Parallax speed={-100} scale={1.22} fade className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
        {/* Ornamen wireframe 3D melayang (parallax scroll + rotasi) */}
        <Parallax speed={110} rotate={30} fade className="pointer-events-none absolute -right-14 top-20 hidden opacity-60 md:block">
          <Float3D variant="rings" size={120} />
        </Parallax>
        <Parallax speed={-70} rotate={-40} className="pointer-events-none absolute -left-8 bottom-28 hidden opacity-50 md:block">
          <Float3D variant="cube" size={76} />
        </Parallax>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <AnimatedSection>
            <SectionHeading
              eyebrow="// layanan"
              title={
                <>
                  Yang Saya <span className="text-gradient">Kerjakan</span>
                </>
              }
              description="Dari ide hingga produksi — saya membantu membangun produk digital yang berdampak."
            />
          </AnimatedSection>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.08} className="h-full">
                <TiltCard
                  intensity={6}
                  className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 text-white shadow-[0_0_24px_rgba(20,184,166,0.35)] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {service.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section id="about" className="relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
        <Parallax speed={-90} scale={1.2} fade className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
        <Parallax speed={95} rotate={35} className="pointer-events-none absolute -left-10 top-16 hidden opacity-50 md:block">
          <Float3D variant="cube" size={90} />
        </Parallax>
        <Parallax speed={-60} rotate={-45} className="pointer-events-none absolute right-[12%] bottom-16 hidden opacity-45 lg:block">
          <Float3D variant="rings" size={70} />
        </Parallax>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <AnimatedSection>
            <SectionHeading
              eyebrow="// tentang"
              title={
                <>
                  Tentang <span className="text-gradient">Saya</span>
                </>
              }
              description={personal.bio}
              align="left"
            />
          </AnimatedSection>

          <AboutScrolly />
        </div>
      </section>

      {/* ===== STATISTIK ===== */}
      <section id="stats" className="relative overflow-hidden border-y border-slate-200 bg-gradient-to-r from-primary-500/5 via-transparent to-teal-500/5 dark:border-slate-800">
        <div aria-hidden="true" className="cyber-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        {/* WebGL data-core: partikel bintang + icosahedron wireframe (konsisten dgn hero) */}
        <Starfield3D
          corePosition={[0, 0.6, -2]}
          className="z-0 opacity-90 dark:opacity-100 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_25%,transparent_78%)]"
        />
        {/* Parallax: -ml-72/-mt-72 dipakai karena framer-motion menulis transform
            inline (y/scale) yang menimpa translate Tailwind — margin tidak bentrok */}
        <Parallax speed={60} scale={1.25} fade className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -ml-72 -mt-72">
          <div
            aria-hidden="true"
            className="animate-spin-slow h-full w-full rounded-full border border-dashed border-primary-500/15"
          />
        </Parallax>
        <div className="relative z-[1] mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <AnimatedSection>
            <p className="mb-8 text-center font-mono text-[11px] tracking-[0.3em] text-slate-400">
              <span className="text-primary-500">[</span> SYSTEM.DATA{" "}
              <span className="text-primary-500">{"//"}</span> REAL-TIME{" "}
              <span className="text-primary-500">]</span>
            </p>
            <StatCounter items={personal.stats} />
          </AnimatedSection>
        </div>
      </section>

      {/* ===== KONTAK ===== */}
      <section id="contact" className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <Parallax speed={100} scale={1.18} fade className="pointer-events-none absolute -left-28 top-32 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <Parallax speed={-60} scale={1.22} fade className="pointer-events-none absolute -right-28 bottom-40 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
        <Parallax speed={-85} rotate={40} fade className="pointer-events-none absolute right-[8%] top-24 hidden opacity-50 lg:block">
          <Float3D variant="rings" size={88} />
        </Parallax>
        <Parallax speed={120} rotate={-50} className="pointer-events-none absolute bottom-24 left-[6%] hidden opacity-40 md:block">
          <Float3D variant="cube" size={56} />
        </Parallax>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <AnimatedSection>
            <SectionHeading
              eyebrow="// kontak"
              title={
                <>
                  Hubungi <span className="text-gradient">Saya</span>
                </>
              }
              description="Ada proyek menarik atau ingin berkolaborasi? Saya selalu terbuka untuk obrolan."
            />
          </AnimatedSection>

          <div className="mt-14 grid gap-8 lg:grid-cols-5">
            {/* CTA besar */}
            <AnimatedSection className="lg:col-span-3">
              <TiltCard intensity={4} glare={false} className="h-full">
                <HudFrame label="TRANSMISSION // SECURE" cornerClassName="border-primary-100/70" className="h-full">
                  <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-teal-600 to-primary-700 p-8 text-white shadow-2xl shadow-primary-500/25 sm:p-12 dark:from-primary-500 dark:via-teal-500 dark:to-primary-600">
                    <div aria-hidden="true" className="circuit pointer-events-none absolute inset-0 opacity-60" />
                    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-slate-950/20 blur-3xl" />
                    <p className="font-mono text-sm text-primary-100">
                      &gt; contact --initiate --secure
                      <span className="animate-blink text-white">▌</span>
                    </p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                    <RevealText text="Punya ide menarik? Mari wujudkan bersama." />
                  </h3>
                <p className="mt-4 max-w-md leading-relaxed text-primary-50/90">
                  Jangan ragu untuk menyapa — saya biasanya membalas dalam 1x24 jam. Setiap proyek
                  dimulai dari percakapan sederhana.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    href={`mailto:${personal.email}?subject=${encodeURIComponent(
                      "Halo Syamsul — dari portofolio",
                    )}`}
                    variant="light"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    Kirim Email
                  </Button>
                  <Button
                    href={`https://wa.me/${personal.phone.replace(/^0/, "62")}`}
                    variant="glass"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </Button>
                  </div>
                </div>
              </HudFrame>
              </TiltCard>
            </AnimatedSection>

            {/* Info kontak */}
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1 xl:grid-cols-2">
              {contactInfo.map((info, i) => (
                <AnimatedSection key={info.label} delay={0.05 * i} className="h-full">
                  <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-500/10 text-primary-600 transition-colors group-hover:bg-primary-500/20 dark:text-primary-400">
                      {info.icon}
                    </div>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`mt-1 break-all text-sm font-medium text-slate-800 transition-colors hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-400 ${
                          info.mono ? "font-mono" : ""
                        }`}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p
                        className={`mt-1 text-sm font-medium text-slate-800 dark:text-slate-200 ${
                          info.mono ? "font-mono" : ""
                        }`}
                      >
                        {info.value}
                      </p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Sosial media */}
          <AnimatedSection delay={0.15}>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/60 px-6 py-5 backdrop-blur-sm sm:flex-row dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Terhubung juga di media sosial —
              </p>
              <SocialLinks className="gap-3" />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
