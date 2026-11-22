# PROGRESS — Portofolio Syamsul

Dokumen pelacak status proyek. Update setiap sesi kerja.

## Status Terakhir (update: 22 November 2026)

Remote `main` di commit `27148f8` ("migrasi ke Turbopack + @serwist/turbopack").
Proyek berjalan penuh: lint bersih, typecheck bersih, build produksi lolos.

Sejak update terakhir dokumen ini (4 Agustus 2026, commit `3da7074`) proyek
sudah melewati redesign total, tema sci-fi penuh, teknik awwwards, suara UI,
loading sinematik, dan migrasi Turbopack — semua tercatat di bawah.

## ✅ Selesai

### Fondasi
- **Hero** — judul kinetic text + terminal mengetik (`HeroTerminal.tsx`) sebagai visual utama + scroll indicator
- **NetworkBackground** — animasi partikel/network di latar belakang
- **Stats** — `StatCounter.tsx` animasi angka
- **About** — bio, `SkillBar.tsx` animasi, `Timeline.tsx` vertikal
- **Kontak** — kartu "Kirim Email Langsung" (mailto), info email/WhatsApp/lokasi/sosial
- **Tema** — dark/light/system via `next-themes` + `ThemeToggle.tsx`
- **Navbar** sticky desktop + bottom nav mobile
- **Loading screen**, smooth scroll (Lenis), custom 404, back-to-top, scroll progress bar
- **PWA** — manifest + service worker (Serwist), `InstallPrompt.tsx`
- **Aset placeholder** tersedia di `public/`: `icon.svg` + `favicon.ico`,
  `avatar.jpg`, `resume.pdf`, `project-1.jpg` … `project-6.jpg`
  (regenerasi: `bash scripts/generate-assets.sh`)

### Redesign premium + tema sci-fi (Agustus 2026)
- Redesign total tampilan jadi premium (commit `32d8eab`)
- Parallax sinematik multi-lapisan + tema sci-fi penuh: cyber grid 3D,
  scanlines CRT (`Scanlines.tsx`), HUD frame, glitch text, terminal hero
  (`HeroTerminal.tsx`), telemetry live (`Telemetry.tsx`)
- Parallax scroll berlapis — rotate/scale/fade, stat berjenjang, marquee
  (kecepatannya kini konstan — lihat sesi 22 Nov malam)

### Teknik awwwards + fitur lanjutan
- Showcase **Karya horizontal scroll pinned** (`HorizontalProjects.tsx`) —
  2 proyek unggulan (`FEATURED = projects.slice(0, 2)`) + panel CTA
- **List baris index proyek** + modal detail di `/projects` (`ProjectIndex.tsx`; deck 3D diganti 22 Nov 2026)
- Page transition View Transitions API (`ViewTransitions.tsx`)
- Custom cursor reticle HUD + label kontekstual (`CustomCursor.tsx`) —
  diganti pointer **Normal+** pada 22 Nov 2026, lihat "Perbaikan bug"
- Hologram wireframe globe interaktif (`HologramGlobe.tsx`), `Starfield3D.tsx`,
  `Float3D.tsx`
- Terminal interaktif easter egg (`TerminalOverlay.tsx`, tombol backtick)
- Scrollytelling About (`AboutScrolly.tsx`), minimap section (`SectionNav.tsx`),
  teks decrypt saat hover (`DecryptText.tsx`), kinetic text, magnetic button

### Suara UI + loading sinematik
- **Suara UI global** via Web Audio (`src/lib/uiSound.ts`, `GlobalSoundFX.tsx`)
  + `SoundToggle.tsx` persisten
- **Loading screen sinematik**: globe hologram + ring progress + tirai reveal

### Migrasi Turbopack + Serwist (commit `27148f8`)
- Build/dev memakai Turbopack; PWA pindah ke `@serwist/turbopack`
  (`next.config.ts` + `src/app/serwist/[path]/route.ts` + `sw.ts`)

### Perbaikan bug (22 November 2026)
- **Track Karya horizontal tidak pernah bergerak** — transform `x` dihitung
  tapi tidak dipasang ke elemen track; sekarang `motion.div` dengan
  `style={{ x }}`, kartu di luar layar bisa dicapai lagi
- **Lint hidup lagi** — `next lint` sudah dihapus di Next 16 dan config
  FlatCompat lama crash di ESLint 9; sekarang `eslint .` + flat config
  `eslint-config-next` (hasil: 32 error → **0**)
- **Parallax** — `useScroll` tidak lagi dipanggil kondisional (rules-of-hooks)
- **Visitor counter** — `api.countapi.xyz` sudah mati (counter selalu "?");
  diganti **Abacus** (`abacus.jasoncameron.dev`, model namespace/key sama)
- **Pola setState-di-effect** di 8 komponen diganti `useSyncExternalStore` /
  penyesuaian state saat render (pola yang sama dengan `SoundToggle`)
