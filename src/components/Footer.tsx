import Link from "next/link";
import { personal } from "@/content/personal";
import { VisitorCounter } from "./VisitorCounter";
import { SocialLinks } from "./SocialLinks";
import { Magnetic } from "./Magnetic";
import { DecryptText } from "./DecryptText";
import { Button } from "./ui/Button";

const QUICK_LINKS = [
  { href: "/#work", label: "Karya" },
  { href: "/#about", label: "Tentang" },
  { href: "/projects", label: "Proyek" },
  { href: "/#contact", label: "Kontak" },
];

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-slate-200 dark:border-slate-800">
      <div
        aria-hidden="true"
        className="circuit absolute inset-x-0 top-0 h-10 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/70 to-transparent" />

      {/* Finale layar penuh */}
      <div className="relative flex min-h-[72vh] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl"
        />
        <p className="font-mono text-xs tracking-[0.3em] text-slate-400">
          <span className="text-primary-500">[</span> END OF TRANSMISSION{" "}
          <span className="text-primary-500">]</span>
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-slate-100">
          <DecryptText text="ADA PROYEK?" />
          <br />
          <span className="text-gradient">AYO NGOMONG.</span>
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-slate-500 dark:text-slate-400">
          Jangan ragu kirim pesan — saya selalu terbuka untuk kolaborasi, ide, atau
          sekadar obrolan ringan.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.2}>
            <Button
              href={`mailto:${personal.email}?subject=${encodeURIComponent("Halo Syamsul — dari portofolio")}`}
            >
              Mulai Percakapan
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Magnetic>
          <Magnetic strength={0.2}>
            <Button
              href={`https://wa.me/${personal.phone.replace(/^0/, "62")}`}
              variant="outline"
            >
              WhatsApp
            </Button>
          </Magnetic>
        </div>
        <SocialLinks className="mt-8 gap-3" />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {personal.name}. Hak cipta dilindungi.
          </p>
          <nav className="flex items-center gap-4">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              SYS.CORE v2.1 — ONLINE
            </p>
            <VisitorCounter />
          </div>
        </div>
      </div>
    </footer>
  );
}
