export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Platform E-Commerce",
    description:
      "Platform e-commerce full-stack dengan manajemen inventaris real-time, integrasi pembayaran, dan dashboard admin.",
    tags: ["Next.js", "TypeScript", "Prisma", "Stripe"],
    image: "/project-1.jpg",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/username/project",
  },
  {
    id: "project-2",
    title: "Asisten Chat AI",
    description:
      "Aplikasi chat real-time bertenaga AI dengan respons kontekstual dan dukungan multi-bahasa.",
    tags: ["React", "Node.js", "OpenAI", "WebSocket"],
    image: "/project-2.jpg",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/username/project",
  },
  {
    id: "project-3",
    title: "Dashboard Manajemen Proyek",
    description:
      "Alat manajemen proyek kolaboratif dengan papan kanban, pelacakan waktu, dan analitik tim.",
    tags: ["Vue.js", "Firebase", "D3.js"],
    image: "/project-3.jpg",
    liveUrl: "https://example.com",
  },
  {
    id: "project-4",
    title: "Aplikasi Prakiraan Cuaca",
    description:
      "Aplikasi cuaca indah dengan prakiraan 7 hari, peta interaktif, dan peringatan cuaca ekstrem.",
    tags: ["React Native", "TypeScript", "GraphQL"],
    image: "/project-4.jpg",
    repoUrl: "https://github.com/username/project",
  },
  {
    id: "project-5",
    title: "Analitik Media Sosial",
    description:
      "Dashboard analitik untuk metrik media sosial dengan laporan kustom dan ekspor terjadwal.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis"],
    image: "/project-5.jpg",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/username/project",
  },
  {
    id: "project-6",
    title: "Pelacak Keuangan Pribadi",
    description:
      "Lacak pengeluaran, kelola anggaran, dan visualisasikan pola belanja dengan wawasan AI.",
    tags: ["Next.js", "tRPC", "Tailwind"],
    image: "/project-6.jpg",
    liveUrl: "https://example.com",
  },
];
