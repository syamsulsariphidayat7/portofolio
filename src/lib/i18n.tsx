"use client";

import { useSyncExternalStore } from "react";
import type { Project } from "@/content/projects";

/**
 * i18n statis ID/EN (permintaan Syamsul 22 Nov 2026) — pola yang sama
 * dengan uiSound/bootSignal: store eksternal mungil + localStorage.
 * Bahasa bawaan: Indonesia. Label teknis/HUD yang memang Inggris
 * (AVAILABLE // OPEN FOR WORK, log boot, skrip terminal, SYSTEM.DATA,
 * TRANSMISSION // SECURE, dst.) SENGAJA tidak masuk kamus — tetap
 * Inggris di kedua bahasa.
 */
export type Lang = "id" | "en";

const KEY = "pf-lang";
let current: Lang = "id";
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): Lang {
  try {
    return window.localStorage.getItem(KEY) === "en" ? "en" : "id";
  } catch {
    return "id";
  }
}

export const langStore = {
  subscribe(fn: () => void) {
    if (!hydrated) {
      hydrated = true;
      const stored = readStored();
      if (stored !== current) {
        current = stored;
        queueMicrotask(() => listeners.forEach((l) => l()));
      }
    }
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  getSnapshot(): Lang {
    return current;
  },
  getServerSnapshot(): Lang {
    return "id";
  },
  set(lang: Lang) {
    if (lang === current) return;
    current = lang;
    try {
      window.localStorage.setItem(KEY, lang);
    } catch {
      /* abaikan (mode privat dsb.) */
    }
    listeners.forEach((l) => l());
  },
};

const id = {
  nav: {
    home: "Beranda",
    featured: "Unggulan",
    about: "Tentang",
    projects: "Proyek",
    contact: "Kontak",
  },
  hero: {
    greeting: "Hai, saya",
    roles: [
      "Pengembang Full-Stack",
      "Frontend Engineer",
      "Backend Developer",
      "UI/UX Enthusiast",
    ],
    bio: "Saya membangun aplikasi web modern dengan teknologi terkini. Berpengalaman menciptakan solusi digital yang elegan, cepat, dan ramah pengguna.",
    viewProjects: "Lihat Proyek",
    contactMe: "Hubungi Saya",
    follow: "ikuti saya:",
  },
  showcase: {
    eyebrow: "// karya terpilih",
    titleA: "Proyek",
    titleB: "Unggulan",
    desc: "Beberapa proyek yang baru saja saya kerjakan — dari aplikasi full-stack hingga alat berbasis AI.",
    viewAll: "Lihat Semua Proyek",
    scrollHint: "telusuri arsip",
    ctaMono: "> buka semua proyek",
    ctaLine1: "Lihat",
    ctaAccent: "Arsip Lengkap",
    countSuffix: "Proyek",
  },
  services: {
    eyebrow: "// layanan",
    titleA: "Yang Saya",
    titleB: "Kerjakan",
    desc: "Dari ide hingga produksi — saya membantu membangun produk digital yang berdampak.",
    items: [
      {
        title: "Web Application",
        description:
          "Aplikasi web modern, responsif, dan cepat — dibangun dengan Next.js, React, dan TypeScript.",
      },
      {
        title: "Backend & API",
        description:
          "API yang cepat, aman, dan skalabel dengan Node.js, Laravel, dan PostgreSQL.",
      },
      {
        title: "UI/UX Design",
        description:
          "Dari Figma menjadi antarmuka yang hidup, intuitif, dan menyenangkan untuk dipakai.",
      },
      {
        title: "Optimasi & DevOps",
        description:
          "Performa tinggi, deployment otomatis, dan infrastruktur yang andal untuk produksi.",
      },
    ],
  },
  about: {
    eyebrow: "// tentang",
    titleA: "Tentang",
    titleB: "Saya",
    skills: "Keahlian",
    technologies: "teknologi",
    experience: "Pengalaman",
  },
  contact: {
    eyebrow: "// kontak",
    titleA: "Hubungi",
    titleB: "Saya",
    desc: "Ada proyek menarik atau ingin berkolaborasi? Saya selalu terbuka untuk obrolan.",
    ctaTitle: "Punya ide menarik? Mari wujudkan bersama.",
    ctaBody:
      "Jangan ragu untuk menyapa — saya biasanya membalas dalam 1x24 jam. Setiap proyek dimulai dari percakapan sederhana.",
    sendEmail: "Kirim Email",
    subject: "Halo Syamsul — dari portofolio",
    location: "Lokasi",
    socialLine: "Terhubung juga di media sosial —",
  },
  footer: {
    finaleQ: "ADA PROYEK?",
    finaleTalk: "MARI BICARA.",
    finaleBody:
      "Jangan ragu kirim pesan — saya selalu terbuka untuk kolaborasi, ide, atau sekadar obrolan ringan.",
    startChat: "Mulai Percakapan",
    rights: "Hak cipta dilindungi.",
  },
  projectsPage: {
    eyebrow: "// proyek",
    titleA: "Karya",
    titleB: "Saya",
    desc: "Kumpulan proyek yang telah saya bangun — dari aplikasi full-stack hingga alat open-source.",
    indexHead: "// index proyek",
    items: "item",
    demo: "Buka Demo",
    code: "Lihat Kode",
    collabTitle: "Tertarik berkolaborasi?",
    collabBody:
      "Punya ide atau proyek yang ingin dibangun? Mari diskusikan bersama.",
    collabSubject: "Kolaborasi proyek",
  },
  install: {
    title: "Install Aplikasi",
    subtitle: "Akses cepat dari layar utama",
    install: "Install",
  },
  notFound: {
    title: "Halaman tidak ditemukan",
    body: "halaman mungkin telah dipindahkan, dihapus, atau tidak pernah ada.",
    back: "KEMBALI KE BERANDA",
  },
  data: {
    statsLabels: [
      "Proyek Selesai",
      "Tahun Pengalaman",
      "Teknologi Dikuasai",
      "Klien Puas",
    ],
    timeline: [
      {
        title: "Senior Frontend Developer",
        company: "Tech Corp",
        description:
          "Memimpin arsitektur frontend untuk platform SaaS dengan 50K+ pengguna.",
      },
      {
        title: "Full-Stack Developer",
        company: "StartupXYZ",
        description:
          "Membangun fitur inti produk di seluruh stack, membimbing developer junior.",
      },
      {
        title: "Junior Developer",
        company: "Digital Agency",
        description:
          "Mengembangkan aplikasi web responsif untuk berbagai klien lintas industri.",
      },
      {
        title: "Ilmu Komputer",
        company: "Universitas",
        description:
          "Lulus dengan gelar Sarjana Ilmu Komputer, fokus pada teknologi web.",
      },
    ],
    projects: {
      "project-1": {
        title: "Platform E-Commerce",
        description:
          "Platform e-commerce full-stack dengan manajemen inventaris real-time, integrasi pembayaran, dan dashboard admin.",
      },
      "project-2": {
        title: "Asisten Chat AI",
        description:
          "Aplikasi chat real-time bertenaga AI dengan respons kontekstual dan dukungan multi-bahasa.",
      },
      "project-3": {
        title: "Dashboard Manajemen Proyek",
        description:
          "Alat manajemen proyek kolaboratif dengan papan kanban, pelacakan waktu, dan analitik tim.",
      },
      "project-4": {
        title: "Aplikasi Prakiraan Cuaca",
        description:
          "Aplikasi cuaca indah dengan prakiraan 7 hari, peta interaktif, dan peringatan cuaca ekstrem.",
      },
      "project-5": {
        title: "Analitik Media Sosial",
        description:
          "Dashboard analitik untuk metrik media sosial dengan laporan kustom dan ekspor terjadwal.",
      },
      "project-6": {
        title: "Pelacak Keuangan Pribadi",
        description:
          "Lacak pengeluaran, kelola anggaran, dan visualisasikan pola belanja dengan wawasan AI.",
      },
    } as Record<string, { title: string; description: string }>,
  },
};

export type Dict = typeof id;

const en: Dict = {
  nav: {
    home: "Home",
    featured: "Featured",
    about: "About",
    projects: "Projects",
    contact: "Contact",
  },
  hero: {
    greeting: "Hi, I'm",
    roles: [
      "Full-Stack Developer",
      "Frontend Engineer",
      "Backend Developer",
      "UI/UX Enthusiast",
    ],
    bio: "I build modern web applications with cutting-edge technology. Experienced in crafting digital solutions that are elegant, fast, and user-friendly.",
    viewProjects: "View Projects",
    contactMe: "Contact Me",
    follow: "follow me:",
  },
  showcase: {
    eyebrow: "// selected works",
    titleA: "Featured",
    titleB: "Projects",
    desc: "A few projects I've worked on recently — from full-stack applications to AI-powered tools.",
    viewAll: "View All Projects",
    scrollHint: "browse the archive",
    ctaMono: "> open all projects",
    ctaLine1: "View",
    ctaAccent: "Full Archive",
    countSuffix: "Projects",
  },
  services: {
    eyebrow: "// services",
    titleA: "What I",
    titleB: "Do",
    desc: "From idea to production — I help build digital products that make an impact.",
    items: [
      {
        title: "Web Application",
        description:
          "Modern, responsive, and fast web applications — built with Next.js, React, and TypeScript.",
      },
      {
        title: "Backend & API",
        description:
          "Fast, secure, and scalable APIs with Node.js, Laravel, and PostgreSQL.",
      },
      {
        title: "UI/UX Design",
        description:
          "From Figma to living interfaces that are intuitive and delightful to use.",
      },
      {
        title: "Optimization & DevOps",
        description:
          "High performance, automated deployment, and reliable infrastructure for production.",
      },
    ],
  },
  about: {
    eyebrow: "// about",
    titleA: "About",
    titleB: "Me",
    skills: "Skills",
    technologies: "technologies",
    experience: "Experience",
  },
  contact: {
    eyebrow: "// contact",
    titleA: "Get in",
    titleB: "Touch",
    desc: "Have an interesting project or want to collaborate? I'm always open for a chat.",
    ctaTitle: "Have an interesting idea? Let's build it together.",
    ctaBody:
      "Don't hesitate to say hello — I usually reply within 24 hours. Every project starts with a simple conversation.",
    sendEmail: "Send Email",
    subject: "Hello Syamsul — from your portfolio",
    location: "Location",
    socialLine: "Also connect with me on social media —",
  },
  footer: {
    finaleQ: "HAVE A PROJECT?",
    finaleTalk: "LET'S TALK.",
    finaleBody:
      "Don't hesitate to send a message — I'm always open to collaboration, ideas, or just a light chat.",
    startChat: "Start a Conversation",
    rights: "All rights reserved.",
  },
  projectsPage: {
    eyebrow: "// projects",
    titleA: "My",
    titleB: "Work",
    desc: "A collection of projects I've built — from full-stack applications to open-source tools.",
    indexHead: "// project index",
    items: "items",
    demo: "Live Demo",
    code: "View Code",
    collabTitle: "Interested in collaborating?",
    collabBody:
      "Have an idea or a project you want to build? Let's discuss it together.",
    collabSubject: "Project collaboration",
  },
  install: {
    title: "Install App",
    subtitle: "Quick access from your home screen",
    install: "Install",
  },
  notFound: {
    title: "Page not found",
    body: "the page may have been moved, deleted, or never existed.",
    back: "BACK TO HOME",
  },
  data: {
    statsLabels: [
      "Projects Completed",
      "Years of Experience",
      "Technologies Mastered",
      "Happy Clients",
    ],
    timeline: [
      {
        title: "Senior Frontend Developer",
        company: "Tech Corp",
        description:
          "Leading the frontend architecture for a SaaS platform with 50K+ users.",
      },
      {
        title: "Full-Stack Developer",
        company: "StartupXYZ",
        description:
          "Building core product features across the stack, mentoring junior developers.",
      },
      {
        title: "Junior Developer",
        company: "Digital Agency",
        description:
          "Developing responsive web applications for clients across industries.",
      },
      {
        title: "Computer Science",
        company: "University",
        description:
          "Graduated with a Bachelor's degree in Computer Science, focused on web technologies.",
      },
    ],
    projects: {
      "project-1": {
        title: "E-Commerce Platform",
        description:
          "Full-stack e-commerce platform with real-time inventory management, payment integration, and an admin dashboard.",
      },
      "project-2": {
        title: "AI Chat Assistant",
        description:
          "AI-powered real-time chat application with contextual responses and multi-language support.",
      },
      "project-3": {
        title: "Project Management Dashboard",
        description:
          "Collaborative project management tool with kanban boards, time tracking, and team analytics.",
      },
      "project-4": {
        title: "Weather Forecast App",
        description:
          "Beautiful weather app with 7-day forecasts, interactive maps, and extreme weather alerts.",
      },
      "project-5": {
        title: "Social Media Analytics",
        description:
          "Analytics dashboard for social media metrics with custom reports and scheduled exports.",
      },
      "project-6": {
        title: "Personal Finance Tracker",
        description:
          "Track expenses, manage budgets, and visualize spending patterns with AI insights.",
      },
    },
  },
};

export const dict: Record<Lang, Dict> = { id, en };

export function useLang() {
  const lang = useSyncExternalStore(
    langStore.subscribe,
    langStore.getSnapshot,
    langStore.getServerSnapshot,
  );
  return { lang, setLang: langStore.set, t: dict[lang] };
}

/** Judul + deskripsi proyek sesuai bahasa aktif (fallback: data asli). */
export function useProjectText(project: Project) {
  const { t } = useLang();
  return t.data.projects[project.id] ?? project;
}