- `AboutCode.tsx` dihapus (dead code — dulu tercatat sebagai kandidat hapus)
- `serwist` dipin `9.5.11`, sama dengan `@serwist/turbopack`;
  `@eslint/eslintrc` dibuang (tak dipakai lagi)
- **Pointer diganti "Normal+"** — kursor bawaan browser tetap tampil
  (aturan `cursor: none` dibuang); reticle HUD + dot + glow + label
  diganti satu ring tipis teal 24px yang mengikuti mouse dengan lag
  spring: hover elemen interaktif membesar 1,5× sambil memudar, klik
  menyusut ke 0,85×. Tetap hanya aktif di pointer halus + non-reduced-motion

### Penyederhanaan arah desain (22 November 2026, sesi malam)
Arah sesi ini: kurangi gimmick, perjelas hierarki. Semua atas keputusan Syamsul.
- **Starfield3D** partikel 700 → 240; **Marquee** kecepatan konstan 32 dtk
  (reaktivitas scroll-velocity + parallax pita dicabut — dinilai bug)
- **Kartu showcase Karya** dibersihkan: duotone split, edge-light, glare,
  tilt mouse, pass-through 3D, dan shadow dinamis dicabut; kartu diperkecil
  (52vh/36vw), progress bar ditengahkan, nomor ghost diperbaiki
- **Navbar** tidak lagi sembunyi saat scroll (selama showcase ter-pin nav
  praktis hilang terus); menu tambah **Beranda**, label Karya → **Unggulan**
- **Hero dibongkar bertahap**: kartu avatar dibuat glass sebagian → terminal
  dipindah beberapa kali → **kartu avatar dihapus total**, terminal jadi
  visual utama (varian besar `size="lg"`); globe Starfield pindah ke tengah
  hero (`corePosition [0, 0.5, -3.5]`), kartu/terminal geser kiri tanpa
  menutupi globe; lebar container hero 90rem dan semua section halaman
  utama disamakan `px-[6vw]`
- **Radar hero diganti bingkai HUD tenang**: sapuan conic + aura muter +
  cincin lingkaran dibuang → ring persegi tipis + 4 bracket sudut
  berdenyut pelan (`animate-bracket-pulse`)
- **Timing hero dirapikan + digerbang boot**: tangga masuk 2,2/2,4/2,6 dtk
  (sisa era judul mengetik) → 0,35/0,5/0,65; animasi kini menunggu sinyal
  `bootSignal` dari LoadingScreen (ditunda +500ms setelah tirai mulai
  membuka) supaya tidak habis di balik layar boot
- **`/projects`**: deck kipas 3D → list baris index (`ProjectIndex.tsx`),
  modal detail dipertahankan
- **Multi-bahasa ID/EN + toggle** (`src/lib/i18n.tsx`): kamus statis dua
  bahasa untuk semua teks tampil (nav, hero, showcase, layanan, tentang,
  stats, kontak, footer, /projects + modal, prompt install, 404) termasuk
  data proyek/timeline/stats; pilihan tersimpan di localStorage
  (`pf-lang`), bawaan Indonesia. Label teknis/HUD yang memang Inggris
  (AVAILABLE // OPEN FOR WORK, log boot, skrip terminal, SYSTEM.DATA)
  dipertahankan Inggris di kedua bahasa. Terminal easter egg
  (`TerminalOverlay`) belum ikut diterjemahkan

## 🟡 Masih TODO / Catatan

- **Data proyek** (`src/content/projects.ts`) masih contoh: 6 judul contoh
  (Platform E-Commerce, Asisten Chat AI, dst.) dan `repoUrl` masih
  `github.com/username/project` — ganti judul, deskripsi, tags,
  `liveUrl`/`repoUrl` dengan proyek asli.
- **Gambar proyek** masih placeholder hasil generate — ganti dengan
  tangkapan layar asli saat tersedia. `avatar.jpg` sudah tidak ditampilkan
  di mana pun sejak visual hero diganti terminal (file masih di `public/`).
- **`resume.pdf`** masih placeholder — ganti dengan resume asli.
- **Panel admin** — rencana lengkap ada di `PLAN-admin-panel.md`, status
  masih DRAFT: keputusan storage (SQLite lokal / Turso / Supabase), auth,
  dan sinkronisasi halaman publik belum dikonfirmasi; belum diimplementasikan.
- **`pnpm-lock.yaml` masuk `.gitignore`** — install tidak reproducible dan
  versi bisa drift antar mesin (pernah menyebabkan mismatch versi serwist).
  Perlu keputusan: komit lockfile atau tetap diabaikan.
- **Deploy** — push manual ke GitHub, lalu Vercel + Cloudflare.
- Kontak memakai `mailto:` (tanpa backend) — tidak perlu API key.
- Sosial media sudah pakai handle `syamsulsariphidayat7` untuk
  GitHub/LinkedIn/Twitter/Instagram.

## Perintah

- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Start (produksi): `pnpm start`
- Generate aset: `bash scripts/generate-assets.sh`
