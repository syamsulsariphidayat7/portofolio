"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18a2 2 0 01-.128 0 47.5 47.5 0 00-16.5 0A2.003 2.003 0 012 18.4V5.6a2 2 0 012-2h0a4.5 4.5 0 014.5 4.5v.75M20.25 14.15l-3.375-1.35M20.25 14.15l-2.625 1.05M20.25 14.15l1.875-.75a1.875 1.875 0 000-3.45L12 5.4a1.875 1.875 0 00-1.5 0L3.375 8.1a1.875 1.875 0 000 3.45L12 14.85" />
      </svg>
    ),
  },
  {
    href: "/#about",
    label: "Tentang",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Proyek",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    href: "/#contact",
    label: "Kontak",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const sectionIds = ["work", "about", "contact"];

export function Navbar() {
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (y > lastY && y > 140) setHidden(true);
      else setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/projects") return pathname === "/projects";
    if (href === "/#work") return pathname === "/" && activeSection === "work";
    if (href === "/#about") return pathname === "/" && activeSection === "about";
    if (href === "/#contact") return pathname === "/" && activeSection === "contact";
    return false;
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "border-b border-slate-200/70 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-black/20"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 text-lg font-bold text-white shadow-lg shadow-primary-500/25 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
              {personal.brand[0]}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {personal.brand}
              <span className="text-primary-500">.</span>
              <span className="ml-1 font-mono text-xs font-normal text-slate-400">dev</span>
              <span className="ml-1 rounded border border-primary-500/30 bg-primary-500/5 px-1 py-px font-mono text-[9px] font-medium tracking-wider text-primary-600 dark:text-primary-400">v2.1</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary-700 dark:text-primary-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg border border-primary-500/20 bg-primary-500/10 dark:bg-primary-400/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">
                  {isActive(link.href) ? `[ ${link.label} ]` : link.label}
                </span>
              </Link>
            ))}
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary-400/60 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CV
            </a>
            <ThemeToggle />
            <div aria-hidden="true" className="ml-1 flex h-3 items-end gap-0.5">
              {[8, 13, 6, 11, 9].map((h, i) => (
                <span
                  key={i}
                  className="eq-bar w-0.5 rounded-sm bg-primary-500/70"
                  style={{ height: h, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex min-w-0 flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive(link.href)
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              {link.icon}
              <span className="text-[10px] font-medium leading-tight">{link.label}</span>
              <span
                className={`absolute -bottom-1 h-1 w-1 rounded-full bg-primary-500 transition-opacity ${
                  isActive(link.href) ? "opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
