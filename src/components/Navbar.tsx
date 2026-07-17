"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { personal } from "@/content/personal";

const links = [
  { href: "/#work", label: "Karya" },
  { href: "/#about", label: "Tentang" },
  { href: "/projects", label: "Proyek" },
  { href: "/#contact", label: "Kontak" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight"
        >
          {personal.brand}
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
