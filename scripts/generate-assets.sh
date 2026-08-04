#!/usr/bin/env bash
# Generate placeholder assets (icon, favicon, avatar, resume, project images).
# Dependencies: rsvg-convert (librsvg) + ImageMagick (magick).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC="$ROOT/public"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

FONT="DejaVu Sans, Arial, sans-serif"
MONO="DejaVu Sans Mono, monospace"

svg_to_jpg() { # $1=src.svg $2=dest.jpg $3=width $4=height
  rsvg-convert -w "$3" -h "$4" -o "$TMP/out.png" "$1"
  magick "$TMP/out.png" -quality 90 "$2"
}

# ── 1) PWA icon (SVG) + favicon.ico ─────────────────────────────
cat > "$TMP/icon.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#115e59"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="416" cy="96" r="140" fill="#5eead4" opacity="0.18"/>
  <circle cx="96" cy="432" r="160" fill="#2dd4bf" opacity="0.14"/>
  <text x="256" y="356" font-family="$FONT" font-size="290" font-weight="700" fill="#ffffff" text-anchor="middle">S</text>
</svg>
SVG

cp "$TMP/icon.svg" "$PUBLIC/icon.svg"
rsvg-convert -w 64 -h 64 -o "$TMP/icon-64.png" "$TMP/icon.svg"
magick "$TMP/icon-64.png" -define icon:auto-resize=64,48,32,16 "$PUBLIC/favicon.ico"
echo "✓ icon.svg + favicon.ico"

# ── 2) Avatar ────────────────────────────────────────────────────
cat > "$TMP/avatar.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#134e4a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="256" cy="180" r="110" fill="#ccfbf1"/>
  <circle cx="256" cy="500" r="220" fill="#042f2e" opacity="0.35"/>
  <text x="256" y="230" font-family="$FONT" font-size="130" font-weight="700" fill="#0d9488" text-anchor="middle">S</text>
  <text x="256" y="330" font-family="$FONT" font-size="34" font-weight="600" fill="#ffffff" text-anchor="middle">Syamsul</text>
  <text x="256" y="370" font-family="$MONO" font-size="18" fill="#99f6e4" text-anchor="middle">full-stack developer</text>
</svg>
SVG

svg_to_jpg "$TMP/avatar.svg" "$PUBLIC/avatar.jpg" 512 512
echo "✓ avatar.jpg"

# ── 3) Resume (PDF A4) ──────────────────────────────────────────
cat > "$TMP/resume.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842">
  <rect width="595" height="842" fill="#ffffff"/>
  <rect width="595" height="120" fill="#0d9488"/>
  <text x="40" y="60" font-family="$FONT" font-size="30" font-weight="700" fill="#ffffff">Syamsul</text>
  <text x="40" y="90" font-family="$MONO" font-size="14" fill="#ccfbf1">Full-Stack Developer — Indonesia</text>
  <text x="40" y="170" font-family="$FONT" font-size="16" font-weight="700" fill="#134e4a">Ringkasan</text>
  <text x="40" y="200" font-family="$FONT" font-size="12" fill="#334155">Membangun aplikasi web modern dengan React, Next.js, dan TypeScript.</text>
  <text x="40" y="230" font-family="$FONT" font-size="16" font-weight="700" fill="#134e4a">Keahlian</text>
  <text x="40" y="260" font-family="$FONT" font-size="12" fill="#334155">React / Next.js, TypeScript, Node.js, Tailwind CSS, PostgreSQL, Prisma, PHP / Laravel, Docker</text>
  <text x="40" y="300" font-family="$FONT" font-size="16" font-weight="700" fill="#134e4a">Pengalaman</text>
  <text x="40" y="330" font-family="$FONT" font-size="12" font-weight="700" fill="#0f172a">Senior Frontend Developer — Tech Corp (2024–sekarang)</text>
  <text x="40" y="350" font-family="$FONT" font-size="12" fill="#334155">Memimpin arsitektur frontend untuk platform SaaS 50K+ pengguna.</text>
  <text x="40" y="380" font-family="$FONT" font-size="12" font-weight="700" fill="#0f172a">Full-Stack Developer — StartupXYZ (2022–2024)</text>
  <text x="40" y="400" font-family="$FONT" font-size="12" fill="#334155">Membangun fitur inti produk di seluruh stack.</text>
  <text x="40" y="440" font-family="$FONT" font-size="16" font-weight="700" fill="#134e4a">Pendidikan</text>
  <text x="40" y="470" font-family="$FONT" font-size="12" fill="#334155">S1 Ilmu Komputer — Universitas (2018–2020)</text>
  <text x="40" y="810" font-family="$MONO" font-size="10" fill="#94a3b8">generated placeholder — ganti dengan resume asli Anda</text>
</svg>
SVG

rsvg-convert -o "$TMP/resume.png" "$TMP/resume.svg"
magick "$TMP/resume.png" -density 150 "$PUBLIC/resume.pdf"
echo "✓ resume.pdf"

# ── 4) Project images (1280×720) ────────────────────────────────
declare -A TITLES=(
  [1]="Platform E-Commerce"
  [2]="Asisten Chat AI"
  [3]="Dashboard Manajemen Proyek"
  [4]="Aplikasi Prakiraan Cuaca"
  [5]="Analitik Media Sosial"
  [6]="Pelacak Keuangan Pribadi"
)

for i in 1 2 3 4 5 6; do
  title="${TITLES[$i]}"
  cat > "$TMP/p$i.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#042f2e"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="1080" cy="120" r="260" fill="#14b8a6" opacity="0.22"/>
  <circle cx="180" cy="600" r="300" fill="#2dd4bf" opacity="0.10"/>
  <g fill="none" stroke="#5eead4" stroke-opacity="0.5" stroke-width="2">
    <path d="M40 660 l120 -120 M200 660 l120 -120 M360 660 l120 -120 M520 660 l120 -120 M680 660 l120 -120 M840 660 l120 -120 M1000 660 l120 -120"/>
  </g>
  <text x="640" y="380" font-family="$FONT" font-size="64" font-weight="700" fill="#ffffff" text-anchor="middle">$title</text>
  <text x="640" y="432" font-family="$MONO" font-size="20" fill="#99f6e4" text-anchor="middle">proyek $i / placeholder</text>
</svg>
SVG
  svg_to_jpg "$TMP/p$i.svg" "$PUBLIC/project-$i.jpg" 1280 720
done
echo "✓ project-1..6.jpg"

echo "Semua aset berhasil dibuat."
