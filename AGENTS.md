# Portfolio — Konteks Projek

## Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5.8
- **Styling:** Tailwind CSS v4
- **Animasi:** Framer Motion 12
- **Theme:** next-themes (dark/light/system)
- **Package Manager:** pnpm
- **PWA:** @serwist/next
- **Deploy:** GitHub → Vercel + Cloudflare
- **Font:** Inter (next/font/google)

## Fitur
- Hero dengan typing effect
- Projects grid + 3D tilt card
- About (skill bar animasi, timeline)
- Contact (mailto: langsung ke klien email)
- Dark/light theme toggle
- Navbar sticky + bottom nav mobile
- Loading screen
- Smooth scroll
- Custom 404 page
- Back to Top button
- Scroll progress bar
- Stat counter animasi
- Install PWA prompt
- PWA (manifest + service worker)

## Struktur Folder
```
src/
├── app/
│   ├── globals.css          # Global styles, Tailwind, dark mode vars
│   ├── layout.tsx           # Root layout (metadata, fonts, wrapper)
│   ├── page.tsx             # Homepage (Hero + Work + Stats + About + Contact)
│   ├── not-found.tsx        # Custom 404 page
│   ├── icon.svg             # PWA icon inline (teal + "S")
│   ├── manifest.ts          # PWA manifest JSON
│   └── projects/
│       └── page.tsx         # /projects — semua proyek
├── components/
│   ├── ui/
│   │   ├── Badge.tsx        # Badge kecil (tag/label)
│   │   └── Button.tsx       # Reusable button (variant: primary | outline)
│   ├── providers.tsx        # ThemeProvider wrapper
│   ├── Navbar.tsx           # Sticky navbar + bottom nav mobile
│   ├── HeroSection.tsx      # Hero dengan typing effect
│   ├── ProjectCard.tsx      # 3D tilt card (props: project, index)
│   ├── SkillBar.tsx         # Animated skill bar (props: name, level, index)
│   ├── Timeline.tsx         # Timeline vertikal (props: items[])
│   ├── AnimatedSection.tsx  # Fade-in scroll wrapper (props: delay?)
│   ├── ThemeToggle.tsx      # Tombol dark/light mode
│   ├── LoadingScreen.tsx    # Loader animasi di awal
│   ├── TypingEffect.tsx     # Efek ketik otomatis
│   ├── AboutCode.tsx        # Alternatif section "tentang" (tidak dipakai)
│   ├── Footer.tsx           # Footer dengan credit + visitor counter
│   ├── BackToTop.tsx        # Floating button kembali ke atas
│   ├── ScrollProgress.tsx   # Progress bar horizontal di atas
│   ├── StatCounter.tsx      # Animated stat counter (props: items[])
│   ├── InstallPrompt.tsx    # Prompt install PWA
│   └── VisitorCounter.tsx   # Visitor counter via countapi.xyz
├── content/
│   ├── personal.ts          # Data personal, skills, timeline, social, stats
│   └── projects.ts          # Data proyek + interface Project
└── scripts/
    └── generate-assets.sh   # Generate aset placeholder (icon, avatar, resume, gambar proyek)
```

## Halaman & Routing
| Route | File | Konten |
|---|---|---|
| `/` | `src/app/page.tsx` | Hero → Work (3 proyek) → Stats → About (bio + skills + timeline) → Contact |
| `/projects` | `src/app/projects/page.tsx` | Semua proyek (6 item) |

## Data Management
Semua data statis dari TypeScript (`src/content/`). Tidak ada CMS, database, atau API.

### `src/content/personal.ts`
```ts
export const personal = {
  name: "Syamsul",
  brand: "Syamsul",
  role: "Pengembang Full-Stack",
  email: "syamsulsariphidayat@gmail.com",
  phone: "082120256228",
  location: "Indonesia",
  domain: "boundless.my.id",
  bio: "Saya membangun aplikasi web modern...",
  avatar: "/avatar.jpg",
  resumeUrl: "/resume.pdf",
  stats: { label: string, value: number }[]  // 4 item (proyek, pengalaman, teknologi, klien)
  social: {
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    twitter: "https://twitter.com/username",
    instagram: "https://instagram.com/username",
  },
  skills: { name: string, level: number }[]  // 16 skill, level 0-100
  timeline: { year: string, title: string, company: string, description: string }[]
}
```

### `src/content/projects.ts`
```ts
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;       // path relatif, taruh di /public
  liveUrl?: string;
  repoUrl?: string;
}
```
Ada 6 proyek. Untuk gambar sementara pakai placeholder `/project-1.jpg` s/d `/project-6.jpg`.

## Konvensi Kode
- **Import:** Path alias `@/` → `src/`
- **Komponen:** functional component, export default untuk halaman, named export untuk komponen biasa
- **Styling:** Utility classes Tailwind, warna pakai `primary-*` (cyan/teal), `slate-*` untuk teks/bg netral
- **Animasi:** Framer Motion `motion.div` dengan varian `fadeInUp` (biasanya `AnimatedSection` wrapper)
- **Props komponen animasi:** `index` untuk stagger delay (dikalikan 0.1s)
- **Responsive:** mobile-first, breakpoint `sm:`, `md:`, `lg:`
- **Dark mode:** class strategy (Tailwind `dark:` prefix), diatur next-themes

## Catatan Penting
- Build: `pnpm build` — Dev: `pnpm dev`
- Agent hanya commit lokal, push manual user
- Deploy: local → GitHub → Vercel + Cloudflare
- Kontak memakai `mailto:` (tidak pakai Formspree)
- Sosial media: handle `syamsulsariphidayat7`
- `AboutCode.tsx` tidak dipakai
- Aset placeholder tersedia di `public/` (icon.svg, favicon.ico, avatar.jpg, resume.pdf, project-1..6.jpg). Regenerasi: `bash scripts/generate-assets.sh`
- Status terkini ada di `PROGRESS.md`
- Portofolio bilingual Indonesia
