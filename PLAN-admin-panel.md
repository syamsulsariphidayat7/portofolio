# Rencana Fitur: Panel Admin Portofolio

> Status: **DRAFT — belum diimplementasikan.** Simpanan rencana agar bisa dilanjutkan.
> Dibuat: 4 Agustus 2026. Proyek: `portofolio` (Next.js 16 + React 19 + TS 5.8 + Tailwind v4).

## 1. Tujuan

Panel admin untuk **memanajemen konten portofolio secara lengkap** (CRUD), lengkap dengan **data seed sementara** agar langsung bisa dipakai/diuji.

Permintaan user: *"add panel admin untuk managemen portfolio lengkap beserta seed sementara"*.

## 2. Kondisi Saat Ini

- Semua konten statis dari TypeScript (`src/content/personal.ts`, `src/content/projects.ts`).
- Tidak ada database, tidak ada API, tidak ada auth.
- Halaman publik: `/` (home) dan `/projects`, semuanya static prerender (SSG).
- PWA via Serwist (`sw.ts`, `next.config.ts`).
- Deploy target: GitHub → Vercel + Cloudflare.
- Struktur konten yang perlu dikelola:
  - **Proyek** (`projects.ts`): id, title, description, tags[], image, liveUrl?, repoUrl?
  - **Personal** (`personal.ts`): name, brand, role, email, phone, location, bio, domain, avatar, resumeUrl
  - **Stats**: label + value (4 item)
  - **Skills**: name + level 0-100 (16 item)
  - **Timeline**: year, title, company, description (4 item)
  - **Social**: github, linkedin, twitter, instagram

## 3. Keputusan Arsitektur — BELUM DIKONFIRMASI

User sempat dimintai konfirmasi (dialog `ask_user`) tapi **di-skip**. Keputusan ini masih terbuka:

### 3a. Storage (3 opsi)
| Opsi | Pro | Kontra |
|---|---|---|
| **SQLite lokal (better-sqlite3)** | Zero konfigurasi, seed otomatis, ideal demo lokal | Di Vercel serverless tulisannya tidak persist (filesystem ephemeral) |
| **Turso (cloud SQLite / libSQL)** | Persist di Vercel & Cloudflare juga, gratis tier | Perlu akun + env var (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) |
| **Supabase** | Postgres + auth bawaan, lengkap | Paling berat, butuh akun + setup |

Catatan riset (Gravity Index): untuk solusi mandiri tanpa akun cloud, **better-sqlite3** adalah pilihan yang direkomendasikan. Turso dipilih jika ingin persist di production. D1 (Cloudflare) relevan hanya jika memindahkan runtime ke Cloudflare Workers.

### 3b. Autentikasi (2 opsi)
| Opsi | Pro | Kontra |
|---|---|---|
| **Password + session cookie** | Env var `ADMIN_PASSWORD`, cookie httpOnly + signed, tanpa dependency eksternal, aman untuk single admin | Perlu implementasi login/logout sendiri |
| **Tanpa auth dulu** | Paling cepat untuk demo | Panel terbuka untuk publik (tidak aman) |

Riset menyarankan **custom cookie auth** (tanpa service eksternal) untuk kebutuhan single-admin.

### 3c. Entitas yang dikelola (multi-select, default: semua)
- [x] Proyek (CRUD)
- [x] Skill (CRUD)
- [x] Timeline (CRUD)
- [x] Stats (CRUD)
- [x] Data personal (edit)
- [ ] Upload gambar (via panel) — opsional, butuh storage file

## 4. Desain yang Diusulkan

### Rute baru
```
/admin                     → halaman login (jika belum login) / dashboard
/admin/login               → form login password
/api/admin/login           → POST, set session cookie
/api/admin/logout          → POST, hapus session cookie
/api/admin/projects        → GET (list) / POST (create)
/api/admin/projects/[id]   → GET / PUT / DELETE
/api/admin/skills          → GET / POST
/api/admin/skills/[id]     → PUT / DELETE
/api/admin/timeline        → GET / POST
/api/admin/timeline/[id]   → PUT / DELETE
/api/admin/stats           → GET / POST
/api/admin/stats/[id]      → PUT / DELETE
/api/admin/personal        → GET / PUT
```
Semua rute `/api/admin/*` dilindungi middleware/helper auth (cek cookie session).

