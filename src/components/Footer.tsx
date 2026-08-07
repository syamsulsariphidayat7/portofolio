import Link from "next/link";
import { personal } from "@/content/personal";
import { VisitorCounter } from "./VisitorCounter";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 text-lg font-bold text-white">
                {personal.brand[0]}
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {personal.brand}
                <span className="text-primary-500">.</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {personal.bio}
            </p>
            <div className="mt-4">
              <SocialLinks size="sm" solidHover />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/#work" className="text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                  Karya
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                  Proyek
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Kontak
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href={`mailto:${personal.email}`}
                  className="font-mono transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {personal.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${personal.phone.replace(/^0/, "62")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {personal.phone}
                </a>
              </li>
              <li>{personal.location}</li>
              <li className="font-mono">{personal.domain}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} {personal.name}. Hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            Dibuat dengan <span className="text-primary-500">♥</span> menggunakan Next.js
          </p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
