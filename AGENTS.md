# Portfolio — Konteks Projek

## Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5.8
- **Styling:** Tailwind CSS v4
- **Animasi:** Framer Motion 12
- **Smooth Scroll:** Lenis (`autoRaf`, native touch)
- **Theme:** next-themes (dark/light/system)
- **Package Manager:** pnpm
- **PWA:** @serwist/next
- **Deploy:** GitHub → Vercel + Cloudflare
- **Font:** Inter (next/font/google)

## Fitur
- Hero: judul kinetic text + terminal mengetik sebagai visual utama + parallax kursor multi-lapisan (terminal, chip, glow)
- Projects grid + 3D tilt spring + parallax gambar dalam bingkai + glare spotlight
- Parallax scroll (komponen `Parallax`, orbs dekoratif tiap section)
- Smooth scroll Lenis + marquee kecepatan konstan (32 dtk) + section heading masked reveal
- Magnetic button, tilt card reusable, reveal teks per kata
- Nuansa sci-fi: cyber grid 3D (Tron), scanlines CRT, HUD frame + corner bracket, glitch text, terminal boot loading, readout status (uptime/koordinat), circuit pattern
- Digital rain Matrix (jarang, komponen `DigitalRain`), bingkai HUD bracket berdenyut di hero (pengganti radar sweep + energy aura), shooting star
- Jaringan partikel reaktif kursor (garis + tarikan lembut, `NetworkBackground`)
- Terminal interaktif easter egg (`TerminalOverlay`): tekan tombol ` buka, perintah help/about/skills/projects/contact/social/whoami/date/clear/exit
- Teknik awwwards: horizontal scroll showcase pinned (`HorizontalProjects`, progress bar + index + dock-focus), page transition View Transitions API (`ViewTransitions`), pointer Normal+ — ring aksen tipis mengikuti kursor bawaan (`CustomCursor`), list baris index proyek + modal detail (`ProjectIndex`)
- Velocity skew heading (`SectionHeading`), text decrypt hover (`DecryptText`), scrollytelling skill bar & timeline scrub (`AboutScrolly`, mode `progress` di `SkillBar`/`Timeline`)
- Hologram wireframe globe canvas (`HologramGlobe`), full-page footer finale, minimap section HUD (`SectionNav`), duotone chromatic split hover (`.duotone`)
- About (skill bar scrub mengikuti scroll + timeline menyala per item)
- Contact (mailto: langsung ke klien email)
- Dark/light theme toggle
- Multi-bahasa ID/EN: kamus statis `src/lib/i18n.tsx` (store eksternal + localStorage `pf-lang`, bawaan ID), toggle `LangToggle` di navbar; label HUD/teknis yang memang Inggris (log boot, skrip terminal, SYSTEM.DATA, dst.) tetap Inggris di kedua bahasa
- Navbar selalu tampil (hide-on-scroll dicabut) + bottom nav mobile; menu: Beranda, Unggulan, Tentang, Proyek, Kontak
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
│   ├── page.tsx             # Homepage (Hero + Karya horizontal scroll + Stats + About + Contact)
│   ├── not-found.tsx        # Custom 404 page
│   ├── icon.svg             # PWA icon inline (teal + "S")
│   ├── manifest.ts          # PWA manifest JSON
│   └── projects/
│       └── page.tsx         # /projects — semua proyek
├── components/
│   ├── ui/
│   │   ├── Badge.tsx        # Badge kecil (tag/label)
│   │   └── Button.tsx       # Reusable button (variant: primary | outline | light | glass)
│   ├── providers.tsx        # ThemeProvider wrapper
│   ├── SmoothScroll.tsx     # Inisialisasi Lenis + intercept anchor; export stop/startSmoothScroll
│   ├── ViewTransitions.tsx  # Page transition antar rute (View Transitions API, capture + stopPropagation)
│   ├── CustomCursor.tsx     # Pointer Normal+: ring tipis mengikuti kursor bawaan (hover membesar 1,5x, klik menyusut 0,85x)
│   ├── DecryptText.tsx      # Teks mendekripsi karakter acak saat hover
│   ├── SectionNav.tsx       # Minimap section vertikal di tepi kanan (HUD)
│   ├── HologramGlobe.tsx    # Globe wireframe 3D canvas (reaktif kursor, tanpa three.js)
│   ├── AboutScrolly.tsx     # Skill bar + timeline scrub mengikuti scroll
│   ├── HorizontalProjects.tsx # Section Karya pinned horizontal scroll + fallback grid (reduced-motion)
│   ├── ProjectIndex.tsx # List baris index proyek + modal detail (/projects)
│   ├── Parallax.tsx         # Wrapper parallax scroll (props: speed?, global?)
│   ├── TiltCard.tsx         # Tilt 3D reusable + glare (props: intensity?, glare?)
│   ├── Magnetic.tsx         # Elemen tertarik kursor (props: strength?)
│   ├── RevealText.tsx       # Reveal teks per kata (props: text, delay?, stagger?)
│   ├── Navbar.tsx           # Sticky navbar + bottom nav mobile
│   ├── HeroSection.tsx      # Hero: kinetic text + terminal visual utama + parallax kursor/scroll
│   ├── ProjectCard.tsx      # Tilt spring + parallax gambar + glare (props: project, index)
│   ├── SkillBar.tsx         # Skill bar; mode scrub via prop progress?: MotionValue (props: name, level, index, progress?, total?)
│   ├── Timeline.tsx         # Timeline vertikal; mode scrub via prop progress?: MotionValue (props: items, progress?, total?)
│   ├── SectionHeading.tsx   # Heading section dengan masked reveal
│   ├── Marquee.tsx          # Pita teknologi, kecepatan konstan 32 detik
│   ├── AnimatedSection.tsx  # Fade-in scroll wrapper (props: delay?)
│   ├── ThemeToggle.tsx      # Tombol dark/light mode
│   ├── LangToggle.tsx       # Toggle bahasa ID/EN (mono, di navbar)
│   ├── ProjectsBody.tsx     # Isi /projects (klien, demi useLang); page.tsx server hanya metadata
│   ├── LoadingScreen.tsx    # Loader animasi di awal
│   ├── TypingEffect.tsx     # Efek ketik otomatis
│   ├── SocialLinks.tsx      # Ikon sosial media bersama
│   ├── Footer.tsx           # Footer dengan credit + visitor counter
│   ├── BackToTop.tsx        # Floating button kembali ke atas (ring progres)
│   ├── ScrollProgress.tsx   # Progress bar atas (spring halus)
│   ├── StatCounter.tsx      # Animated stat counter (props: items[])
│   ├── InstallPrompt.tsx    # Prompt install PWA
│   └── VisitorCounter.tsx   # Visitor counter via Abacus
├── content/
│   ├── personal.ts          # Data personal, skills, timeline, social, stats
│   └── projects.ts          # Data proyek + interface Project
└── scripts/
    └── generate-assets.sh   # Generate aset placeholder (icon, avatar, resume, gambar proyek)
```

