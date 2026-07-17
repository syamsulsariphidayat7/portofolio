"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { personal } from "@/content/personal";

function useActiveSection(sections: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [sections]);

  return active;
}

const links = [
  {
    href: "/#work",
    label: "Karya",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18a2 2 0 01-.128 0 47.5 47.5 0 00-16.5 0A2.003 2.003 0 012 18.4V5.6a2 2 0 012-2h0a4.5 4.5 0 014.5 4.5v.75M20.25 14.15l-3.375-1.35M20.25 14.15l-2.625 1.05M20.25 14.15l1.875-.75a1.875 1.875 0 000-3.45L12 5.4a1.875 1.875 0 00-1.5 0L3.375 8.1a1.875 1.875 0 000 3.45L12 14.85" />
      </svg>
    ),
  },
  {
    href: "/#about",
    label: "Tentang",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Proyek",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    href: "/#contact",
    label: "Kontak",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export function Navbar() {
  const pathname = usePathname();
  const activeSection = useActiveSection(["work", "about", "contact"]);

  function isActive(href: string) {
    if (href === "/projects") return pathname === "/projects";
    if (href === "/#work") return pathname === "/" && activeSection === "work";
    if (href === "/#about") return pathname === "/" && activeSection === "about";
    if (href === "/#contact") return pathname === "/" && activeSection === "contact";
    return false;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight"
          >
            {personal.brand}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0 ${
                isActive(link.href)
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {link.icon}
              <span className="text-[10px] font-medium leading-tight">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