### Struktur file yang direncanakan
```
src/
├── lib/
│   ├── db.ts              # Koneksi DB (abstraksi, ganti-ganti storage mudah)
│   ├── schema.ts          # Skema tabel / tipe data
│   ├── seed.ts            # Data seed sementara (dari isi content/ saat ini)
│   └── auth.ts            # Helper session cookie (sign/verify, bcrypt/scrypt password)
├── app/
│   ├── admin/
│   │   ├── layout.tsx     # Layout panel (sidebar, guard auth)
│   │   ├── login/page.tsx
│   │   ├── page.tsx       # Dashboard (ringkasan + link CRUD)
│   │   ├── projects/page.tsx / [id]/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── stats/page.tsx
│   │   └── personal/page.tsx
│   └── api/admin/...      # Route handlers
├── components/admin/
│   ├── Sidebar.tsx
│   ├── DataTable.tsx
│   ├── ProjectForm.tsx
│   ├── SkillForm.tsx
│   ├── TimelineForm.tsx
│   └── PersonalForm.tsx
```

### Middleware / guard
- `middleware.ts` (atau helper di tiap route) memeriksa cookie sesi sebelum akses `/admin` dan `/api/admin/*`.
- Session: cookie `admin_session`, nilai signed (HMAC) atau token acak yang disimpan, TTL mis. 7 hari.

### Sinkronisasi halaman publik (opsional, belum diputuskan)
Karena halaman publik saat ini SSG dari `content/*.ts`:
- **Opsi A**: Halaman publik tetap baca dari DB (jadikan dynamic/server-rendered) supaya perubahan admin langsung tampil. Perlu perubahan `page.tsx` & `projects/page.tsx`.
- **Opsi B**: Halaman publik tetap statis; perubahan admin hanya terlihat setelah regenerate/build. Lebih sederhana, konsisten dengan PWA SSG.
- **Opsi C (hybrid)**: Halaman publik baca DB, fallback ke `content/*.ts` bila DB kosong. (Rekomendasi)

## 5. Langkah Implementasi (urutan)

1. **Setup storage + seed**
   - Install dependency sesuai keputusan storage (mis. `better-sqlite3` atau `@libsql/client`).
   - `src/lib/schema.ts` + `db.ts` + `seed.ts` (isi awal = data dari `content/` saat ini).
   - Script `pnpm seed` di `package.json`.
2. **Auth**
   - `src/lib/auth.ts` (password hash + session cookie).
   - Halaman `/admin/login` + `/api/admin/login` & `/api/admin/logout`.
   - Guard rute admin (middleware/helper).
3. **API CRUD**
   - Route handlers untuk projects, skills, timeline, stats, personal.
4. **UI Panel**
   - `layout.tsx` admin dengan sidebar navigasi.
   - Dashboard + halaman CRUD tiap entitas (tabel + form).
5. **Integrasi halaman publik** (per keputusan §4 sinkronisasi).
6. **Verifikasi**
   - `pnpm build` (typecheck + build sukses).
   - Uji manual: login → CRUD → cek halaman publik berubah (jika Opsi A/C).
   - Review kode + audit keamanan dasar (protect API, input validation).

## 6. Catatan Keamanan

- Jangan simpan password plaintext — hash (scrypt/bcrypt) di env atau DB.
- Semua endpoint admin wajib cek session, bukan hanya UI.
- Validasi input di server (zod opsional, atau manual).
- Cookie `httpOnly`, `sameSite: lax`, `secure` di production.
- Jangan commit `.env` (sudah di `.gitignore`).

## 7. TODO Setelah Implementasi

- [ ] Ganti seed sementara dengan data asli (diisi lewat panel admin).
- [ ] Upload gambar (jika dipilih) — simpan ke `public/uploads/` atau blob storage.
- [ ] Dokumentasi cara pakai panel admin di PROGRESS.md / AGENTS.md.