## Halaman & Routing
| Route | File | Konten |
|---|---|---|
| `/` | `src/app/page.tsx` | Hero → Karya (horizontal scroll) → Layanan → Tentang (scrollytelling) → Stats (hologram globe) → Kontak → Footer finale |
| `/projects` | `src/app/projects/page.tsx` | Semua proyek (6 item, stacked deck + modal) |

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
- Smooth scroll Lenis: `autoRaf: true`, touch native; disabled saat `prefers-reduced-motion`; modal bisa pause via `stopSmoothScroll()`/`startSmoothScroll()`
- Pointer Normal+: kursor bawaan TIDAK disembunyikan; ring aksen hanya aktif pointer fine + non-reduced-motion; hover interaktif dideteksi via `a, button, [data-cursor], [role="button"]` (atribut `data-cursor` kini hanya penanda interaktif, labelnya sudah tidak ada)
- Page transition: `document.startViewTransition` (Chromium); fallback navigasi biasa di browser lain; hash link tetap milik Lenis
- Sosial media: handle `syamsulsariphidayat7`
- `AboutCode.tsx` tidak dipakai
- Aset placeholder tersedia di `public/` (icon.svg, favicon.ico, avatar.jpg, resume.pdf, project-1..6.jpg). Regenerasi: `bash scripts/generate-assets.sh`
- Status terkini ada di `PROGRESS.md`
- Portofolio bilingual Indonesia
